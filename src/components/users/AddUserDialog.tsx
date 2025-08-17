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
import { useCreateInvitation } from "@/hooks/useInvitations";

export const AddUserDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [pendingInvite, setPendingInvite] = useState<AddUserPayload | null>(null);
  const { toast } = useToast();
  const createInvitation = useCreateInvitation();

  const handleSubmit = (payload: AddUserPayload) => setPendingInvite(payload);

  const handleConfirm = async () => {
    if (!pendingInvite) return;
    
    try {
      await createInvitation.mutateAsync({
        email: pendingInvite.email,
        full_name: pendingInvite.fullName,
        department_id: pendingInvite.department || undefined,
        role_ids: pendingInvite.roles || [],
        access: pendingInvite.access,
      });
      
      setPendingInvite(null);
      setOpen(false);
    } catch (error) {
      // Error is handled by the hook
      console.error('Failed to send invitation:', error);
    }
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