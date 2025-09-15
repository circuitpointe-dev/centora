import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Building2, FileText, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PolicyDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy: any;
  onAcknowledge: (policyId: string) => void;
}

export const PolicyDetailDialog = ({ 
  open, 
  onOpenChange, 
  policy, 
  onAcknowledge 
}: PolicyDetailDialogProps) => {
  if (!policy) return null;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'acknowledged':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAcknowledge = () => {
    onAcknowledge(policy.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{policy.title}</span>
            <Badge className={cn(getStatusColor(policy.status))}>
              {policy.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Policy Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="h-4 w-4" />
                <span>Department: {policy.department || 'General'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarDays className="h-4 w-4" />
                <span>
                  Last Updated: {new Date(policy.last_updated || policy.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                <span>Version: {policy.version || '1.0'}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {policy.description && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600 text-sm">{policy.description}</p>
            </div>
          )}

          {/* Policy Content */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-center h-40 text-gray-500">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-2" />
                <p>Policy content preview</p>
                <p className="text-xs">Full policy content would be displayed here</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {policy.status !== 'Acknowledged' && (
              <Button onClick={handleAcknowledge}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Acknowledge Policy
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};