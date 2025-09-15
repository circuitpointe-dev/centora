import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SignatureRequest } from '@/hooks/useESignature';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Mail, Calendar, User } from 'lucide-react';

interface DocumentDetailsDialogProps {
  document: SignatureRequest;
  onClose: () => void;
}

export const DocumentDetailsDialog = ({
  document,
  onClose
}: DocumentDetailsDialogProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'signed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Signed</Badge>;
      case 'declined':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Declined</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Signature Request Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Document Info */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Document Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Document Name</span>
                <span className="font-medium">{document.document?.title || 'Unknown Document'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">File Name</span>
                <span className="text-sm">{document.document?.file_name || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                {getStatusBadge(document.status)}
              </div>
            </div>
          </div>

          {/* Signer Info */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Signer Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{document.signer_email}</span>
              </div>
              {document.signer_name && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{document.signer_name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Timeline</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Sent:</span>
                <span className="text-sm">{formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}</span>
              </div>
              {document.expires_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Expires:</span>
                  <span className="text-sm">{formatDistanceToNow(new Date(document.expires_at), { addSuffix: true })}</span>
                </div>
              )}
              {document.signed_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Signed:</span>
                  <span className="text-sm">{formatDistanceToNow(new Date(document.signed_at), { addSuffix: true })}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};