import React, { useState, useCallback } from "react";
import { X, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FieldSelectionCard } from "./review-step/FieldSelectionCard";
import { DocumentCanvas } from "./review-step/DocumentCanvas";
import { PropertyCard } from "./review-step/PropertyCard";
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
  const [activeFieldTab, setActiveFieldTab] = useState("fields");
  const [selectedField, setSelectedField] = useState<Field | null>(null);
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

  const hasChanges = selectedField !== null;

  const handleClose = () => hasChanges ? setConfirmExit(true) : navigate("/dashboard/documents/request-signature");
  const handleBack = () => hasChanges ? setConfirmExit(true) : navigate("/dashboard/documents/request-signature");
  const confirmAndLeave = () => navigate("/dashboard/documents/request-signature");

  const handleFieldSelect = useCallback((field: Field) => {
    setSelectedField(field);
  }, []);

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
      <main className="flex-1 p-4">
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-200px)]">
          {/* Left Column - Field Selection */}
          <div className="col-span-2">
            <FieldSelectionCard
              activeTab={activeFieldTab}
              onTabChange={setActiveFieldTab}
              fieldTypes={fieldTypes}
              selectedField={selectedField}
              onFieldSelect={handleFieldSelect}
            />
          </div>

          {/* Center Column - Document Canvas */}
          <div className="col-span-7">
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
              <div className="flex-1 p-4 overflow-hidden">
                <DocumentCanvas fileUrl={currentFileUrl} />
              </div>
            </div>
          </div>

          {/* Right Column - Property Panel */}
          <PropertyCard selectedField={selectedField} />
        </div>
      </main>

      {/* Action Bar */}
      <div className="border-t bg-white p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {allDocuments.length} document{allDocuments.length !== 1 ? 's' : ''} loaded
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBack} className="rounded-[5px]">
              Back
            </Button>
            <Button 
              className="bg-violet-600 hover:bg-violet-700 text-white rounded-[5px]"
              onClick={() => console.log("Continue to recipients")}
            >
              Continue to Recipients
            </Button>
          </div>
        </div>
      </div>

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