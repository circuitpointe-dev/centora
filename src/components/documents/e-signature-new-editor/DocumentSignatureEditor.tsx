import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateDocument } from '@/hooks/useDocuments';
import { uploadFile } from '@/hooks/useDocumentStorage';
import { SignatureRequestDialog } from './SignatureRequestDialog';

interface LocationState {
  selectedFiles?: File[];
  selectedDoc?: any;
}

export const DocumentSignatureEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const createDocument = useCreateDocument();
  const state = location.state as LocationState;
  
  React.useEffect(() => {
    const uploadDocument = async () => {
      if (state?.selectedFiles && state.selectedFiles.length > 0 && !uploadedDocument) {
        setIsUploading(true);
        try {
          const file = state.selectedFiles[0];
          const filePath = `${Date.now()}-${file.name}`;
          
          // Upload file to Supabase Storage
          const fileUrl = await uploadFile(file, filePath);
          
          // Create document record
          const documentData = await createDocument.mutateAsync({
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
            file_name: file.name,
            file_path: filePath,
            file_size: file.size,
            mime_type: file.type,
            category: 'contracts', // Default category
          });
          
          setUploadedDocument(documentData);
          toast.success('Document uploaded successfully');
        } catch (error) {
          console.error('Upload error:', error);
          toast.error('Failed to upload document');
          navigate('/dashboard/documents/request-signature');
        } finally {
          setIsUploading(false);
        }
      }
    };
    
    uploadDocument();
  }, [state?.selectedFiles, createDocument, uploadedDocument, navigate]);

  const handleBack = () => {
    navigate('/dashboard/documents/request-signature');
  };

  const handleRequestSignature = () => {
    const document = uploadedDocument || state?.selectedDoc;
    if (document) {
      setShowSignatureDialog(true);
    } else {
      toast.error('No document available for signature request');
    }
  };

  const document = uploadedDocument || state?.selectedDoc;

  if (isUploading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Uploading document...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Document Selected</h2>
          <p className="text-gray-600 mb-4">Please select a document to create a signature request.</p>
          <Button onClick={handleBack}>
            Back to Document Selection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Document Editor</h1>
            <p className="text-sm text-gray-600">{document.title || document.fileName}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto">
                <Plus className="w-8 h-8 text-violet-600" />
              </div>
              
              <div>
                <h2 className="text-lg font-medium mb-2">Document Ready for Signature</h2>
                <p className="text-gray-600 mb-6">
                  Your document has been uploaded and is ready to be sent for signature.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    📄
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{document.title || document.fileName}</p>
                    <p className="text-sm text-gray-500">
                      {document.file_size ? `${(document.file_size / 1024 / 1024).toFixed(2)} MB` : document.fileSize}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleRequestSignature} className="bg-violet-600 hover:bg-violet-700">
                  Request Signature
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Signature Request Dialog */}
      <SignatureRequestDialog
        open={showSignatureDialog}
        onOpenChange={setShowSignatureDialog}
        document={document}
        onSuccess={() => {
          setShowSignatureDialog(false);
          navigate('/dashboard/documents/e-signature');
        }}
      />
    </div>
  );
};