import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, FileText, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DocumentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: any;
}

export const DocumentDetailDialog = ({ open, onOpenChange, document }: DocumentDetailDialogProps) => {
  if (!document) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Retired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {document.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(document.status)}>
              {document.status}
            </Badge>
            <span className="text-sm text-gray-500">
              Department: {document.department}
            </span>
          </div>

          {document.description && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{document.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Effective Date</h3>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{new Date(document.effective_date).toLocaleDateString()}</span>
              </div>
            </div>

            {document.expires_date && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Expiry Date</h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(document.expires_date).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Document Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Document ID:</span>
                <span className="font-mono text-xs">{document.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span>{formatDistanceToNow(new Date(document.effective_date), { addSuffix: true })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Acknowledgment Required:</span>
                <span>{document.acknowledgment_required ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};