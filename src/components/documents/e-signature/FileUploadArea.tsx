import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  file: File;
  id: string;
}

interface FileUploadAreaProps {
  onFileSelect: (file: UploadedFile) => void;
  selectedFile?: UploadedFile | null;
  onFileRemove: () => void;
}

const FileUploadArea = ({
  onFileSelect,
  selectedFile,
  onFileRemove,
}: FileUploadAreaProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        const file = droppedFiles[0];
        if (file.type === "application/pdf" && file.size <= 25 * 1024 * 1024) {
          onFileSelect({
            file,
            id: Math.random().toString(36).substr(2, 9),
          });
        }
      }
    },
    [onFileSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      const file = selectedFiles[0];
      if (file.type === "application/pdf" && file.size <= 25 * 1024 * 1024) {
        onFileSelect({
          file,
          id: Math.random().toString(36).substr(2, 9),
        });
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  if (selectedFile) {
    return (
      <Card className="h-[280px] bg-white rounded-lg shadow-md border">
        <CardContent className="flex flex-col items-center justify-center gap-6 h-full p-6">
          <div className="flex items-center gap-3 w-full">
            <FileText className="w-8 h-8 text-violet-600" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {selectedFile.file.name}
              </p>
              <p className="text-sm text-gray-500">
                {formatFileSize(selectedFile.file.size)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onFileRemove}
              className="h-8 w-8 text-gray-500 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-col items-center gap-4 w-full">
            <p className="text-green-600 text-sm text-center">
              File uploaded successfully
            </p>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf"
              />
              <Button
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Replace File
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[250px] bg-white rounded-lg shadow-md border">
      <CardContent
        className={cn(
          "flex flex-col items-center justify-center gap-6 h-full p-6 transition-colors",
          isDragOver && "bg-violet-50 border-violet-300 border-2 border-dashed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-5 h-5 text-gray-600" />
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="text-center space-y-2">
            <p className="text-gray-500 text-sm">
              Drag & Drop your document here
            </p>
            <p className="text-gray-500 text-sm">or</p>
          </div>

          <div className="flex flex-col items-center gap-3 w-full">
            <div className="relative">
              <input
                type="file"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf"
              />
              <Button
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Browse Files
              </Button>
            </div>
            <p className="text-gray-400 text-xs text-center">
              Supported format: PDF (Max 25MB)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadArea;
