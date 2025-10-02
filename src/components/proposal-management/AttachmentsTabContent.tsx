import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Download, Trash2, Loader2 } from "lucide-react";
import { 
  useProposalAttachments, 
  useUploadProposalAttachment, 
  useDeleteProposalAttachment,
  useDownloadProposalAttachment 
} from "@/hooks/useProposalAttachments";
import { formatDistanceToNow } from "date-fns";

type Props = {
  proposalId: string | null;
};

const AttachmentsTabContent: React.FC<Props> = ({ proposalId }) => {
  const { data: attachments = [], isLoading } = useProposalAttachments(proposalId);
  const uploadMutation = useUploadProposalAttachment();
  const deleteMutation = useDeleteProposalAttachment();
  const downloadMutation = useDownloadProposalAttachment();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!proposalId) return;
    
    acceptedFiles.forEach((file) => {
      uploadMutation.mutate({
        proposalId,
        file,
      });
    });
  }, [proposalId, uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    }
  });

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  if (!proposalId) {
    return (
      <div className="space-y-4">
        <div className="text-center text-gray-500 py-8">
          Please save the proposal first before uploading attachments.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Upload Files</h3>
        <p className="text-sm text-gray-600">Attach supporting documents to your proposal</p>
      </div>
      
      {/* Upload Area */}
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-primary' : 'text-gray-400'}`} />
        {uploadMutation.isPending ? (
          <>
            <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin" />
            <p className="text-gray-600">Uploading file...</p>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-2">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here, or click to browse'}
            </p>
            <p className="text-sm text-gray-500">
              Supports: PDF, DOC, DOCX, XLS, XLSX, TXT, Images (Max 10MB)
            </p>
          </>
        )}
      </div>
      
      {/* Attachments List */}
      <div className="space-y-2">
        <h4 className="font-medium">Attachments ({attachments.length})</h4>
        
        {isLoading ? (
          <div className="text-center py-4">
            <Loader2 className="w-6 h-6 mx-auto animate-spin text-gray-400" />
          </div>
        ) : attachments.length === 0 ? (
          <div className="text-center text-gray-500 py-8 border border-dashed border-gray-300 rounded-lg">
            No attachments yet. Upload files to get started.
          </div>
        ) : (
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div 
                key={attachment.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="w-8 h-8 text-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{attachment.file_name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{formatFileSize(attachment.file_size)}</span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(attachment.uploaded_at), { addSuffix: true })}
                      </span>
                      {attachment.profiles?.full_name && (
                        <>
                          <span>•</span>
                          <span>by {attachment.profiles.full_name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => downloadMutation.mutate(attachment)}
                    disabled={downloadMutation.isPending}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteMutation.mutate(attachment)}
                    disabled={deleteMutation.isPending}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentsTabContent;

