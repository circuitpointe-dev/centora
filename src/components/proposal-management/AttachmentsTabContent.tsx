
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

type Props = {
  proposalId: string | null;
};

const AttachmentsTabContent: React.FC<Props> = ({ proposalId }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Upload Files</h3>
      
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">File attachment functionality coming soon</p>
        <p className="text-sm text-gray-500">Database schema is being updated to support attachments</p>
      </div>
      
      {/* Placeholder */}
      <div className="space-y-2">
        <h4 className="font-medium">Attachments</h4>
        <div className="text-center text-gray-500 py-4">
          Attachment system will be available once the database types are updated.
        </div>
      </div>
    </div>
  );
};

export default AttachmentsTabContent;
