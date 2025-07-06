import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";

interface UploadedFile {
  file: File;
  url: string;
  name: string;
}

interface FileUploadAreaProps {
  uploadedFile: UploadedFile | null;
  onFileUpload: (file: File) => void;
  onRemoveFile: () => void;
  error: string | null;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  uploadedFile,
  onFileUpload,
  onRemoveFile,
  error
}) => {
  const validatePDFFile = (file: File): string | null => {
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      return "Please select a valid PDF file.";
    }
    if (file.size > 25 * 1024 * 1024) { // 25MB limit
      return "File size must be less than 25MB.";
    }
    if (file.size === 0) {
      return "The selected file appears to be empty.";
    }
    return null;
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validatePDFFile(file);
    if (validationError) {
      return;
    }

    onFileUpload(file);
    
    // Reset the file input
    event.target.value = '';
  }, [onFileUpload]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] border rounded bg-gray-50">
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <div className="text-red-500 text-center mb-4">
            <p className="font-medium">{error}</p>
          </div>
          {uploadedFile && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span>{uploadedFile.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRemoveFile}
                className="h-6 w-6 text-red-500 hover:text-red-700"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="rounded-[5px]">
                Try Different File
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!uploadedFile) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] border rounded bg-gray-50 border-dashed">
        <div className="flex flex-col items-center gap-4 p-6">
          <Upload className="w-12 h-12 text-gray-400" />
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload PDF Document</h3>
            <p className="text-gray-500 text-sm mb-4">
              Select a PDF file to review and add signature fields, or drag fields here
            </p>
          </div>
          <div className="relative">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-[5px]">
              <Upload className="w-4 h-4 mr-2" />
              Select PDF File
            </Button>
          </div>
          <p className="text-xs text-gray-400">Max file size: 25MB</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded mb-2">
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-green-600" />
        <span className="text-sm font-medium text-green-800">{uploadedFile.name}</span>
        <span className="text-xs text-green-600">• PDF loaded successfully</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button variant="ghost" size="sm" className="text-xs">
            Replace
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemoveFile}
          className="h-6 w-6 text-red-500 hover:text-red-700"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};