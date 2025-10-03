
import React, { useMemo, useState } from "react";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDownloadProposalAttachment, useProposalAttachments } from "@/hooks/useProposalAttachments";

type Props = {
  proposalId?: string | null;
};

const ProposalAttachmentsCard: React.FC<Props> = ({ proposalId }) => {
  const [selectedAttachments, setSelectedAttachments] = useState<string[]>([]);
  const { data: attachments = [] } = useProposalAttachments(proposalId || "");
  const downloadOne = useDownloadProposalAttachment();

  const handleAttachmentSelect = (attachmentId: string) => {
    setSelectedAttachments((prev) =>
      prev.includes(attachmentId)
        ? prev.filter((id) => id !== attachmentId)
        : [...prev, attachmentId]
    );
  };

  const handleDownloadSelected = () => {
    attachments
      .filter((a: any) => selectedAttachments.includes(a.id))
      .forEach((a: any) => downloadOne.mutate(a));
  };

  const handleDownloadAll = () => {
    attachments.forEach((a: any) => downloadOne.mutate(a));
  };

  const hasAttachments = useMemo(() => (attachments || []).length > 0, [attachments]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4 backdrop-blur-sm bg-opacity-80">
      <h2 className="text-lg font-semibold text-gray-900">Attachments</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {hasAttachments ? attachments.map((attachment: any) => (
          <div
            key={attachment.id}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedAttachments.includes(attachment.id)
                ? "bg-violet-50 border-2 border-violet-200"
                : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
              }`}
            onClick={() => handleAttachmentSelect(attachment.id)}
          >
            <FileText className="h-6 w-6 text-blue-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 text-sm truncate">
                {attachment.file_name}
              </p>
              <p className="text-gray-500 text-xs">{attachment.mime_type || 'File'}</p>
            </div>
          </div>
        )) : (
          <div className="text-sm text-gray-500 col-span-4">No attachments yet.</div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        {selectedAttachments.length > 0 && hasAttachments && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadSelected}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Selected ({selectedAttachments.length})
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={handleDownloadAll} disabled={!hasAttachments}>
          <Download className="h-4 w-4 mr-2" />
          Download All
        </Button>
      </div>
    </div>
  );
};

export default ProposalAttachmentsCard;
