
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Trash2 } from "lucide-react";

const AttachmentsTab: React.FC = () => {
  const attachments = [
    {
      id: 1,
      name: "Project Timeline.pdf",
      size: "2.4 MB",
      type: "PDF",
    },
    {
      id: 2,
      name: "Budget Breakdown.xlsx",
      size: "1.8 MB",
      type: "Excel",
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-3xl gap-8">
      <div className="flex flex-col gap-4">
        <Label className="font-medium text-sm text-[#383839]">
          Upload Attachments
        </Label>
        
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-8 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop files here, or click to browse
            </p>
            <Button variant="outline" size="sm">
              Choose Files
            </Button>
          </CardContent>
        </Card>
      </div>

      {attachments.length > 0 && (
        <div className="flex flex-col gap-4">
          <Label className="font-medium text-sm text-[#383839]">
            Uploaded Files
          </Label>
          
          <div className="space-y-3">
            {attachments.map((file) => (
              <Card key={file.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentsTab;
