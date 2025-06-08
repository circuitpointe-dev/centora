
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface DocumentUploadSectionProps {
  uploadedFiles: File[];
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

export const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({
  uploadedFiles,
  onFileUpload,
  onRemoveFile,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Documents</h3>
      
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <span className="text-sm text-gray-700 truncate">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFile(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-2">Drag and drop files here or</p>
        <input
          type="file"
          multiple
          onChange={onFileUpload}
          className="hidden"
          id="file-upload"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          Browse Files
        </Button>
      </div>
    </div>
  );
};
