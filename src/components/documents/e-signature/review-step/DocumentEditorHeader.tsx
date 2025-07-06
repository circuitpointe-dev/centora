
import React from "react";
import { X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentEditorHeaderProps {
  onBack: () => void;
  onClose: () => void;
}

export const DocumentEditorHeader: React.FC<DocumentEditorHeaderProps> = ({
  onBack,
  onClose
}) => {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Document Editor</h1>
          <p className="text-sm text-gray-600">
            Add signature fields and configure document for signing
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="w-4 h-4 text-gray-600" />
      </Button>
    </header>
  );
};
