
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";

const dummyFiles = [
  { id: "1", name: "Project Overview.pdf", size: "2.3 MB" },
  { id: "2", name: "Budget Template.xlsx", size: "1.8 MB" },
  { id: "3", name: "Research Methodology.docx", size: "4.2 MB" },
];

const AttachmentsTabContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Upload Files</h3>
      
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Choose Files
        </Button>
      </div>
      
      {/* Dummy Files */}
      <div className="space-y-2">
        <h4 className="font-medium">Sample Files (Demo)</h4>
        {dummyFiles.map((file) => (
          <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                <Upload className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs text-gray-500">{file.size}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttachmentsTabContent;
