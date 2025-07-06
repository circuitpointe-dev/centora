
import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { DocumentEditorHeader } from "./review-step/DocumentEditorHeader";
import { DocumentEditorMainContent } from "./review-step/DocumentEditorMainContent";

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
  const [activeDocumentIndex, setActiveDocumentIndex] = useState(0);

  // Get data from navigation state
  const { selectedFiles = [], selectedDoc = null } = location.state || {};
  
  // Combine files and documents for consistent handling
  const allDocuments = [
    ...selectedFiles.map((file: File, index: number) => ({
      id: `file-${index}`,
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      type: 'file',
      data: file
    })),
    ...(selectedDoc ? [{
      id: selectedDoc.id,
      fileName: selectedDoc.fileName,
      fileSize: selectedDoc.fileSize,
      type: 'document',
      data: selectedDoc
    }] : [])
  ];

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

  const handleDocumentTabChange = (value: string) => {
    const index = parseInt(value);
    setActiveDocumentIndex(index);
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

      <DocumentEditorMainContent
        allDocuments={allDocuments}
        activeDocumentIndex={activeDocumentIndex}
        onDocumentTabChange={handleDocumentTabChange}
        onFieldAdded={handleFieldAdded}
        onPreview={handlePreview}
        onContinue={handleContinue}
      />

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
