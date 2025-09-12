import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface ExpiryConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBackToMonitor: () => void;
}

export function ExpiryConfirmationDialog({
  open,
  onOpenChange,
  onBackToMonitor
}: ExpiryConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded">
        <DialogHeader>
          <DialogTitle className="text-black font-semibold text-center">Reminder Sent</DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <p className="text-gray-600">Your expiry reminder has been sent successfully!</p>
          <Button
            onClick={onBackToMonitor}
            className="w-full rounded bg-black text-white hover:bg-gray-800"
          >
            Back to Monitor
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}