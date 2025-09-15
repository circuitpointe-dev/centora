import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Building2, FileText, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: any;
}

export const DocumentDetailDialog = ({ open, onOpenChange, document }: DocumentDetailDialogProps) => {
  if (!document) return null;

  const handleDownload = () => {
    // Implement document download functionality
    console.log('Download document:', document.id);
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
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-center h-40 text-gray-500">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-2" />
                <p>Document preview unavailable</p>
                <p className="text-xs">Click download to view the full document</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};