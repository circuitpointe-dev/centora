import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ReminderSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReminderSuccessDialog: React.FC<ReminderSuccessDialogProps> = ({
  open,
  onOpenChange
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white">
        <div className="text-center py-8">
          <div className="mx-auto mb-6 w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-violet-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            We've notified the document owners and recipients.
          </h3>
          <p className="text-gray-600 mb-6">
            They'll receive an email with the reminder to update or replace the expiring document.
          </p>
          
          <div className="flex gap-3 justify-center">
            <Button 
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Back to Acknowledgement Dashboard
            </Button>
            <Button 
              className="bg-violet-600 hover:bg-violet-700 text-white"
              onClick={() => onOpenChange(false)}
            >
              View Document Details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};