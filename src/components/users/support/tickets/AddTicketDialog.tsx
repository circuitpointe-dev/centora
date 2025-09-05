// src/components/support/tickets/AddTicketDialog.tsx

import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ticket, TicketPriority, TicketStatus } from "./TicketTypes";

export function AddTicketDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (t: Ticket) => void;
}) {
  const [subject, setSubject] = useState("");
  const [tenant, setTenant] = useState("NimbusPay");
  const [category, setCategory] = useState("Access");
  const [priority, setPriority] = useState<TicketPriority>("Medium");
  const [description, setDescription] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");

  const onSubmit = () => {
    const now = new Date().toISOString();
    const newTicket: Ticket = {
      id: `TCK-${Math.floor(Math.random() * 9000 + 1000)}`,
      subject,
      tenantName: tenant,
      status: "Open" as TicketStatus,
      priority,
      category,
      description,
      requester: { name: requesterName || "Unknown", email: requesterEmail || "unknown@example.com" },
      assignee: null,
      createdAt: now,
      updatedAt: now,
      comments: [],
      activity: [
        { id: "a-new", label: "Ticket Created", at: now, by: requesterName, icon: "Ticket" },
      ],
    };
    onCreate(newTicket);
    onOpenChange(false);
    // reset
    setSubject(""); setTenant("NimbusPay"); setCategory("Access"); setPriority("Medium"); setDescription(""); setRequesterName(""); setRequesterEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>New Support Ticket</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Subject</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Short summary" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="grid gap-2">
              <Label>Tenant</Label>
              <Select value={tenant} onValueChange={setTenant}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {['NimbusPay','QuickMart','BlueCargo','FarmLink'].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {['Access','Billing','Technical','Other'].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TicketPriority)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {(['Low','Medium','High','Urgent'] as const).map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell us more about the issue..." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Requester Name</Label>
              <Input value={requesterName} onChange={(e) => setRequesterName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Requester Email</Label>
              <Input value={requesterEmail} onChange={(e) => setRequesterEmail(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <button className="px-3 py-2 rounded-md border text-sm" onClick={() => onOpenChange(false)}>Cancel</button>
          <button className="px-3 py-2 rounded-md text-white text-sm bg-purple-600 hover:bg-purple-700 active:bg-purple-800" onClick={onSubmit}>Create Ticket</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}