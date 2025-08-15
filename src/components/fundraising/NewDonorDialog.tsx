
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SideDialog, SideDialogContent, SideDialogHeader, SideDialogTitle, SideDialogTrigger } from "@/components/ui/side-dialog";
import { useToast } from "@/hooks/use-toast";
import { NewDonorForm } from "./NewDonorForm";

interface NewDonorDialogProps {
  triggerButton?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const NewDonorDialog: React.FC<NewDonorDialogProps> = ({ triggerButton, open: externalOpen, onOpenChange: externalOnOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const { toast } = useToast();

  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

  const handleSubmit = () => {
    // Form submission is now handled internally by NewDonorForm
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <SideDialog open={open} onOpenChange={setOpen}>
      <SideDialogTrigger asChild>
        {triggerButton || (
          <Button size="sm" className="flex items-center gap-2 bg-violet-600 text-white hover:bg-violet-700">
            <Plus className="h-4 w-4" />
            New Donor
          </Button>
        )}
      </SideDialogTrigger>
      <SideDialogContent className="w-full sm:w-[600px]">
        <SideDialogHeader>
          <SideDialogTitle>Add New Donor</SideDialogTitle>
        </SideDialogHeader>
        <NewDonorForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </SideDialogContent>
    </SideDialog>
  );
};

export default NewDonorDialog;
