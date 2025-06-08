
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";

export const FilesSection: React.FC = () => {
  const [files, setFiles] = useState([
    { id: 1, name: "donor_agreement.pdf", size: "2.3 MB", type: "PDF" },
    { id: 2, name: "tax_documents_2024.xlsx", size: "1.8 MB", type: "Excel" },
    { id: 3, name: "profile_photo.jpg", size: "456 KB", type: "Image" }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      Array.from(uploadedFiles).forEach(file => {
        const newFile = {
          id: files.length + Math.random(),
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          type: file.type.split('/')[1].toUpperCase()
        };
        setFiles(prev => [...prev, newFile]);
      });
    }
  };

  const removeFile = (fileId: number) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const downloadFile = (fileName: string) => {
    // Simulate file download
    const link = document.createElement('a');
    link.href = '#';
    link.download = fileName;
    link.click();
  };

  return (
    <div className="flex flex-col items-start gap-4 h-full">
      <h3 className="font-medium text-black text-base">Files</h3>

      <Card className="w-full flex-1">
        <CardContent className="p-4 h-full flex flex-col">
          {files.length > 0 && (
            <div className="space-y-2 mb-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.size} • {file.type}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadFile(file.name)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="border-2 border-dashed border-[#d2d2d2] bg-transparent rounded-md p-8 flex-1 flex items-center justify-center">
            <div className="text-center text-[#707070] text-base">
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
                className="font-bold p-0 h-auto text-base text-[#707070]"
                onClick={() => document.getElementById('file-upload')?.click()}
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
