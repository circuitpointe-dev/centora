import React, { useState, useCallback } from 'react';
import { X, Upload, FileText, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { cn } from '@/lib/utils';
import DocumentSelectionDialog from './DocumentSelectionDialog';

interface Document {
  id: string;
  fileName: string;
  category: string;
  fileSize: string;
  addedTime: string;
  owner: {
    name: string;
    avatar: string;
  };
  tags: Array<{
    name: string;
    bgColor: string;
    textColor: string;
  }>;
}

export const RequestSignatureWizardPage = () => {
  const navigate = useNavigate();
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const hasChanges = selectedFiles.length > 0 || selectedDocument !== null;

  const handleClose = () => {
    if (hasChanges) {
      setShowExitConfirmation(true);
    } else {
      navigate('/dashboard/documents/e-signature');
    }
  };

  const handleConfirmExit = () => {
    navigate('/dashboard/documents/e-signature');
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setSelectedFiles(prev => [...prev, ...droppedFiles]);
    setSelectedDocument(null); // Clear selected document when files are dropped
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
    setSelectedDocument(null); // Clear selected document when files are selected
  };

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document);
    setSelectedFiles([]); // Clear selected files when document is selected
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveDocument = () => {
    setSelectedDocument(null);
  };

  const handleContinue = () => {
    // TODO: Navigate to next step of the wizard
    console.log('Continue with:', { selectedFiles, selectedDocument });
  };

  const canContinue = selectedFiles.length > 0 || selectedDocument !== null;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-white">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Request for Signature</h1>
          <p className="text-sm text-gray-600 mt-1">Upload documents and request signatures from recipients</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="h-10 w-10 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Central Upload Area */}
          <div className="text-center mb-12">
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Select Document to Send for Signature
            </h2>
            <p className="text-gray-600 mb-8">
              Choose a document from your library or upload a new file to get started
            </p>

            {/* File Drop Zone */}
            <Card 
              className={cn(
                "w-full max-w-2xl mx-auto mb-6 transition-all duration-200",
                isDragOver && "border-violet-300 border-2 border-dashed bg-violet-50"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <CardContent className="flex flex-col items-center justify-center p-12">
                <Upload className="w-16 h-16 text-violet-600 mb-6" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Drag and drop files here
                </h3>
                <p className="text-gray-600 mb-6">or</p>
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.doc,.docx,.txt,.xlsx,.pptx"
                  />
                  <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-[5px] px-8 py-3">
                    Browse Files
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Supported formats: PDF, DOC, DOCX, TXT, XLSX, PPTX
                </p>
              </CardContent>
            </Card>

            {/* Alternative Option */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-500">or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowDocumentDialog(true)}
              className="border-violet-600 text-violet-600 hover:bg-violet-50 rounded-[5px] px-8 py-3 gap-2"
            >
              <FileText className="w-4 h-4" />
              Select from Document Library
            </Button>
          </div>

          {/* Selected Files/Documents Display */}
          {(selectedFiles.length > 0 || selectedDocument) && (
            <div className="max-w-2xl mx-auto mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Selected for Signature</h3>
              
              {/* Selected Files */}
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-[5px] mb-2">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFile(index)}
                    className="h-8 w-8 text-gray-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {/* Selected Document */}
              {selectedDocument && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[5px] mb-2">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedDocument.fileName}</p>
                      <p className="text-sm text-gray-500">{selectedDocument.fileSize} • {selectedDocument.addedTime}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveDocument}
                    className="h-8 w-8 text-gray-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Continue Button */}
          {canContinue && (
            <div className="text-center">
              <Button
                onClick={handleContinue}
                className="bg-violet-600 hover:bg-violet-700 text-white rounded-[5px] px-8 py-3"
              >
                Continue to Document Preparation
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Document Selection Dialog */}
      <DocumentSelectionDialog
        open={showDocumentDialog}
        onOpenChange={setShowDocumentDialog}
        onDocumentSelect={handleDocumentSelect}
        selectedDocument={selectedDocument}
      />

      {/* Exit Confirmation Dialog */}
      <ConfirmationDialog
        open={showExitConfirmation}
        onOpenChange={setShowExitConfirmation}
        title="Unsaved Changes"
        description="You have unsaved changes. Are you sure you want to leave? All progress will be lost."
        onConfirm={handleConfirmExit}
        confirmText="Leave"
        cancelText="Stay"
        variant="destructive"
      />
    </div>
  );
};