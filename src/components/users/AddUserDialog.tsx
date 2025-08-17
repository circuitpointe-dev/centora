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
import {
  AddUserForm,
  type AddUserPayload
} from "./AddUserForm";
import { UserInvitePreview } from "./UserInvitePreview";

export const AddUserDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [pendingInvite, setPendingInvite] = useState<AddUserPayload | null>(null);
  const { toast } = useToast();

  const handleSubmit = (payload: AddUserPayload) => setPendingInvite(payload);

  const handleConfirm = () => {
    if (!pendingInvite) return;
    // TODO: wire to Supabase invite endpoint
    console.log("Confirmed invite:", pendingInvite);
    toast({
      title: "Invite sent (mock)",
      description: `Invitation prepared for ${pendingInvite.email}`,
    });
    setPendingInvite(null);
    setOpen(false);
  };

  return (
    <SideDialog open={open} onOpenChange={setOpen}>
      <SideDialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-violet-600 text-white hover:bg-violet-700">
          <Plus className="h-4 w-4" />
          Add New User
        </Button>
      </SideDialogTrigger>

      <SideDialogContent className="w-full sm:w-[720px]">
        <SideDialogHeader>
          <SideDialogTitle>
            {pendingInvite ? "Review & Confirm Invite" : "Add New User"}
          </SideDialogTitle>
        </SideDialogHeader>

        {!pendingInvite ? (
          <AddUserForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
        ) : (
          <UserInvitePreview
            invite={pendingInvite}
            onBack={() => setPendingInvite(null)}
            onConfirm={handleConfirm}
          />
        )}
      </SideDialogContent>
    </SideDialog>
  );
}