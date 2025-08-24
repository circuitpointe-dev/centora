// src/components/users/super-admin/NewSuperAdminDialog.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogClose } from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import type { SuperAdminRole, SuperAdminUser } from "./types";

const BRAND_PURPLE = "bg-purple-600 hover:bg-purple-700 active:bg-purple-800";

export const NewSuperAdminDialog: React.FC<{
  roles: SuperAdminRole[];
  onCreate: (user: Omit<SuperAdminUser, "id" | "lastLoginAt">) => void;
}> = ({ roles, onCreate }) => {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<SuperAdminRole | "">("");
  const [status, setStatus] = React.useState<"active" | "suspended" | "pending">("active");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const canSubmit = fullName.trim() && email.trim() && role;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 450));
    onCreate({
      fullName: fullName.trim(),
      email: email.trim(),
      role: role as SuperAdminRole,
      status,
    });
    setIsSubmitting(false);
    setSuccess(true);
  };

  // reset when dialog closes (handled by parent), consumer doesn't pass open so we expose a Reset method via Cancel/Done
  const resetForm = () => {
    setFullName("");
    setEmail("");
    setRole("");
    setStatus("active");
    setIsSubmitting(false);
    setSuccess(false);
  };

  if (success) {
    return (
      <div className="py-4">
        <div className="flex flex-col items-center py-6">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          <div className="mt-3 text-lg font-semibold">Super Admin Added</div>
          <div className="mt-1 text-center text-sm text-muted-foreground">
            <b>{fullName}</b> has been created successfully.
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-3">
          <DialogClose asChild>
            <Button className={BRAND_PURPLE} onClick={resetForm}>
              Done
            </Button>
          </DialogClose>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label className="text-sm">Full Name</Label>
          <Input placeholder="Enter Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label className="text-sm">Email</Label>
          <Input type="email" placeholder="Enter Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm">Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as SuperAdminRole)}>
              <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
              <SelectContent>
                {roles.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Initial Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-3">
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={!canSubmit || isSubmitting} className={BRAND_PURPLE}>
          {isSubmitting ? "Adding..." : "Add Super Admin"}
        </Button>
      </div>
    </form>
  );
};
