
import React, { useState } from "react";
import { Upload, File, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface UploadEvidenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requirement: string;
  onUpload: (fileName: string) => void;
}

export const UploadEvidenceDialog: React.FC<UploadEvidenceDialogProps> = ({
  open,
  onOpenChange,
  requirement,
  onUpload,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    onUpload(selectedFile.name);
    setUploading(false);
    setUploadProgress(0);
    setSelectedFile(null);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-gray-200 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            Upload Evidence - {requirement}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-sm p-8 text-center hover:border-gray-400 transition-colors"
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              Drag and drop your document here, or
            </p>
            <label className="cursor-pointer">
              <span className="text-purple-600 hover:text-purple-700 underline">
                browse files
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">
              Accepts PDF, DOC, DOCX files
            </p>
          </div>

          {selectedFile && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-sm">
              <File className="h-5 w-5 text-gray-500" />
              <span className="flex-1 text-sm text-gray-700 truncate">
                {selectedFile.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFile(null)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {uploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-600 text-center">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={uploading}
            className="border-gray-300 text-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Upload Evidence
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
