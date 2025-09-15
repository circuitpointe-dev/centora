import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface ExpiryConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBackToMonitor: () => void;
}

export const ExpiryConfirmationDialog = ({
  open,
  onOpenChange,
  onBackToMonitor
}: ExpiryConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white text-center">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            Reminder Sent
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Your expiry reminder has been sent successfully.
          </p>
          
          <Button onClick={onBackToMonitor} className="w-full">
            Back to Monitor
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};