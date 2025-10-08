import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { FileTextIcon, XIcon, CheckIcon } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface FileWithProgress {
  file: File;
  progress: number;
  scanComplete: boolean;
  id: string;
}

interface FileProgressCardProps {
  file: FileWithProgress;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

const FileProgressCard = ({ 
  file, 
  index, 
  isSelected, 
  onSelect, 
  onRemove 
}: FileProgressCardProps) => {
  const getFileIcon = (fileName: string) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    return <FileTextIcon className="w-8 h-8 text-blue-600" />;
  };

  const getStatusColor = () => {
    if (file.scanComplete && file.progress === 100) return 'text-green-600';
    if (file.progress > 0) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getStatusText = () => {
    if (file.scanComplete && file.progress === 100) return 'Upload Complete';
    if (file.progress > 0) return `Uploading... ${file.progress}%`;
    return 'Ready to upload';
  };

  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {getFileIcon(file.file.name)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {file.file.name}
              </h4>
              <p className="text-xs text-gray-500">
                {formatBytes(file.file.size)}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <XIcon className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2">
              {file.scanComplete && file.progress === 100 ? (
                <CheckIcon className="w-3 h-3 text-green-600" />
              ) : null}
              <span className={`text-xs ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
            
            {file.progress > 0 && file.progress < 100 && (
              <Progress value={file.progress} className="h-1" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileProgressCard;