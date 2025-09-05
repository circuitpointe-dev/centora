// src/components/users/support/tickets/TicketDetailsDialog.tsx

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ticket, TicketComment, TicketPriority, TicketStatus } from "./TicketTypes";
import { TicketStatusPill } from "./TicketStatusPill";
import { Clock, Flag, Mail, User } from "lucide-react";
import { mockAgents } from "./mock/tickets";

const UNASSIGNED = "__UNASSIGNED__"; // non-empty sentinel to satisfy Radix <Select.Item />

function formatRelative(iso?: string) {
  if (!iso) return "";
  try {
    const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
    return mins < 60 ? rtf.format(-mins, "minute") : rtf.format(-Math.round(mins / 60), "hour");
  } catch {
    return new Date(iso).toLocaleString();
  }
}

export function TicketDetailsDialog({
  open,
  onOpenChange,
  ticket,
  onUpdate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  ticket: Ticket | null;
  onUpdate: (t: Ticket) => void;
}) {
  const [assignee, setAssignee] = useState<string>(UNASSIGNED);
  const [status, setStatus] = useState<TicketStatus>("Open");
  const [priority, setPriority] = useState<TicketPriority>("Medium");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!ticket) return;
    setAssignee(ticket.assignee?.name ?? UNASSIGNED);
    setStatus(ticket.status);
    setPriority(ticket.priority);
    setMessage("");
  }, [ticket, open]);

  const createdRel = useMemo(() => formatRelative(ticket?.createdAt), [ticket]);

  const addComment = () => {
    if (!ticket || !message.trim()) return;
    const newComment: TicketComment = {
      id: Math.random().toString(36).slice(2),
      author: { name: "Support Agent", role: "Staff" },
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };
    onUpdate({ ...ticket, comments: [...ticket.comments, newComment], updatedAt: new Date().toISOString() });
    setMessage("");
  };

  const applyMetaChanges = () => {
    if (!ticket) return;
    onUpdate({
      ...ticket,
      status,
      priority,
      assignee:
        assignee === UNASSIGNED
          ? null
          : { name: assignee, email: `${assignee.split(" ").join(".").toLowerCase()}@projectspecc.com` },
      updatedAt: new Date().toISOString(),
    });
  };

  const resolveTicket = () => {
    if (!ticket) return;
    onUpdate({ ...ticket, status: "Resolved", updatedAt: new Date().toISOString() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[760px] p-0"
        aria-describedby="ticket-dialog-desc"
      >
        <DialogHeader className="p-6 pb-3">
          <DialogTitle>Ticket Details</DialogTitle>
          <DialogDescription id="ticket-dialog-desc" className="sr-only">
            View and manage a support ticket
          </DialogDescription>
        </DialogHeader>

        {!ticket ? null : (
          <div className="px-6 pb-6">
            {/* Sticky meta header */}
            <div className="space-y-1 mb-4">
              <div className="text-base font-semibold">{ticket.subject}</div>
              <div className="text-xs text-zinc-500">
                {ticket.tenantName} • #{ticket.id}
              </div>
            </div>

            {/* Scrollable body */}
            <div className="max-h-[70vh] overflow-auto pr-1 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <span className="text-xs text-zinc-500">Status</span>
                  <div className="flex items-center gap-2">
                    <TicketStatusPill status={status} />
                  </div>
                </div>
                <div className="grid gap-1">
                  <span className="text-xs text-zinc-500">Priority</span>
                  <Badge variant="outline" className="inline-flex items-center gap-1">
                    <Flag className="h-3.5 w-3.5" /> {priority}
                  </Badge>
                </div>
                <div className="grid gap-1">
                  <span className="text-xs text-zinc-500">Requester</span>
                  <div className="text-sm inline-flex items-center gap-2">
                    <Mail className="h-4 w-4" /> {ticket.requester.name} ({ticket.requester.email})
                  </div>
                </div>
                <div className="grid gap-1">
                  <span className="text-xs text-zinc-500">Assignee</span>
                  <div className="text-sm inline-flex items-center gap-2">
                    <User className="h-4 w-4" /> {assignee === UNASSIGNED ? "Unassigned" : assignee}
                  </div>
                </div>
                <div className="grid gap-1">
                  <span className="text-xs text-zinc-500">Created</span>
                  <div className="text-sm inline-flex items-center gap-2">
                    <Clock className="h-4 w-4" /> {createdRel}
                  </div>
                </div>
              </div>

              {/* Editable controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <label className="text-xs text-zinc-500">Update Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TicketStatus)}
                    className="border rounded-md px-2 py-1.5 text-sm"
                  >
                    {(["Open", "In Progress", "Resolved", "Closed"] as const).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2">
                  <label className="text-xs text-zinc-500">Update Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TicketPriority)}
                    className="border rounded-md px-2 py-1.5 text-sm"
                  >
                    {(["Low", "Medium", "High", "Urgent"] as const).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2 sm:col-span-2">
                  <label className="text-xs text-zinc-500">Assign Agent</label>
                  <Select value={assignee} onValueChange={setAssignee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                        {mockAgents.map((a) => (
                          <SelectItem key={a.email} value={a.name}>
                            {a.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 sm:col-span-2">
                  <Button className="bg-purple-600 hover:bg-purple-700" onClick={applyMetaChanges}>
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    className="border-purple-600 text-purple-600 hover:bg-purple-50"
                    onClick={resolveTicket}
                  >
                    Mark as Resolved
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Description</div>
                <p className="text-sm text-zinc-700 leading-relaxed">{ticket.description}</p>
              </div>

              {/* Comments */}
              <div className="space-y-3">
                <div className="text-sm font-medium">Comments ({ticket.comments.length})</div>
                <div className="space-y-3 max-h-64 overflow-auto pr-1">
                  {ticket.comments.map((c) => (
                    <div key={c.id} className="rounded-md border p-3">
                      <div className="text-xs text-zinc-500 mb-1">
                        {c.author.name}
                        {c.author.role ? ` • ${c.author.role}` : ""} • {new Date(c.createdAt).toLocaleString()}
                      </div>
                      <div className="text-sm">{c.message}</div>
                    </div>
                  ))}
                </div>
                <div className="grid gap-2">
                  <Textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a comment..."
                  />
                  <div className="flex justify-end">
                    <Button className="bg-purple-600 hover:bg-purple-700" onClick={addComment}>
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
