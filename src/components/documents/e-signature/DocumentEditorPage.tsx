
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { DocumentEditorHeader } from "./review-step/DocumentEditorHeader";
import { DocumentCanvas } from "./review-step/DocumentCanvas";
import { FieldEditorCard } from "./review-step/FieldEditorCard";

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
  const [showPreview, setShowPreview] = useState(false);

  // Get data from navigation state
  const { selectedFiles = [], selectedDoc = null } = location.state || {};
  
  // Get the first document/file for display
  const currentDocument = selectedFiles[0] || selectedDoc;
  const currentFileUrl = currentDocument 
    ? (selectedFiles[0] ? URL.createObjectURL(selectedFiles[0]) : selectedDoc?.data?.fileUrl)
    : null;

  const hasChanges = showPreview;

  const handleClose = () => hasChanges ? setConfirmExit(true) : navigate("/dashboard/documents/request-signature");
  const handleBack = () => hasChanges ? setConfirmExit(true) : navigate("/dashboard/documents/request-signature");
  const confirmAndLeave = () => navigate("/dashboard/documents/request-signature");

  const handlePreview = () => {
    setShowPreview(true);
    
    // Get canvas data from the DocumentCanvas component
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      console.log("Canvas data URL generated:", dataURL);
      
      // Create a preview window with the canvas overlay
      const previewWindow = window.open('', '_blank');
      if (previewWindow) {
        previewWindow.document.write(`
          <html>
            <head><title>Document Preview</title></head>
            <body style="margin: 0; padding: 20px;">
              <h3>Document Preview with Fields</h3>
              <img src="${dataURL}" style="max-width: 100%; border: 1px solid #ccc;" />
            </body>
          </html>
        `);
      }
    } else {
      console.log("No canvas found for preview");
    }
  };

  const handleContinue = () => {
    console.log("Continue to recipients");
  };

  const handleFieldAdded = (field: FieldData, position: { x: number; y: number }) => {
    console.log("Field added to canvas:", field, position);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <DocumentEditorHeader
        onBack={handleBack}
        onClose={handleClose}
      />

      {/* Main Content - Two Column Layout */}
      <main className="flex-1 p-4">
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-120px)]">
          {/* Left Column - Document Canvas */}
          <div className="col-span-9 h-full">
            <div className="bg-white rounded-[5px] border h-full flex flex-col">
              <div className="flex-1 p-4">
                <DocumentCanvas 
                  fileUrl={currentFileUrl} 
                  onFieldAdded={handleFieldAdded}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Field Editor */}
          <aside className="col-span-3 h-full">
            <div className="sticky top-4 h-[calc(100vh-160px)]">
              <FieldEditorCard 
                onPreview={handlePreview}
                onContinue={handleContinue}
                documentCount={selectedFiles.length + (selectedDoc ? 1 : 0)}
              />
            </div>
          </aside>
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
