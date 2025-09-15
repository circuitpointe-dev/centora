import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useCreateDocument } from '@/hooks/useDocuments';
import { uploadFile } from '@/hooks/useDocumentStorage';
import { toast } from 'sonner';

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });
  const [uploading, setUploading] = useState(false);

  const createDocumentMutation = useCreateDocument();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      
      // Auto-fill title from filename
      if (!formData.title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setFormData(prev => ({ ...prev, title: nameWithoutExt }));
      }
    }
  }, [formData.title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/*': ['.txt', '.csv'],
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!formData.title || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);

    try {
      // Generate file path
      const timestamp = Date.now();
      const filePath = `documents/${timestamp}-${selectedFile.name}`;
      
      // Upload file to storage
      await uploadFile(selectedFile, filePath);
      
      // Create document record
      await createDocumentMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        file_name: selectedFile.name,
        file_path: filePath,
        file_size: selectedFile.size,
        mime_type: selectedFile.type,
      });
      
      // Reset form and close dialog
      setSelectedFile(null);
      setFormData({ title: '', description: '', category: '' });
      onOpenChange(false);
      
      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          {!selectedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-violet-400 bg-violet-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                {isDragActive
                  ? 'Drop your file here'
                  : 'Drop your file here or click to browse'}
              </p>
              <p className="text-gray-500">
                Supports PDF, Word docs, images, and text files (max 10MB)
              </p>
            </div>
          ) : (
            <div className="border rounded-lg p-4 flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div className="flex-1">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {/* Document Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Document Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter document title"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="policies">Policies</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="contracts">Contracts</SelectItem>
                  <SelectItem value="m-e">M&E</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="templates">Templates</SelectItem>
                  <SelectItem value="uncategorized">Uncategorized</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the document"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-violet-600 hover:bg-violet-700"
              disabled={uploading || !selectedFile}
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};