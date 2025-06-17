
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  Edit3,
  FileText,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileWithProgress extends File {
  progress: number;
  scanComplete: boolean;
  id: string;
}

interface FileProgressCardProps {
  file: FileWithProgress;
  index: number;
  isSelected: boolean;
  onSelect: (index: number) => void;
  onDelete: (index: number, e: React.MouseEvent) => void;
}

const FileProgressCard = ({
  file,
  index,
  isSelected,
  onSelect,
  onDelete,
}: FileProgressCardProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <Card
      key={file.id}
      className={cn(
        "w-full shadow-[0px_4px_16px_#eae2fd] cursor-pointer transition-colors",
        isSelected && "ring-2 ring-violet-600"
      )}
      onClick={() => onSelect(index)}
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
              onClick={(e) => onDelete(index, e)}
            />
          </div>
        </div>

        <Progress
          value={file.progress}
          className="w-full h-1.5 bg-gray-200 rounded-[30px]"
        />
      </CardContent>
    </Card>
  );
};

export default FileProgressCard;
