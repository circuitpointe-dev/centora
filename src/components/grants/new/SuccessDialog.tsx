import React from 'react';
import { CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const SuccessDialog: React.FC<SuccessDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-gray-200 max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-gray-900 text-xl">
              Grant Created Successfully!
            </DialogTitle>
            <p className="text-gray-600 text-sm">
              Your grant has been created and is now ready for review and activation.
            </p>
          </div>
        </DialogHeader>

        <div className="flex justify-center pt-4">
          <Button
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            View Grant List
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};