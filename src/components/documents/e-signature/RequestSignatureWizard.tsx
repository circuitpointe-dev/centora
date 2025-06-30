
import React, { useState } from "react";
import { ProgressIndicator } from "./ProgressIndicator";
import { DocumentPreparationStep } from "./DocumentPreparationStep";
import { SendToRecipientsDialog } from "./SendToRecipientsDialog";

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

interface Recipient {
  id: string;
  name: string;
  email: string;
  order: number;
}

export const RequestSignatureWizard = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [showSendDialog, setShowSendDialog] = useState(false);

  const progressSteps = [
    { id: 1, label: "Prepare Document", active: true },
    { id: 2, label: "Send for Signature", active: false },
  ];

  const handleSendForSignature = () => {
    setShowSendDialog(true);
  };

  const handleSendToRecipients = (recipients: Recipient[], message: string) => {
    console.log("Sending document for signature", {
      recipients,
      message,
      document: selectedDocument,
      uploadedFile: uploadedFile,
    });
    
    // Update progress to show completion
    progressSteps[1].active = true;
    
    // Here you would implement the actual sending logic
    // For now, we'll just log and close the dialog
    setShowSendDialog(false);
  };

  return (
    <div className="max-w-full mx-auto space-y-6">
      {/* Progress Indicator */}
      <div className="flex justify-center">
        <ProgressIndicator steps={progressSteps} />
      </div>

      {/* Main Document Preparation Step */}
      <DocumentPreparationStep
        onSendForSignature={handleSendForSignature}
        selectedDocument={selectedDocument}
        uploadedFile={uploadedFile}
      />

      {/* Send To Recipients Dialog */}
      <SendToRecipientsDialog
        open={showSendDialog}
        onOpenChange={setShowSendDialog}
        onSend={handleSendToRecipients}
      />
    </div>
  );
};
