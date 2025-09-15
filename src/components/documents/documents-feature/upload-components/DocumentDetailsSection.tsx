import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import TagSelection from './TagSelection';
import DocumentOwnerSelect from './DocumentOwnerSelect';
import DepartmentSelect from './DepartmentSelect';

interface DocumentDetailsSectionProps {
  selectedFile: File | null;
  onUpload: () => void;
  onCancel: () => void;
}

interface Tag {
  name: string;
  color: string;
}

const DocumentDetailsSection = ({
  selectedFile,
  onUpload,
  onCancel,
}: DocumentDetailsSectionProps) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [documentOwner, setDocumentOwner] = useState('');
  const [department, setDepartment] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Set default title when file is selected
  React.useEffect(() => {
    if (selectedFile && !title) {
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
    }
  }, [selectedFile, title]);

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for the document.",
        variant: "destructive",
      });
      return;
    }

    if (!category) {
      toast({
        title: "Category required", 
        description: "Please select a category for the document.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Convert file to base64
      const fileBuffer = await selectedFile.arrayBuffer();
      const base64String = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));
      
      // Upload via edge function
      const { data, error } = await supabase.functions.invoke('document-operations', {
        body: {
          operation: 'upload',
          data: {
            fileName: selectedFile.name,
            fileContent: base64String,
            title: title.trim(),
            description: description.trim() || undefined,
            category: category,
            tags: selectedTags.map(tag => tag.name) // Convert to tag names/IDs
          }
        }
      });

      if (error) throw error;
      
      toast({
        title: "Upload Successful",
        description: `${selectedFile.name} has been uploaded successfully.`,
      });
      onUpload();
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="flex flex-col w-full gap-12 p-8 bg-white rounded-[5px] shadow-[0px_4px_16px_#eae2fd] h-fit">
      <div className="flex flex-col items-start gap-4 w-full">
        <h3 className="text-[#383838] text-base font-bold">
          Document Details
        </h3>

        {selectedFile && (
          <div className="flex flex-col items-start gap-2 w-full p-4 bg-gray-50 rounded-[5px]">
            <p className="font-medium text-[#383838] text-sm">Selected File:</p>
            <p className="font-normal text-[#38383880] text-sm">{selectedFile.name}</p>
            <p className="font-normal text-[#38383880] text-xs">
              Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        <div className="flex flex-col items-start gap-6 w-full">
          {/* Title */}
          <div className="flex flex-col items-start gap-2 w-full">
            <Label className="font-medium text-[#383838e6] text-sm">
              Document Title *
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
              className="px-4 py-3 rounded-[5px] border border-[#d9d9d9]"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col items-start gap-2 w-full">
            <Label className="font-medium text-[#383838e6] text-sm">
              Description
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter document description (optional)"
              className="px-4 py-3 rounded-[5px] border border-[#d9d9d9] min-h-[80px]"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col items-start gap-2 w-full">
            <Label className="font-medium text-[#383838e6] text-sm">
              Category *
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="px-4 py-3 rounded-[5px] border border-[#d9d9d9]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="policies">Policies</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="contracts">Contracts</SelectItem>
                <SelectItem value="m-e">Monitoring & Evaluation</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="uncategorized">Uncategorized</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TagSelection
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
          />

          <DocumentOwnerSelect
            value={documentOwner}
            onChange={setDocumentOwner}
          />

          <DepartmentSelect
            value={department}
            onChange={setDepartment}
          />

          <div className="flex flex-col items-start gap-2 w-full">
            <Label className="font-medium text-[#383838e6] text-sm">
              Expiry Date
            </Label>

            <div className="relative w-full">
              <Input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="px-4 py-3 pr-10 rounded-[5px] border border-[#d9d9d9]"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-[18px] h-[18px] text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full items-start gap-6">
        <Button
          onClick={handleUpload}
          className="w-full h-[43px] bg-violet-600 hover:bg-violet-700 rounded-[5px]"
          disabled={!selectedFile || isUploading || !title.trim() || !category}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span className="font-medium text-white text-sm">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              <span className="font-medium text-white text-sm">Upload Files</span>
            </>
          )}
        </Button>

        <Button
          onClick={onCancel}
          variant="outline"
          className="w-full h-[43px] rounded-[5px] border border-[#d9d9d9]"
          disabled={isUploading}
        >
          <span className="font-medium text-[#38383899] text-sm">
            Cancel
          </span>
        </Button>
      </div>
    </Card>
  );
};

export default DocumentDetailsSection;