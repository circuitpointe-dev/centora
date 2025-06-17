
import React, { useState } from 'react';
import {
  LargeSideDialog,
  LargeSideDialogContent,
  LargeSideDialogHeader,
  LargeSideDialogTitle,
} from '@/components/ui/large-side-dialog';
import UploadSection from './upload-components/UploadSection';
import DocumentDetailsSection from './upload-components/DocumentDetailsSection';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UploadDocumentDialog = ({ open, onOpenChange }: UploadDocumentDialogProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    if (files.length > 0 && selectedFileIndex === null) {
      setSelectedFileIndex(0);
    }
  };

  const handleFileRemove = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    if (selectedFileIndex === index) {
      setSelectedFileIndex(newFiles.length > 0 ? 0 : null);
    } else if (selectedFileIndex !== null && selectedFileIndex > index) {
      setSelectedFileIndex(selectedFileIndex - 1);
    }
  };

  const handleFileSelect = (index: number) => {
    setSelectedFileIndex(index);
  };

  const handleUploadComplete = () => {
    setSelectedFiles([]);
    setSelectedFileIndex(null);
    onOpenChange(false);
  };

  return (
    <LargeSideDialog open={open} onOpenChange={onOpenChange}>
      <LargeSideDialogContent>
        <LargeSideDialogHeader className="border-b border-[#e6eff5]">
          <LargeSideDialogTitle className="font-medium text-[#383839] text-lg">
            Upload a New Document
          </LargeSideDialogTitle>
        </LargeSideDialogHeader>

        <div className="flex flex-row w-full gap-4 p-4 bg-[#f4f6f9] flex-1 overflow-hidden">
          <div className="w-[66%] overflow-y-auto">
            <UploadSection
              files={selectedFiles}
              onFilesSelected={handleFilesSelected}
              onFileRemove={handleFileRemove}
              onFileSelect={handleFileSelect}
              selectedFileIndex={selectedFileIndex}
            />
          </div>
          <div className="w-[34%]">
            <DocumentDetailsSection
              selectedFile={selectedFileIndex !== null ? selectedFiles[selectedFileIndex] : null}
              onUpload={handleUploadComplete}
              onCancel={() => onOpenChange(false)}
            />
          </div>
        </div>
      </LargeSideDialogContent>
    </LargeSideDialog>
  );
};

export default UploadDocumentDialog;
