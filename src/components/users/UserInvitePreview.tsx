import React from "react";
import { Button } from "@/components/ui/button";
import { AddUserPayload } from "./AddUserForm";

export const UserInvitePreview: React.FC<{
  invite: AddUserPayload;
  onBack: () => void;
  onConfirm: () => void;
}> = ({ invite, onBack, onConfirm }) => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="font-medium text-gray-900">User Info</h3>
        <p><strong>Name:</strong> {invite.fullName}</p>
        <p><strong>Email:</strong> {invite.email}</p>
        <p><strong>Department:</strong> {invite.department}</p>
        <p><strong>Roles:</strong> {invite.roles.join(", ")}</p>
        {invite.message && <p><strong>Message:</strong> {invite.message}</p>}
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button className="bg-violet-600 text-white" onClick={onConfirm}>
          Confirm & Send Invite
        </Button>
      </div>
    </div>
  );
};
