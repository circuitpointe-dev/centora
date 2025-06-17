
import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
  CheckCircle,
  Edit3,
  FileText,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileWithProgress extends File {
  progress: number;
  scanComplete: boolean;
  id: string;
}

interface UploadSectionProps {
  files: File[];
  onFilesSelected: (files: File[]) => void;
  onFileRemove: (index: number) => void;
  onFileSelect: (index: number) => void;
  selectedFileIndex: number | null;
}

const UploadSection = ({
  files,
  onFilesSelected,
  onFileRemove,
  onFileSelect,
  selectedFileIndex,
}: UploadSectionProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [filesWithProgress, setFilesWithProgress] = useState<FileWithProgress[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<number | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const simulateUploadProgress = (file: File) => {
    const fileWithProgress: FileWithProgress = {
      ...file,
      progress: 0,
      scanComplete: false,
      id: Math.random().toString(36).substr(2, 9),
    };

    setFilesWithProgress(prev => [...prev, fileWithProgress]);

    const interval = setInterval(() => {
      setFilesWithProgress(prev =>
        prev.map(f =>
          f.id === fileWithProgress.id
            ? {
                ...f,
                progress: Math.min(f.progress + Math.random() * 30, 100),
                scanComplete: f.progress >= 100,
              }
            : f
        )
      );
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setFilesWithProgress(prev =>
        prev.map(f =>
          f.id === fileWithProgress.id
            ? { ...f, progress: 100, scanComplete: true }
            : f
        )
      );
    }, 2000);
  };

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
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles: File[]) => {
    onFilesSelected([...files, ...newFiles]);
    newFiles.forEach(file => simulateUploadProgress(file));
  };

  const handleDeleteClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFileToDelete(index);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (fileToDelete !== null) {
      const fileToRemove = files[fileToDelete];
      
      // Remove from files with progress tracking
      setFilesWithProgress(prev => 
        prev.filter(f => f.name !== fileToRemove.name)
      );
      
      // Remove from main files array
      onFileRemove(fileToDelete);
      setFileToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  return (
    <>
      <div className="flex flex-col w-full items-start gap-14">
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

        <div className="flex flex-col items-start gap-8 w-full">
          {filesWithProgress.map((file, index) => (
            <Card
              key={file.id}
              className={cn(
                "w-full shadow-[0px_4px_16px_#eae2fd] cursor-pointer transition-colors",
                selectedFileIndex === index && "ring-2 ring-violet-600"
              )}
              onClick={() => onFileSelect(index)}
            >
              <CardContent className="flex flex-col items-start gap-4 p-4">
                <div className="flex justify-between w-full">
                  <div className="inline-flex items-center gap-2.5">
                    <FileText className="w-[26px] h-[26px]" />
                    <div className="flex flex-col w-[184px] items-start gap-1">
                      <p className="font-medium text-[#383838] text-sm">
                        {file.name}
                      </p>
                      <p className="font-normal text-[#38383880] text-[13px]">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-[37px]">
                    <div className="inline-flex items-end gap-2">
                      <Edit3 className="w-4 h-4" />
                      <span className="font-medium text-violet-600 text-sm">
                        Edit PDF
                      </span>
                    </div>

                    {file.scanComplete && (
                      <div className="inline-flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#189e75]" />
                        <span className="font-medium text-[#189e75] text-sm">
                          Scan Complete
                        </span>
                      </div>
                    )}

                    <Trash2
                      className="w-5 h-5 text-gray-500 cursor-pointer hover:text-red-500"
                      onClick={(e) => handleDeleteClick(index, e)}
                    />
                  </div>
                </div>

                <Progress
                  value={file.progress}
                  className="w-full h-1.5 bg-gray-200 rounded-[30px]"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <ConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete File"
        description="Are you sure you want to remove this file from the upload queue? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
};

export default UploadSection;
