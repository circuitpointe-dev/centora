import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

interface CredentialsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  password: string;
  onContinue: () => void;
}

const CredentialsDialog = ({
  open,
  onOpenChange,
  email,
  password,
  onContinue,
}: CredentialsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <DialogTitle className="text-center">
            Registration Successful!
          </DialogTitle>
          <DialogDescription className="text-center">
            Here are your login credentials. Please keep them safe.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500 mb-1">Username</p>
            <p className="text-lg font-mono bg-white p-2 rounded">{email}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500 mb-1">Password</p>
            <p className="text-lg font-mono bg-white p-2 rounded">{password}</p>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-700 text-center">
              You can change your password after logging in.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Button
            type="button"
            onClick={onContinue}
            className="w-full bg-violet-600 hover:bg-violet-700"
          >
            Continue to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CredentialsDialog;
