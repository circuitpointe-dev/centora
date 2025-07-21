import React, { useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface SubmissionType {
  id: string;
  name: string;
  enabled: boolean;
  isCustom?: boolean;
}

interface TemplateUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submissionTypes: SubmissionType[];
  onTemplateUpload: (template: any) => void;
}

export const TemplateUploadModal: React.FC<TemplateUploadModalProps> = ({
  open,
  onOpenChange,
  submissionTypes,
  onTemplateUpload
}) => {
  const [templateName, setTemplateName] = useState('');
  const [templateType, setTemplateType] = useState('');
  const [description, setDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (!templateName || !templateType || !selectedFile) return;

    const template = {
      id: `template-${Date.now()}`,
      name: templateName,
      type: templateType,
      description,
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      uploadDate: new Date().toISOString()
    };

    onTemplateUpload(template);
    
    // Reset form
    setTemplateName('');
    setTemplateType('');
    setDescription('');
    setSelectedFile(null);
    onOpenChange(false);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const enabledSubmissionTypes = submissionTypes.filter(type => type.enabled);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md backdrop-blur-sm bg-background/95 border shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Upload Template</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Template Name */}
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
              className="rounded-sm"
            />
          </div>

          {/* Template Type */}
          <div className="space-y-2">
            <Label htmlFor="template-type">Template Type</Label>
            <Select value={templateType} onValueChange={setTemplateType}>
              <SelectTrigger className="rounded-sm">
                <SelectValue placeholder="Select submission type" />
              </SelectTrigger>
              <SelectContent>
                {enabledSubmissionTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter template description (optional)"
              className="rounded-sm resize-none"
              rows={3}
            />
          </div>

          {/* File Upload Area */}
          <div className="space-y-2">
            <Label>Upload File</Label>
            <div
              className={cn(
                "relative border-2 border-dashed rounded-sm p-6 transition-colors cursor-pointer",
                dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                selectedFile && "border-primary bg-primary/5"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">
                    <span className="font-medium text-primary">Click to browse</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOC, DOCX, XLS, XLSX, TXT files up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!templateName || !templateType || !selectedFile}
              className="rounded-sm"
            >
              Upload Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};