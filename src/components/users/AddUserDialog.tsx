// src/components/users/AddUserDialog.tsx

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
import { UserInvitePreview } from "./UserInvitePreview";
import { useCreateOrgUser } from "@/hooks/useCreateOrgUser";
import { supabase } from "@/integrations/supabase/client";
import { typedSupabase } from "@/lib/superbase-client";

export const AddUserDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [pendingInvite, setPendingInvite] = useState<AddUserPayload | null>(
    null
  );
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);
  const { toast } = useToast();
  const createUser = useCreateOrgUser();

  // Get current org ID when dialog opens
  React.useEffect(() => {
    if (open) {
      const fetchOrgId = async () => {
        const {
          data: { user },
        } = await typedSupabase.auth.getUser();
        if (user) {
          const { data: profile } = await typedSupabase
            .from("profiles")
            .select("org_id")
            .eq("id", user.id)
            .single();

          if (profile?.org_id) {
            setCurrentOrgId(profile.org_id);
          }
        }
      };
      fetchOrgId();
    }
  }, [open]);
  const handleSubmit = (payload: AddUserPayload) => setPendingInvite(payload);

  const handleConfirm = async () => {
    if (!pendingInvite || !currentOrgId) {
      toast({
        title: "Error",
        description: "Unable to determine organization context",
        variant: "destructive",
      });
      return;
    }

    try {
      await createUser.mutateAsync({
        org_id: currentOrgId,
        email: pendingInvite.email,
        full_name: pendingInvite.fullName,
        department_id: pendingInvite.department || null,
        role_ids: pendingInvite.roles || [],
        access_json: pendingInvite.access || {},
      });

      setPendingInvite(null);
      setOpen(false);
    } catch (error) {
      // Error is handled by the hook
      console.error("Failed to create user:", error);
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
            {pendingInvite ? "Review & Create User Account" : "Add New User"}
          </SideDialogTitle>
        </SideDialogHeader>

        {!pendingInvite ? (
          <AddUserForm
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
          />
        ) : (
          <UserInvitePreview
            invite={pendingInvite}
            onBack={() => setPendingInvite(null)}
            onConfirm={handleConfirm}
            isLoading={createUser.isPending}
          />
        )}
      </SideDialogContent>
    </SideDialog>
  );
};
