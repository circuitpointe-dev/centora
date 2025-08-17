import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  SideDialog,
  SideDialogContent,
  SideDialogHeader,
  SideDialogTitle,
  SideDialogTrigger,
} from "@/components/ui/side-dialog";
import { useToast } from "@/hooks/use-toast";
import { AddUserForm, type AddUserPayload } from "./AddUserForm";

interface AddUserDialogProps {
  /** Optional: provide your own trigger (e.g., the Toolbar button) */
  triggerButton?: React.ReactNode;
  /** If you want to control externally */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const AddUserDialog: React.FC<AddUserDialogProps> = ({
  triggerButton,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const { toast } = useToast();

  const open = externalOpen ?? internalOpen;
  const setOpen = externalOnOpenChange ?? setInternalOpen;

  const handleSubmit = async (payload: AddUserPayload) => {
    // Wire to Supabase later; for now, just toast & close
    console.log("Invite payload:", payload);
    toast({
      title: "Invite sent (mock)",
      description: `Invitation prepared for ${payload.email}`,
    });
    setOpen(false);
  };

  const handleCancel = () => setOpen(false);

  return (
    <SideDialog open={open} onOpenChange={setOpen}>
      <SideDialogTrigger asChild>
        {triggerButton ?? (
          <Button
            size="sm"
            className="flex items-center gap-2 bg-violet-600 text-white hover:bg-violet-700"
          >
            <Plus className="h-4 w-4" />
            Add New User
          </Button>
        )}
      </SideDialogTrigger>
      <SideDialogContent className="w-full sm:w-[720px]">
        <SideDialogHeader>
          <SideDialogTitle>Add New User</SideDialogTitle>
        </SideDialogHeader>
        <AddUserForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </SideDialogContent>
    </SideDialog>
  );
};
