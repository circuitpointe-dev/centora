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
import { Mail, CheckCircle2 } from 'lucide-react';

interface CheckEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProceedToVerification: () => void;
  email: string;
  organizationName: string;
}

export const CheckEmailModal: React.FC<CheckEmailModalProps> = ({
  open,
  onOpenChange,
  onProceedToVerification,
  email,
  organizationName,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-gray-200 rounded-sm max-w-md">
        <DialogHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Registration Successful!
          </DialogTitle>
          
          <DialogDescription className="text-gray-600 space-y-2">
            <p className="font-medium">Welcome to {organizationName}!</p>
            <p>
              We've sent a verification code to{' '}
              <span className="font-medium text-gray-900">{email}</span>
            </p>
            <p className="text-sm">
              Please check your email and enter the verification code to activate your account.
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Close
          </Button>
          <Button
            onClick={onProceedToVerification}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
          >
            Verify Email Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};