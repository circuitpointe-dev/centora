import React, { useState, useCallback } from "react";
import { X, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DocumentCanvas } from "./review-step/DocumentCanvas";
import { FieldEditorCard } from "./review-step/FieldEditorCard";
import { User, Calendar, Mail, Edit, Type } from "lucide-react";

interface Document {
  id: string;
  fileName: string;
  category: string;
  fileSize: string;
  addedTime: string;
  owner: { name: string; avatar: string };
  tags: { name: string; bgColor: string; textColor: string }[];
}

interface Field {
  id: string;
  name: string;
  type: "signer" | "signature" | "name" | "date" | "email" | "text";
  icon: React.ReactNode;
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

  const fieldTypes: Field[] = [
    {
      id: "signer",
      name: "Signer",
      type: "signer",
      icon: <User className="w-4 h-4" />
    },
    {
      id: "signature",
      name: "Signature",
      type: "signature",
      icon: <Edit className="w-4 h-4" />
    },
    {
      id: "name",
      name: "Full Name",
      type: "name",
      icon: <User className="w-4 h-4" />
    },
    {
      id: "date",
      name: "Date Signed",
      type: "date",
      icon: <Calendar className="w-4 h-4" />
    },
    {
      id: "email",
      name: "Email",
      type: "email",
      icon: <Mail className="w-4 h-4" />
    },
    {
      id: "text",
      name: "Text",
      type: "text",
      icon: <Type className="w-4 h-4" />
    }
  ];

  const hasChanges = showPreview;

  const handleClose = () => hasChanges ? setConfirmExit(true) : navigate("/dashboard/documents/request-signature");
  const handleBack = () => hasChanges ? setConfirmExit(true) : navigate("/dashboard/documents/request-signature");
  const confirmAndLeave = () => navigate("/dashboard/documents/request-signature");

  const handlePreview = () => {
    setShowPreview(true);
    console.log("Preview document with current fields");
  };

  const handleContinue = () => {
    console.log("Continue to recipients");
  };

  const handleDocumentTabChange = (value: string) => {
    const index = parseInt(value);
    setActiveDocumentIndex(index);
  };

  // Get current document for display
  const currentDocument = allDocuments[activeDocumentIndex];
  const currentFileUrl = currentDocument?.type === 'file' 
    ? URL.createObjectURL(currentDocument.data) 
    : currentDocument?.data?.fileUrl;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Document Editor</h1>
            <p className="text-sm text-gray-600">
              Add signature fields and configure document for signing
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="w-4 h-4 text-gray-600" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 h-[calc(100vh-120px)]">
        <div className="grid grid-cols-12 gap-4 h-full">
          {/* Left Column - Document Canvas (Now Wider) */}
          <div className="col-span-9 h-full">
            <div className="bg-white rounded-[5px] border h-full flex flex-col">
              {/* Document Tabs (if multiple documents) */}
              {allDocuments.length > 1 && (
                <div className="border-b">
                  <Tabs value={activeDocumentIndex.toString()} onValueChange={handleDocumentTabChange}>
                    <TabsList className="bg-transparent h-auto p-0 gap-4 border-b-0 w-full justify-start px-4">
                      {allDocuments.map((doc, index) => (
                        <TabsTrigger
                          key={index}
                          value={index.toString()}
                          className="inline-flex items-center justify-center gap-2 p-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-violet-600 data-[state=active]:text-violet-600 data-[state=inactive]:text-gray-600 data-[state=inactive]:border-b-0 bg-transparent shadow-none"
                        >
                          <span className="font-normal text-sm truncate max-w-[120px]">
                            {doc.fileName}
                          </span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              )}

              {/* Canvas Content */}
              <div className="flex-1 p-4 overflow-auto">
                <DocumentCanvas 
                  fileUrl={currentFileUrl} 
                  onFieldAdded={(field, position) => {
                    console.log("Field added to canvas:", field, position);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Field Editor */}
          <FieldEditorCard 
            onPreview={handlePreview}
            onContinue={handleContinue}
            documentCount={allDocuments.length}
          />
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