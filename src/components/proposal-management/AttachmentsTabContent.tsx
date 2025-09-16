
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileText, X } from "lucide-react";
import { useProposalAttachments, useUploadProposalAttachment, useDeleteProposalAttachment, useDownloadProposalAttachment } from "@/hooks/useProposalAttachments";

type Props = {
  proposalId: string | null;
};

const AttachmentsTabContent: React.FC<Props> = ({ proposalId }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: attachments = [], isLoading } = useProposalAttachments(proposalId || "");
  const uploadAttachment = useUploadProposalAttachment();
  const deleteAttachment = useDeleteProposalAttachment();
  const downloadAttachment = useDownloadProposalAttachment();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && proposalId) {
      Array.from(files).forEach(file => {
        uploadAttachment.mutate({
          proposal_id: proposalId,
          file: file,
        });
      });
    }
  };

  const handleDownload = (attachment: any) => {
    downloadAttachment.mutate({
      file_path: attachment.file_path,
      file_name: attachment.file_name,
    });
  };

  const handleDelete = (attachment: any) => {
    if (confirm('Are you sure you want to delete this file?')) {
      deleteAttachment.mutate({
        id: attachment.id,
        proposal_id: attachment.proposal_id,
        file_path: attachment.file_path,
      });
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return <FileText className="w-4 h-4" />;
    
    if (mimeType.includes('pdf')) return <FileText className="w-4 h-4 text-red-600" />;
    if (mimeType.includes('word') || mimeType.includes('document')) return <FileText className="w-4 h-4 text-blue-600" />;
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return <FileText className="w-4 h-4 text-green-600" />;
    return <FileText className="w-4 h-4 text-gray-600" />;
  };
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Upload Files</h3>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />
      
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
        <Button 
          variant="outline" 
          onClick={handleFileSelect}
          disabled={uploadAttachment.isPending || !proposalId}
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploadAttachment.isPending ? 'Uploading...' : 'Choose Files'}
        </Button>
      </div>
      
      {/* Attachments List */}
      <div className="space-y-2">
        <h4 className="font-medium">
          Attachments {attachments.length > 0 && `(${attachments.length})`}
        </h4>
        
        {isLoading ? (
          <div className="text-center text-gray-500 py-4">Loading attachments...</div>
        ) : attachments.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No attachments yet. Upload files to get started.
          </div>
        ) : (
          attachments.map((attachment) => (
            <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  {getFileIcon(attachment.mime_type)}
                </div>
                <div>
                  <p className="font-medium text-sm">{attachment.file_name}</p>
                  <div className="text-xs text-gray-500">
                    {formatFileSize(attachment.file_size)} • 
                    Uploaded by {attachment.user?.full_name || 'Unknown'} • 
                    {new Date(attachment.uploaded_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDownload(attachment)}
                  disabled={downloadAttachment.isPending}
                  title="Download file"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDelete(attachment)}
                  disabled={deleteAttachment.isPending}
                  title="Delete file"
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AttachmentsTabContent;
