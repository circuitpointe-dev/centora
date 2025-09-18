import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Download, FileIcon, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { GranteeSubmission, useGranteeSubmissions } from "@/hooks/grants/useGranteeSubmissions";

interface SubmissionDetailDialogProps {
  submission: GranteeSubmission | null;
  isOpen: boolean;
  onClose: () => void;
}

interface AttachedFile {
  id: string;
  name: string;
  size: string;
}

const SubmissionDetailDialog: React.FC<SubmissionDetailDialogProps> = ({
  submission,
  isOpen,
  onClose,
}) => {
  const { updateSubmissionStatus } = useGranteeSubmissions();
  const [reviewComment, setReviewComment] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRevisionDialog, setShowRevisionDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  if (!submission) return null;

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded text-sm font-medium";
    const normalizedStatus = status === 'pending_review' ? 'Pending review' : 
                            status === 'revision_requested' ? 'Revision requested' :
                            status === 'approved' ? 'Approved' : status;
    
    switch (normalizedStatus) {
      case 'Pending review':
        return `${baseClasses} bg-amber-100 text-amber-800`;
      case 'Revision requested':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'Approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const existingFiles: AttachedFile[] = [
    { id: "1", name: "Anti-corruption policy.pdf", size: "2.5MB" },
    { id: "2", name: "Conflict of interest policy.pdf", size: "1.8MB" },
    { id: "3", name: "Child protection policy.pdf", size: "3.2MB" },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleApprove = async () => {
    if (!submission) return;
    
    try {
      setIsUpdating(true);
      await updateSubmissionStatus(submission.id, 'approved', reviewComment || undefined);
      toast({
        title: "Submission Approved",
        description: "The submission has been approved successfully.",
      });
      onClose();
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRequestRevision = async () => {
    if (!submission) return;
    
    if (!reviewComment.trim()) {
      toast({
        title: "Review Comment Required",
        description: "Please provide a review comment before requesting revision.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUpdating(true);
      await updateSubmissionStatus(submission.id, 'revision_requested', reviewComment);
      toast({
        title: "Revision Requested",
        description: "Revision request has been sent to the grantee with your comments.",
      });
      onClose();
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 grid w-full max-w-2xl bg-white rounded-lg shadow-lg border p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-4 text-black">
              {submission.submission_type} - {submission.grant?.grant_name || 'N/A'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Submission Details */}
            <div className="bg-white p-4 rounded border border-gray-200">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Organization</span>
                  <span className="font-medium">{submission.organization_name}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Grant</span>
                  <span className="font-medium">{submission.grant?.grant_name || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Donor</span>
                  <span className="font-medium">{submission.grant?.donor_name || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Submitted</span>
                  <span className="font-medium">{new Date(submission.submitted_date).toLocaleDateString()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Type</span>
                  <span className="font-medium">{submission.submission_type}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className={getStatusBadge(submission.status)}>
                    {submission.status === 'pending_review' ? 'Pending review' : 
                     submission.status === 'revision_requested' ? 'Revision requested' :
                     submission.status === 'approved' ? 'Approved' : submission.status}
                  </Badge>
                </div>

                {submission.feedback && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-600">Previous Feedback</span>
                    <span className="font-medium text-right max-w-xs">{submission.feedback}</span>
                  </div>
                )}
              </div>
            </div>

            {/* File Upload Section */}
            <div className="bg-white p-4 rounded border border-gray-200">
              <h3 className="text-md font-semibold mb-4">Attached files</h3>
              
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">Choose a file or drag & drop it here</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse file
                </Button>
                <p className="text-xs text-gray-400 mt-2">Maximum size: 25MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex items-center">
                        <FileIcon className="h-4 w-4 mr-2 text-gray-600" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUploadedFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Existing Documents */}
            <div className="bg-white p-4 rounded border border-gray-200">
              <h3 className="text-md font-semibold mb-4">Existing Documents</h3>
              <div className="space-y-2">
                {existingFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                    <div className="flex items-center">
                      <FileIcon className="h-4 w-4 mr-2 text-gray-600" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Comment Section */}
            <div className="bg-white p-4 rounded border border-gray-200">
              <h3 className="text-md font-semibold mb-4">Review Comment</h3>
              <Textarea
                placeholder="Add review comment..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={onClose} disabled={isUpdating}>
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowRevisionDialog(true)}
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
                disabled={isUpdating}
              >
                Request revision
              </Button>
              <Button
                onClick={() => setShowApproveDialog(true)}
                className="bg-violet-600 text-white hover:bg-violet-700"
                disabled={isUpdating}
              >
                {isUpdating ? 'Processing...' : 'Approve'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Approval Confirmation Dialog */}
      <ConfirmationDialog
        open={showApproveDialog}
        onOpenChange={setShowApproveDialog}
        title="Approve Submission"
        description="Are you sure you want to approve this submission? This action cannot be undone."
        onConfirm={handleApprove}
        confirmText="Approve"
        variant="constructive"
      />

      {/* Revision Request Confirmation Dialog */}
      <ConfirmationDialog
        open={showRevisionDialog}
        onOpenChange={setShowRevisionDialog}
        title="Request Revision"
        description="Are you sure you want to request a revision? The grantee will be notified with your review comments."
        onConfirm={handleRequestRevision}
        confirmText="Request Revision"
        variant="destructive"
      />
    </>
  );
};

export default SubmissionDetailDialog;
