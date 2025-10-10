import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Building2, FileText, Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDocumentDownload, useDocumentPreview } from '@/hooks/useDocumentOperations';

interface DocumentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: any;
}

export const DocumentDetailDialog = ({ open, onOpenChange, document }: DocumentDetailDialogProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const downloadMutation = useDocumentDownload();
  const previewMutation = useDocumentPreview();

  useEffect(() => {
    if (open && document?.document_id) {
      previewMutation.mutate(document.document_id, {
        onSuccess: (data) => {
          setPreviewUrl(data.url);
        },
      });
    }
    
    return () => {
      if (previewUrl) {
        window.URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    };
  }, [open, document?.document_id]);

  if (!document) return null;

  const handleDownload = () => {
    if (document.document_id) {
      downloadMutation.mutate(document.document_id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expired':
      case 'retired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{document.title}</span>
            <Badge className={cn(getStatusColor(document.status))}>
              {document.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Document Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="h-4 w-4" />
                <span>Department: {document.department || 'General'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarDays className="h-4 w-4" />
                <span>
                  Effective: {new Date(document.effective_date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {document.expires_date && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    Expires: {new Date(document.expires_date).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                <span>Version: {document.version || '1.0'}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {document.description && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600 text-sm">{document.description}</p>
            </div>
          )}

          {/* Document Content */}
          <div className="border rounded-lg overflow-hidden bg-gray-50">
            {previewMutation.isPending ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                  <p className="text-gray-600">Loading preview...</p>
                </div>
              </div>
            ) : previewMutation.error ? (
              <div className="flex items-center justify-center h-40 p-4">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600 mb-1">Policy content preview</p>
                  <p className="text-xs text-gray-500">Full policy content would be displayed here</p>
                </div>
              </div>
            ) : previewUrl ? (
              <div className="h-[400px]">
                <iframe
                  src={previewUrl}
                  className="w-full h-full"
                  title="Document Preview"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 p-4">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600 mb-1">Document preview unavailable</p>
                  <p className="text-xs text-gray-500">Click download to view the full document</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button 
              onClick={handleDownload}
              disabled={downloadMutation.isPending}
            >
              {downloadMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};