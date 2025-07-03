import React, { useState, useCallback } from "react";
import { X, Upload, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import DocumentSelectionDialog from "./DocumentSelectionDialog";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  fileName: string;
  category: string;
  fileSize: string;
  addedTime: string;
  owner: { name: string; avatar: string };
  tags: { name: string; bgColor: string; textColor: string }[];
}

export const RequestSignatureWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showDocDialog, setShowDocDialog] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);

  const hasChanges = !!selectedDoc || selectedFiles.length > 0;
  const canContinue = hasChanges;

  const handleClose = () =>
    hasChanges
      ? setConfirmExit(true)
      : navigate("/dashboard/documents/e-signature");

  const confirmAndLeave = () => navigate("/dashboard/documents/e-signature");

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setSelectedFiles((f) => [...f, ...Array.from(e.dataTransfer.files)]);
    setSelectedDoc(null);
  }, []);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles((f) => [...f, ...Array.from(e.target.files || [])]);
    setSelectedDoc(null);
  };

  const removeFile = (i: number) =>
    setSelectedFiles((f) => f.filter((_, idx) => idx !== i));

  const removeDoc = () => setSelectedDoc(null);

  const handleDocSelect = (doc: Document) => {
    setSelectedDoc(doc);
    setSelectedFiles([]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white pt-8 p-4">
      {/* Header */}
      <header className="w-full max-w-md flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">Request Signature</h1>
          <p className="text-sm text-gray-600">Upload or pick a document</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="w-4 h-4 text-gray-600" />
        </Button>
      </header>

      {/* Upload / Select Area */}
      <main className="w-full max-w-md space-y-4">
        <Card
          className={cn(
            "transition border rounded p-4 flex flex-col items-center",
            isDragOver && "border-violet-300 bg-violet-50"
          )}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <Upload className="w-8 h-8 text-violet-600 mb-2" />
          <p className="text-sm font-medium">Drag &amp; drop files here</p>
          <p className="text-xs text-gray-500 my-1">or</p>
          <div className="relative w-full flex justify-center">
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.xlsx,.pptx"
              onChange={onFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button className="text-sm px-4 py-1.5 bg-violet-600 hover:bg-violet-700 rounded-md text-white">
              Select Files
            </Button>
          </div>
        </Card>

        <div className="flex items-center text-xs text-gray-400">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-2">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowDocDialog(true)}
            className="text-sm px-4 py-1.5 border-violet-600 text-violet-600 hover:bg-violet-50 rounded-md"
          >
            <FileText className="w-4 h-4 mr-1" />
            From Library
          </Button>
        </div>

        {/* Selected Items */}
        {(selectedFiles.length > 0 || selectedDoc) && (
          <section className="space-y-2">
            <h2 className="text-sm font-medium">Selected for Signature</h2>

            {selectedFiles.map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-gray-50 rounded px-3 py-2"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-violet-600" />
                  <div>
                    <p className="text-sm">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeFile(i)}
                >
                  <X className="w-3 h-3 text-red-500" />
                </Button>
              </div>
            ))}

            {selectedDoc && (
              <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-violet-600" />
                  <div>
                    <p className="text-sm">{selectedDoc.fileName}</p>
                    <p className="text-xs text-gray-500">
                      {selectedDoc.fileSize} • {selectedDoc.addedTime}
                    </p>
                  </div>
                </div>
                <Button size="icon" variant="ghost" onClick={removeDoc}>
                  <X className="w-3 h-3 text-red-500" />
                </Button>
              </div>
            )}
          </section>
        )}

        {/* Continue */}
        {canContinue && (
          <div className="flex justify-center">
            <Button
              onClick={() =>
                console.log("Continue with:", { selectedFiles, selectedDoc })
              }
              className="text-sm px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-md"
            >
              Continue
            </Button>
          </div>
        )}
      </main>

      {/* Dialogs */}
      <DocumentSelectionDialog
        open={showDocDialog}
        onOpenChange={setShowDocDialog}
        onDocumentSelect={handleDocSelect}
        selectedDocument={selectedDoc}
      />

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