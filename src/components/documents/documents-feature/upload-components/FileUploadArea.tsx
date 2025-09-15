import React, { useCallback } from 'react';
import { UploadIcon, FileTextIcon } from 'lucide-react';

interface FileUploadAreaProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

const FileUploadArea = ({ onFilesSelected, disabled = false }: FileUploadAreaProps) => {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    onFilesSelected(files);
  }, [onFilesSelected, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const files = Array.from(e.target.files || []);
    onFilesSelected(files);
  }, [onFilesSelected, disabled]);

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
        ${disabled ? 'border-gray-200 bg-gray-50' : 'border-blue-300 hover:border-blue-400 hover:bg-blue-50'}
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 rounded-full bg-blue-100">
          <UploadIcon className="w-8 h-8 text-blue-600" />
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Drop files here or click to browse
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Supports PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX files up to 10MB
          </p>
          
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
            <FileTextIcon className="w-4 h-4" />
            Select Files
            <input
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              onChange={handleFileSelect}
              disabled={disabled}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default FileUploadArea;