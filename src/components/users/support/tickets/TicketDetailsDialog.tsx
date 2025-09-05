// src/components/users/support/tickets/TicketDetailsDialog.tsx

import { useEffect, useMemo, useRef, useState } from "react";
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
import { Clock, Flag, Mail, User, Paperclip, Download, Trash2, FileImage } from "lucide-react";
import { mockAgents } from "./mock/tickets";

const UNASSIGNED = "__UNASSIGNED__"; // non-empty sentinel for Radix Select

// Local attachment type so you DON'T have to change global Ticket types
type TicketAttachment = {
  id: string;
  name: string;
  size: number; // bytes
  type: string;
  url?: string; // object URL or remote URL
  uploadedAt: string; // ISO
  by: string;
};
type TicketWithFiles = Ticket & { attachments?: TicketAttachment[] };

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
  const t = ticket as TicketWithFiles | null;

  const [assignee, setAssignee] = useState<string>(UNASSIGNED);
  const [status, setStatus] = useState<TicketStatus>("Open");
  const [priority, setPriority] = useState<TicketPriority>("Medium");
  const [message, setMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!t) return;
    setAssignee(t.assignee?.name ?? UNASSIGNED);
    setStatus(t.status);
    setPriority(t.priority);
    setMessage("");
  }, [t, open]);

  const createdRel = useMemo(() => formatRelative(t?.createdAt), [t]);
  const attachments: TicketAttachment[] = t?.attachments ?? [];

  const addComment = () => {
    if (!t || !message.trim()) return;
    const newComment: TicketComment = {
      id: Math.random().toString(36).slice(2),
      author: { name: "Support Agent", role: "Staff" },
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };
    onUpdate({ ...(t as Ticket), comments: [...t.comments, newComment], updatedAt: new Date().toISOString() });
    setMessage("");
  };

  const applyMetaChanges = () => {
    if (!t) return;
    onUpdate({
      ...(t as Ticket),
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
    if (!t) return;
    onUpdate({ ...(t as Ticket), status: "Resolved", updatedAt: new Date().toISOString() });
  };

  // --- Attachments ---
  const handleFiles = (files: FileList) => {
    if (!t || files.length === 0) return;
    const now = new Date().toISOString();
    const newItems: TicketAttachment[] = Array.from(files).map((f) => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      size: f.size,
      type: f.type || "application/octet-stream",
      url: URL.createObjectURL(f),
      uploadedAt: now,
      by: "Support Agent",
    }));
    onUpdate({ ...(t as TicketWithFiles), attachments: [...attachments, ...newItems], updatedAt: now } as Ticket);
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeAttachment = (id: string) => {
    if (!t) return;
    const att = attachments.find((a) => a.id === id);
    if (att?.url?.startsWith("blob:")) URL.revokeObjectURL(att.url);
    const next = attachments.filter((a) => a.id !== id);
    onUpdate({ ...(t as TicketWithFiles), attachments: next, updatedAt: new Date().toISOString() } as Ticket);
  };

  const prettySize = (n: number) => {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / (1024 * 1024)).toFixed(1)} MB`;
    };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[820px] p-0" aria-describedby="ticket-dialog-desc">
        <DialogHeader className="p-6 pb-3">
          <DialogTitle>Ticket Details</DialogTitle>
          <DialogDescription id="ticket-dialog-desc" className="sr-only">
            View and manage a support ticket
          </DialogDescription>
        </DialogHeader>

        {!t ? null : (
          <div className="px-6 pb-6">
            {/* Header */}
            <div className="space-y-1 mb-4">
              <div className="text-base font-semibold">{t.subject}</div>
              <div className="text-xs text-zinc-500">
                {t.tenantName} • #{t.id}
              </div>
            </div>

            {/* Body */}
            <div className="max-h-[70vh] overflow-auto pr-1 space-y-6">
              {/* Meta */}
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
                    <Mail className="h-4 w-4" /> {t.requester.name} ({t.requester.email})
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
                <p className="text-sm text-zinc-700 leading-relaxed">{t.description}</p>
              </div>

              {/* Attachments */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Attachments ({attachments.length})</div>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    />
                    <Button
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="h-4 w-4 mr-2" /> Attach Files
                    </Button>
                  </div>
                </div>

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                  className="border border-dashed rounded-lg p-4 text-sm text-zinc-600"
                >
                  Drag & drop files here, or click “Attach Files”.
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((a) => {
                      const isImg = (a.type || "").startsWith("image/");
                      return (
                        <div
                          key={a.id}
                          className="flex items-center justify-between gap-3 rounded-md border p-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {isImg ? (
                              <img
                                src={a.url}
                                alt={a.name}
                                className="h-10 w-10 rounded object-cover border"
                              />
                            ) : (
                              <FileImage className="h-10 w-10 text-zinc-400" />
                            )}
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate">{a.name}</div>
                              <div className="text-xs text-zinc-500">
                                {prettySize(a.size)} • {new Date(a.uploadedAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {a.url && (
                              <a
                                href={a.url}
                                download={a.name}
                                className="inline-flex items-center px-2 py-1 border rounded-md text-xs"
                              >
                                <Download className="h-3.5 w-3.5 mr-1" /> Download
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => removeAttachment(a.id)}
                              className="inline-flex items-center px-2 py-1 border rounded-md text-xs hover:bg-zinc-50"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Comments */}
              <div className="space-y-3">
                <div className="text-sm font-medium">Comments ({t.comments.length})</div>
                <div className="space-y-3 max-h-64 overflow-auto pr-1">
                  {t.comments.map((c) => (
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
