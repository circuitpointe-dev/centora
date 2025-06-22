
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

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
      <DialogContent className="bg-white border-gray-200 rounded-sm">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Grant Draft Created!
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Your new grant has been saved successfully.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center">
          <Button onClick={onConfirm} className="bg-green-600 hover:bg-green-700">
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
