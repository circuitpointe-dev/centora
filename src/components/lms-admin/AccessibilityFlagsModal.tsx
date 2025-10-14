import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  X, 
  Play, 
  Upload, 
  Eye,
  FileText
} from 'lucide-react';

interface AccessibilityFlagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle?: string;
}

const AccessibilityFlagsModal: React.FC<AccessibilityFlagsModalProps> = ({
  isOpen,
  onClose,
  videoTitle = "Product_demo.mp4"
}) => {
  const [caption, setCaption] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // Handle file drop logic here
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file selection logic here
  };

  const handleSave = () => {
    // Handle save logic here
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">{videoTitle}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-full hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Video Player Section */}
          <div className="relative bg-muted rounded-lg overflow-hidden">
            {/* Video with dummy image */}
            <div className="aspect-video bg-muted flex items-center justify-center">
              <img
                src="/dummy-image.png"
                alt="Video thumbnail"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="lg"
                  className="h-16 w-16 rounded-full bg-background bg-opacity-90 hover:bg-opacity-100 shadow-lg"
                >
                  <Play className="h-8 w-8 text-foreground ml-1" />
                </Button>
              </div>
            </div>
          </div>

          {/* Caption Field */}
          <div className="space-y-2">
            <Label htmlFor="caption" className="text-sm font-medium text-foreground">
              Caption
            </Label>
            <Input
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter caption text here..."
              className="w-full"
            />
          </div>

          {/* File Upload Area */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Upload File
            </Label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-border hover:border-muted-foreground'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">
                Choose a file or drag & drop it here
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('file-input')?.click()}
                className="mt-2"
              >
                Browse file
              </Button>
              <input
                id="file-input"
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept=".srt,.vtt,.txt"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-6 bg-gray-900 hover:bg-gray-800"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityFlagsModal;
