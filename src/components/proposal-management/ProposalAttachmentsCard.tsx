
import React, { useState } from "react";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const attachments = [
  { id: "1", name: "Project Overview Document", type: "PDF Document" },
  { id: "2", name: "Budget Breakdown Analysis", type: "Excel Spreadsheet" },
  { id: "3", name: "Research Methodology", type: "Word Document" },
  { id: "4", name: "Timeline and Milestones", type: "PDF Document" },
];

const ProposalAttachmentsCard: React.FC = () => {
  const [selectedAttachments, setSelectedAttachments] = useState<string[]>([]);

  const handleAttachmentSelect = (attachmentId: string) => {
    setSelectedAttachments((prev) =>
      prev.includes(attachmentId)
        ? prev.filter((id) => id !== attachmentId)
        : [...prev, attachmentId]
    );
  };

  const handleDownloadSelected = () => {
    console.log("Downloading selected attachments:", selectedAttachments);
  };

  const handleDownloadAll = () => {
    console.log("Downloading all attachments");
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4 backdrop-blur-sm bg-opacity-80">
      <h2 className="text-lg font-semibold text-gray-900">Attachments</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
              selectedAttachments.includes(attachment.id)
                ? "bg-violet-50 border-2 border-violet-200"
                : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
            }`}
            onClick={() => handleAttachmentSelect(attachment.id)}
          >
            <FileText className="h-6 w-6 text-blue-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 text-sm truncate">
                {attachment.name}
              </p>
              <p className="text-gray-500 text-xs">{attachment.type}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-4">
        {selectedAttachments.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadSelected}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Selected ({selectedAttachments.length})
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={handleDownloadAll}>
          <Download className="h-4 w-4 mr-2" />
          Download All
        </Button>
      </div>
    </div>
  );
};

export default ProposalAttachmentsCard;
