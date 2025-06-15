
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'constructive';
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = 'destructive',
}) => {
  const confirmButtonClasses = {
    destructive: "bg-red-600 text-white hover:bg-red-700",
    constructive: "bg-violet-600 text-white hover:bg-violet-700",
  };
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white border-gray-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-900">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={confirmButtonClasses[variant]}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
