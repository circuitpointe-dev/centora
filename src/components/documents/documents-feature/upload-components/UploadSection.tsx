
import React, { useState } from 'react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import FileUploadArea from './FileUploadArea';
import FileProgressCard from './FileProgressCard';

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
  const [filesWithProgress, setFilesWithProgress] = useState<FileWithProgress[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<number | null>(null);

  const simulateUploadProgress = (file: File) => {
    const fileWithProgress: FileWithProgress = Object.assign(
      Object.create(Object.getPrototypeOf(file)),
      file,
      {
        progress: 0,
        scanComplete: false,
        id: Math.random().toString(36).substr(2, 9),
      }
    );

    setFilesWithProgress(prev => [...prev, fileWithProgress]);

    const interval = setInterval(() => {
      setFilesWithProgress(prev =>
        prev.map(f =>
          f.id === fileWithProgress.id
            ? Object.assign(Object.create(Object.getPrototypeOf(f)), f, {
                progress: Math.min(f.progress + Math.random() * 30, 100),
                scanComplete: f.progress >= 100,
              })
            : f
        )
      );
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setFilesWithProgress(prev =>
        prev.map(f =>
          f.id === fileWithProgress.id
            ? Object.assign(Object.create(Object.getPrototypeOf(f)), f, {
                progress: 100,
                scanComplete: true,
              })
            : f
        )
      );
    }, 2000);
  };

  const handleFilesSelected = (newFiles: File[]) => {
    onFilesSelected([...files, ...newFiles]);
    newFiles.forEach(file => simulateUploadProgress(file));
  };

  const handleDeleteClick = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFileToDelete(index);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (fileToDelete !== null) {
      const fileToRemove = filesWithProgress[fileToDelete];
      
      // Remove from files with progress tracking
      setFilesWithProgress(prev => 
        prev.filter((_, index) => index !== fileToDelete)
      );
      
      // Find the corresponding file in the main files array by name and remove it
      const mainFileIndex = files.findIndex(f => f.name === fileToRemove.name);
      if (mainFileIndex !== -1) {
        onFileRemove(mainFileIndex);
      }
      
      // Adjust selected file index if necessary
      if (selectedFileIndex === fileToDelete) {
        const newLength = filesWithProgress.length - 1;
        onFileSelect(newLength > 0 ? 0 : -1);
      } else if (selectedFileIndex !== null && selectedFileIndex > fileToDelete) {
        onFileSelect(selectedFileIndex - 1);
      }
      
      setFileToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  return (
    <>
      <div className="flex flex-col w-full items-start gap-14">
        <FileUploadArea onFilesSelected={handleFilesSelected} />

        <div className="flex flex-col items-start gap-8 w-full">
          {filesWithProgress.map((file, index) => (
            <FileProgressCard
              key={file.id}
              file={file}
              index={index}
              isSelected={selectedFileIndex === index}
              onSelect={() => onFileSelect(index)}
              onRemove={() => handleDeleteClick(index)}
            />
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
