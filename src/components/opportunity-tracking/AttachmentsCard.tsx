
import React from "react";
import { Paperclip, File as FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface FileItem {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
}

interface AttachmentsCardProps {
  files: FileItem[];
  onAddFile: () => void;
  sectionHeight?: string;
}

const AttachmentsCard: React.FC<AttachmentsCardProps> = ({
  files,
  onAddFile,
  sectionHeight = "h-72"
}) => (
  <div className={`bg-white p-4 rounded-lg border border-gray-200 flex flex-col ${sectionHeight}`}>
    <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
      <Paperclip className="h-4 w-4" />
      Attachments
    </h3>
    <div className="flex justify-end mb-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onAddFile}
      >
        Add File
      </Button>
    </div>
    <div className="flex-1 overflow-y-auto">
      {files.length > 0 ? (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-gray-50 p-3 rounded border border-gray-200 flex items-center"
            >
              <FileIcon className="h-4 w-4 mr-2 text-blue-500" />
              <div className="flex-1">
                <div className="font-medium text-sm">
                  {file.name}
                </div>
                <div className="text-xs text-gray-500">
                  {format(
                    new Date(file.uploadedAt),
                    "MMM dd, yyyy"
                  )}{" "}
                  • {(file.size / 1024).toFixed(2)} KB
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-sm text-gray-500">
          No attachments added yet
        </div>
      )}
    </div>
  </div>
);

export default AttachmentsCard;
