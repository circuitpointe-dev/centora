
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SignerSection } from "./SignerSection";
import { FieldInputs } from "./FieldInputs";
import { ActionButtons } from "./ActionButtons";

interface SignatureData {
  type: string;
  data: string;
}

interface FieldData {
  id: string;
  type: "signature" | "name" | "date" | "email" | "text";
  label: string;
  value?: string | Date | SignatureData;
  isConfigured: boolean;
}

interface FieldEditorCardProps {
  onPreview: () => void;
  onContinue: () => void;
  documentCount: number;
}

export const FieldEditorCard = ({ onPreview, onContinue, documentCount }: FieldEditorCardProps) => {
  const [fields, setFields] = useState<FieldData[]>([
    { id: "signature", type: "signature", label: "Signature", isConfigured: false },
    { id: "name", type: "name", label: "Full Name", isConfigured: false },
    { id: "date", type: "date", label: "Date", isConfigured: false },
    { id: "email", type: "email", label: "Email", isConfigured: false },
    { id: "text", type: "text", label: "Text", isConfigured: false }
  ]);
  
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, field: FieldData) => {
    if (!field.isConfigured) {
      e.preventDefault();
      return;
    }
    console.log("Dragging field:", field);
    e.dataTransfer.setData("application/json", JSON.stringify({ fieldType: field.type, fieldData: field }));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFields(prev => prev.map(field => 
      field.id === fieldId 
        ? { ...field, value, isConfigured: true }
        : field
    ));
  };

  const handleSignatureCreate = (signatureData: SignatureData) => {
    if (editingFieldId) {
      handleFieldChange(editingFieldId, signatureData);
      setEditingFieldId(null);
    }
    setShowSignatureDialog(false);
  };

  const openSignatureDialog = (fieldId: string) => {
    setEditingFieldId(fieldId);
    setShowSignatureDialog(true);
  };

  return (
    <div className="col-span-3 h-full">
      <Card className="h-full bg-white rounded-[5px] border flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-start gap-px px-4 py-4 w-full border-b">
          <h3 className="font-bold text-gray-900 text-lg leading-6">
            Signing Options
          </h3>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-4 py-4">
            <div className="flex flex-col gap-6">
              <SignerSection />
              <FieldInputs
                fields={fields}
                onFieldChange={handleFieldChange}
                onDragStart={handleDragStart}
                showSignatureDialog={showSignatureDialog}
                onShowSignatureDialog={setShowSignatureDialog}
                onSignatureCreate={handleSignatureCreate}
                editingFieldId={editingFieldId}
                onOpenSignatureDialog={openSignatureDialog}
              />
            </div>
          </ScrollArea>
        </div>
        
        {/* Fixed Action Bar */}
        <ActionButtons
          onPreview={onPreview}
          onContinue={onContinue}
          documentCount={documentCount}
        />
      </Card>
    </div>
  );
};
