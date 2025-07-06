
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentCanvas } from "./DocumentCanvas";
import { FieldEditorCard } from "./FieldEditorCard";

interface Document {
  id: string;
  fileName: string;
  fileSize: string;
  type: 'file' | 'document';
  data: any;
}

interface FieldData {
  id: string;
  type: "signature" | "name" | "date" | "email" | "text";
  label: string;
  value?: any;
  isConfigured: boolean;
}

interface DocumentEditorMainContentProps {
  allDocuments: Document[];
  activeDocumentIndex: number;
  onDocumentTabChange: (value: string) => void;
  onFieldAdded: (field: FieldData, position: { x: number; y: number }) => void;
  onPreview: () => void;
  onContinue: () => void;
}

export const DocumentEditorMainContent: React.FC<DocumentEditorMainContentProps> = ({
  allDocuments,
  activeDocumentIndex,
  onDocumentTabChange,
  onFieldAdded,
  onPreview,
  onContinue
}) => {
  const currentDocument = allDocuments[activeDocumentIndex];
  const currentFileUrl = currentDocument?.type === 'file' 
    ? URL.createObjectURL(currentDocument.data) 
    : currentDocument?.data?.fileUrl;

  return (
    <main className="flex-1 p-4 h-[calc(100vh-120px)]">
      <div className="grid grid-cols-12 gap-4 h-full">
        {/* Left Column - Document Canvas */}
        <div className="col-span-9 h-full">
          <div className="bg-white rounded-[5px] border h-full flex flex-col">
            {/* Document Tabs (if multiple documents) */}
            {allDocuments.length > 1 && (
              <div className="border-b">
                <Tabs value={activeDocumentIndex.toString()} onValueChange={onDocumentTabChange}>
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
                onFieldAdded={onFieldAdded}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Field Editor */}
        <FieldEditorCard 
          onPreview={onPreview}
          onContinue={onContinue}
          documentCount={allDocuments.length}
        />
      </div>
    </main>
  );
};
