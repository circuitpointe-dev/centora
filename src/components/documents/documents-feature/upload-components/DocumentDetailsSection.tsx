
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Building2,
  Calendar,
  Search as SearchIcon,
  Tag as TagIcon,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentDetailsSectionProps {
  selectedFile: File | null;
  onUpload: () => void;
  onCancel: () => void;
}

const DocumentDetailsSection = ({
  selectedFile,
  onUpload,
  onCancel,
}: DocumentDetailsSectionProps) => {
  const [tags, setTags] = useState([
    { name: "HR", color: "bg-[#f9e6fd] text-[#cb27f5]" },
    { name: "Contract", color: "bg-[#e8fbef] text-[#17a34b]" },
  ]);
  const [newTag, setNewTag] = useState('');
  const [documentOwner, setDocumentOwner] = useState('');
  const [department, setDepartment] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const { toast } = useToast();

  const handleAddTag = () => {
    if (newTag.trim()) {
      const colors = [
        "bg-[#f9e6fd] text-[#cb27f5]",
        "bg-[#e8fbef] text-[#17a34b]",
        "bg-[#fef3e2] text-[#f59e0b]",
        "bg-[#eff6ff] text-[#3b82f6]",
      ];
      setTags([...tags, { 
        name: newTag.trim(), 
        color: colors[Math.floor(Math.random() * colors.length)]
      }]);
      setNewTag('');
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    // Simulate upload process
    toast({
      title: "Upload Successful",
      description: `${selectedFile.name} has been uploaded successfully.`,
    });
    onUpload();
  };

  return (
    <Card className="flex flex-col w-full gap-12 p-8 bg-white rounded-[5px] shadow-[0px_4px_16px_#eae2fd] h-fit">
      <div className="flex flex-col items-start gap-4 w-full">
        <h3 className="text-[#383838] text-base font-medium">
          Document Details
        </h3>

        {selectedFile && (
          <div className="flex flex-col items-start gap-2 w-full p-4 bg-gray-50 rounded-[5px]">
            <p className="font-medium text-[#383838] text-sm">Selected File:</p>
            <p className="font-normal text-[#38383880] text-sm">{selectedFile.name}</p>
          </div>
        )}

        <div className="flex flex-col items-start gap-8 w-full">
          <div className="flex flex-col items-start gap-4 w-full">
            <div className="flex flex-col items-start gap-2 w-full">
              <Label className="font-medium text-[#383838e6] text-sm">
                Tag
              </Label>

              <div className="flex items-center gap-2 w-full">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tags..."
                  className="flex-1 px-4 py-3 rounded-[5px] border border-[#d9d9d9]"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button
                  onClick={handleAddTag}
                  size="sm"
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  <TagIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  className={`h-[25px] px-2.5 py-2 ${tag.color}`}
                >
                  <span className="font-medium text-xs">
                    {tag.name}
                  </span>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 w-full">
            <Label className="text-[#383838e6] text-sm font-medium">
              Document Owner
            </Label>

            <div className="relative w-full">
              <Input
                value={documentOwner}
                onChange={(e) => setDocumentOwner(e.target.value)}
                placeholder="Search people..."
                className="px-4 py-3 pr-10 rounded-[5px] border border-[#d9d9d9]"
              />
              <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 w-full">
            <Label className="font-medium text-[#383838e6] text-sm">
              Department
            </Label>

            <div className="relative w-full">
              <Input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Search department..."
                className="px-4 py-3 pr-10 rounded-[5px] border border-[#d9d9d9]"
              />
              <Building2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

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
          disabled={!selectedFile}
        >
          <span className="font-medium text-white text-sm">
            Upload Files
          </span>
        </Button>

        <Button
          onClick={onCancel}
          variant="outline"
          className="w-full h-[43px] rounded-[5px] border border-[#d9d9d9]"
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
