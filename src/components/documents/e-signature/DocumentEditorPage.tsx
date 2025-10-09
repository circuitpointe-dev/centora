
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useDocumentPreview } from "@/hooks/useDocumentOperations";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { DocumentEditorHeader } from "./review-step/DocumentEditorHeader";

interface FieldData {
  id: string;
  type: "signature" | "name" | "date" | "email" | "text";
  label: string;
  value?: any;
  isConfigured: boolean;
}

export const DocumentEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmExit, setConfirmExit] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const previewMutation = useDocumentPreview();

  // Get document from navigation state
  const { document } = location.state || {};
  
  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Document Selected</h2>
          <p className="text-gray-600 mb-4">Please select a document to edit.</p>
          <Button onClick={() => navigate('/dashboard/documents/documents')}>
            Back to Documents
          </Button>
        </div>
      </div>
    );
  }

  const hasChanges = false; // TODO: Track actual changes

  const handleClose = () => hasChanges ? setConfirmExit(true) : navigate("/dashboard/documents/documents");
  const handleBack = () => hasChanges ? setConfirmExit(true) : navigate("/dashboard/documents/documents");
  const confirmAndLeave = () => navigate("/dashboard/documents/documents");

  useEffect(() => {
    const loadPreview = async () => {
      try {
        const res = await previewMutation.mutateAsync(document.id);
        setPreviewUrl(res.url);
      } catch (e: any) {
        setPreviewError(e?.message || "Failed to load preview");
      }
    };
    loadPreview();
    // revoke URL on unmount
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [document?.id]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <DocumentEditorHeader
        onBack={handleBack}
        onClose={handleClose}
      />

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{document.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Created: {new Date(document.created_at).toLocaleDateString()}</span>
                <span>•</span>
                <span>Creator: {document.creator?.full_name || 'Unknown'}</span>
                <span>•</span>
                <span>Category: {document.category}</span>
              </div>
            </div>
            
            {/* Document Preview */}
            <div className="border rounded-lg p-4 bg-gray-50">
              {previewMutation.isPending && (
                <div className="flex items-center justify-center h-48 text-gray-600">
                  <Loader2 className="h-6 w-6 mr-2 animate-spin" /> Loading preview...
                </div>
              )}
              {!previewMutation.isPending && previewError && (
                <div className="text-sm text-red-600">{previewError}</div>
              )}
              {!previewMutation.isPending && previewUrl && (
                <div className="bg-white rounded p-2">
                  {document.mime_type?.includes('pdf') ? (
                    <iframe src={previewUrl} className="w-full h-[70vh] border-0 rounded" title="Document Preview" />
                  ) : document.mime_type?.includes('image') ? (
                    <img src={previewUrl} alt="Document Preview" className="max-w-full h-auto rounded" />
                  ) : (
                    <div className="text-sm text-gray-600">Preview not available for this file type. Use Download.</div>
                  )}
                </div>
              )}
              <div className="mt-4 space-y-1 text-xs text-gray-500">
                <p><strong>File:</strong> {document.file_name}</p>
                <p><strong>Size:</strong> {document.file_size ? `${(document.file_size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}</p>
                <p><strong>Type:</strong> {document.mime_type || 'Unknown'}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleBack}>
                  Back to Documents
                </Button>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  Save Draft
                </Button>
                <Button className="bg-violet-600 hover:bg-violet-700">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Exit Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmExit}
        onOpenChange={setConfirmExit}
        title="Unsaved Changes"
        description="You have unsaved changes. Leave now?"
        onConfirm={confirmAndLeave}
        confirmText="Leave"
        cancelText="Stay"
        variant="destructive"
      />
    </div>
  );
};
