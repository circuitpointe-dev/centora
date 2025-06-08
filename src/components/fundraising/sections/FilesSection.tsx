import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, X } from "lucide-react";

interface FileItem {
  id: number;
  name: string;
  size: string;
  type: string;
}

export const FilesSection: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([
    { id: 1, name: "donor_agreement.pdf", size: "2.3 MB", type: "PDF" },
    { id: 2, name: "tax_documents_2024.xlsx", size: "1.8 MB", type: "Excel" },
    { id: 3, name: "profile_photo.jpg", size: "456 KB", type: "Image" },
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    const newFiles = Array.from(uploadedFiles).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      type: file.type.split("/")[1].toUpperCase() || "File",
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (fileId: number) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <h2 className="font-medium text-base text-gray-900">Files</h2>

      <Card className="h-full">
        <CardContent className="p-4 h-full flex flex-col">
          {files.length > 0 && (
            <div className="space-y-2 mb-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {file.size} • {file.type}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 p-2"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 p-2"
                      onClick={() => removeFile(file.id)}
                      title="Remove"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 bg-gray-50/50 rounded-md p-8 flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <span className="font-medium">Drag and drop files here or </span>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button
                variant="link"
                className="font-medium p-0 h-auto text-base text-gray-700 hover:no-underline"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Browse
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
