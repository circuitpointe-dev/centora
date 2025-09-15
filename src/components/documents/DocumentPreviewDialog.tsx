import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Eye, X } from 'lucide-react';
import { useDocumentPreview, useDocumentDownload } from '@/hooks/useDocumentOperations';
import { Loader2 } from 'lucide-react';

interface DocumentPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId?: string;
  documentTitle?: string;
}

export const DocumentPreviewDialog: React.FC<DocumentPreviewDialogProps> = ({
  open,
  onOpenChange,
  documentId,
  documentTitle,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewMutation = useDocumentPreview();
  const downloadMutation = useDocumentDownload();

  useEffect(() => {
    if (open && documentId) {
      previewMutation.mutate(documentId, {
        onSuccess: (data) => {
          setPreviewUrl(data.url);
        },
      });
    }
    
    // Cleanup URL when dialog closes
    return () => {
      if (previewUrl) {
        window.URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    };
  }, [open, documentId]);

  const handleDownload = () => {
    if (documentId) {
      downloadMutation.mutate(documentId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{documentTitle || 'Document Preview'}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={downloadMutation.isPending}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 min-h-[500px]">
          {previewMutation.isPending ? (
            <div className="flex items-center justify-center h-[500px]">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-gray-500">Loading preview...</p>
              </div>
            </div>
          ) : previewMutation.error ? (
            <div className="flex items-center justify-center h-[500px]">
              <div className="text-center">
                <Eye className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-red-600 mb-2">Failed to load preview</p>
                <p className="text-gray-500 text-sm">
                  {previewMutation.error?.message || 'Unknown error occurred'}
                </p>
              </div>
            </div>
          ) : previewUrl ? (
            <div className="h-[500px] border rounded-lg overflow-hidden">
              <iframe
                src={previewUrl}
                className="w-full h-full"
                title="Document Preview"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-[500px]">
              <div className="text-center">
                <Eye className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">No preview available</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};