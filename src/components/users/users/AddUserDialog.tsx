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
import { AddUserForm, type AddUserPayload } from "./AddUserForm";
import { UserInvitePreview } from "./UserInvitePreview";
import { UserInviteSuccess } from "./UserInviteSuccess";
import { useMockUsers } from "@/components/users/users/mock/MockUsersProvider";

type Step = "form" | "preview" | "success";

export const AddUserDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [invite, setInvite] = useState<AddUserPayload | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const { addUser } = useMockUsers();

  const reset = () => {
    setInvite(null);
    setStep("form");
  };

  // ⬅️ This is what switches Form → Preview
  const handleFormSubmit = (payload: AddUserPayload) => {
    setInvite(payload);
    setStep("preview");
  };

  const handleConfirm = async () => {
    if (!invite) return;
    setIsSimulating(true);
    console.log("[UI-only] Create user payload:", invite);
    await new Promise((r) => setTimeout(r, 450));
    addUser({
      id: "u_" + Math.random().toString(36).slice(2, 8),
      full_name: invite.fullName,
      email: invite.email,
      department: invite.department || "—",
      status: "active",
      // keep modules/roles as simple display; map from access if you like
      modules: Object.entries(invite.access || {})
        .filter(([, m]: any) => m?._module)
        .map(([k]) => k),
      roles: [], // legacy; your per-module roles live inside access now
    });
    setIsSimulating(false);
    setStep("success");
  };

  const handleAddAnother = () => {
    // Keep dialog open; go back to a fresh form
    reset();
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <SideDialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset(); // close → always clean up
      }}
    >
      <SideDialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-violet-600 text-white hover:bg-violet-700">
          <Plus className="h-4 w-4" />
          Add New User
        </Button>
      </SideDialogTrigger>

      <SideDialogContent
        className="w-full sm:w-[720px]"
        aria-describedby="add-user-dialog-desc"
      >
        {/* a11y: silence missing description warning */}
        <p id="add-user-dialog-desc" className="sr-only">
          Create a user by filling the form, then review and confirm the
          details.
        </p>

        <SideDialogHeader>
          <SideDialogTitle>
            {step === "form" && "Add New User"}
            {step === "preview" && "Review & Create User Account"}
            {step === "success" && "User Created"}
          </SideDialogTitle>
        </SideDialogHeader>

        {step === "form" && (
          <AddUserForm onSubmit={handleFormSubmit} onCancel={handleClose} />
        )}

        {step === "preview" && invite && (
          <UserInvitePreview
            invite={invite}
            onBack={() => setStep("form")}
            onConfirm={handleConfirm}
            isLoading={isSimulating}
          />
        )}

        {step === "success" && invite && (
          <UserInviteSuccess
            invite={invite}
            onClose={handleClose}
            onAddAnother={handleAddAnother}
          />
        )}
      </SideDialogContent>
    </SideDialog>
  );
};
