
import React, { useState } from 'react';
import { FileText, Upload, ChevronRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ProgressIndicator } from './ProgressIndicator';
import { RecipientsStep } from './RecipientsStep';
import DocumentSelectionDialog from './DocumentSelectionDialog';
import FileUploadArea from './FileUploadArea';

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

interface UploadedFile {
  file: File;
  id: string;
}

export const RequestSignatureWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [message, setMessage] = useState('');

  const progressSteps = [
    { id: 1, label: "Select Document", active: currentStep >= 1 },
    { id: 2, label: "Assign Recipient & Order", active: currentStep >= 2 },
    { id: 3, label: "Review & Send", active: currentStep >= 3 },
  ];

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document);
    setUploadedFile(null);
  };

  const handleFileSelect = (file: UploadedFile) => {
    setUploadedFile(file);
    setSelectedDocument(null);
  };

  const handleRemoveDocument = () => {
    setSelectedDocument(null);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const canProceed = selectedDocument || uploadedFile;

  const handleProceedToStep2 = () => {
    if (canProceed) {
      setCurrentStep(2);
    }
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const handleProceedToStep3 = () => {
    setCurrentStep(3);
    console.log('Proceeding to Review step');
  };

  if (currentStep === 2) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Progress Indicator */}
        <div className="flex justify-center">
          <ProgressIndicator steps={progressSteps} />
        </div>

        {/* Recipients Step */}
        <RecipientsStep 
          onBack={handleBackToStep1}
          onProceed={handleProceedToStep3}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Indicator */}
      <div className="flex justify-center">
        <ProgressIndicator steps={progressSteps} />
      </div>

      {/* Document Selection Cards */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Select Document Card */}
          <Card className="h-[280px] bg-white rounded-lg shadow-md border">
            <CardContent className="flex flex-col items-center justify-center gap-6 h-full p-6">
              {selectedDocument ? (
                <>
                  <div className="flex items-center gap-3 w-full">
                    <FileText className="w-8 h-8 text-violet-600" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {selectedDocument.fileName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedDocument.fileSize} • {selectedDocument.addedTime}
                      </p>
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
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Document selected</span>
                    </div>
                    <Button
                      onClick={() => setShowDocumentDialog(true)}
                      variant="outline"
                      className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      Change Document
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <FileText className="w-10 h-10 text-gray-600" />
                  <div className="flex flex-col items-center gap-4 w-full">
                    <p className="text-gray-500 text-sm text-center">
                      Select a document from Document Folder
                    </p>
                    <Button 
                      onClick={() => setShowDocumentDialog(true)}
                      className="bg-violet-600 hover:bg-violet-700 text-white rounded-md px-4 py-2"
                    >
                      Select Document
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Upload Document Card */}
          <FileUploadArea
            onFileSelect={handleFileSelect}
            selectedFile={uploadedFile}
            onFileRemove={handleRemoveFile}
          />
        </div>

        {/* Message to Recipients */}
        <div className="space-y-3">
          <label className="font-medium text-gray-900 text-sm">
            Message to Recipients
          </label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px] bg-white rounded-md shadow-sm border resize-none"
            placeholder="Add a message for your recipients..."
          />
        </div>
      </div>

      {/* Proceed Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleProceedToStep2}
          disabled={!canProceed}
          className={`rounded-md px-6 py-3 h-auto ${
            canProceed 
              ? 'bg-violet-600 hover:bg-violet-700 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Proceed to Recipients
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {/* Document Selection Dialog */}
      <DocumentSelectionDialog
        open={showDocumentDialog}
        onOpenChange={setShowDocumentDialog}
        onDocumentSelect={handleDocumentSelect}
        selectedDocument={selectedDocument}
      />
    </div>
  );
};
