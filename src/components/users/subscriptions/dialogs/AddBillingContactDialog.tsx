// src/components/users/subscriptions/CardDetailsDialog.tsx

import * as React from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { BillingContact } from "./mock/contacts-data";

type Props = {
  onSave: (contact: BillingContact) => void;
  onClose: () => void;
};

export const AddBillingContactDialog: React.FC<Props> = ({ onSave, onClose }) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("Finance");
  const [notifications, setNotifications] = React.useState<string[]>(["Invoices"]);

  const toggleNotif = (n: string) =>
    setNotifications((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));

  const save = () =>
    onSave({
      id: crypto?.randomUUID?.() ?? String(Math.random()).slice(2),
      name,
      email,
      role,
      notifications,
    });

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add billing contact</DialogTitle>
        <DialogDescription>People here will receive billing emails and invoices.</DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label>Full name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@org.com" />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Finance" />
        </div>
        <div className="space-y-2">
          <Label>Notifications</Label>
          <div className="flex flex-wrap gap-1.5">
            {["Invoices", "Payment updates", "Plan changes"].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => toggleNotif(n)}
                className={`px-2 py-1 rounded-md text-xs border ${
                  notifications.includes(n)
                    ? "border-brand-purple bg-brand-purple/5"
                    : "border-gray-300"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={save}
          className="bg-brand-purple text-brand-purple-foreground hover:bg-brand-purple/90"
        >
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
