
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
            
            {/* Document Content - This would be replaced with actual document viewer/editor */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="max-w-sm mx-auto">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Document Editor</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Document editing functionality will be implemented here based on the document type.
                </p>
                <div className="mt-4 space-y-2 text-xs text-gray-500">
                  <p><strong>File:</strong> {document.file_name}</p>
                  <p><strong>Size:</strong> {document.file_size ? `${(document.file_size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}</p>
                  <p><strong>Type:</strong> {document.mime_type || 'Unknown'}</p>
                </div>
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
