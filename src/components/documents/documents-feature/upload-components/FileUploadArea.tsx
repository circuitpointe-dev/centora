
import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadAreaProps {
  onFilesSelected: (files: File[]) => void;
}

const FileUploadArea = ({ onFilesSelected }: FileUploadAreaProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    onFilesSelected(droppedFiles);
  }, [onFilesSelected]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    onFilesSelected(selectedFiles);
  };

  return (
    <Card className="w-full shadow-[0px_4px_16px_#eae2fd]">
      <CardContent
        className={cn(
          "flex flex-col h-[364px] items-center justify-center gap-6 p-6 transition-colors",
          isDragOver && "bg-violet-50 border-violet-300 border-2 border-dashed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadCloud className="w-12 h-12 text-violet-600" />
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex flex-col items-center gap-2 w-full">
            <p className="font-medium text-[#383838] text-lg text-center">
              Drag and drop files here
            </p>
            <p className="font-normal text-[#38383899] text-lg text-center">
              or
            </p>
          </div>
          <div className="relative">
            <input
              type="file"
              multiple
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".pdf,.doc,.docx,.txt,.xlsx,.pptx"
            />
            <Button className="h-auto px-7 py-3 bg-violet-600 hover:bg-violet-700 rounded-[5px]">
              Browse Files
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadArea;
