// src/components/users/announcements/AnnouncementFormDialog.tsx

import * as React from "react";
import { Megaphone, CalendarClock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AudienceSelector } from "./AudienceSelector";
import {
  Announcement,
  AnnouncementStatus,
  AUDIENCE_LABEL,
  AudienceType,
  STATUS_LABEL,
  Tenant,
  formatDateTime,
} from "./types";

type Mode = "create" | "edit";

interface AnnouncementFormDialogProps {
  open: boolean;
  mode: Mode;
  tenants: Tenant[];
  initial?: Partial<Announcement>;
  onClose: () => void;
  onSubmitDraft: (draft: Announcement) => void; // save draft/update
  onSubmitSend: (sent: Announcement) => void; // send now
  onSubmitSchedule: (scheduled: Announcement) => void; // schedule
}

export function AnnouncementFormDialog({
  open,
  mode,
  tenants,
  initial,
  onClose,
  onSubmitDraft,
  onSubmitSend,
  onSubmitSchedule,
}: AnnouncementFormDialogProps) {
  const [subject, setSubject] = React.useState(initial?.subject ?? "");
  const [message, setMessage] = React.useState(initial?.message ?? "");
  const [audienceType, setAudienceType] = React.useState<AudienceType>(
    initial?.audienceType ?? "all"
  );
  const [tenantIds, setTenantIds] = React.useState<string[]>(
    initial?.tenantIds ?? []
  );
  const [scheduledAt, setScheduledAt] = React.useState<string>(
    initial?.scheduledAt
      ? initial.scheduledAt.slice(0, 16)
      : "" // yyyy-MM-ddTHH:mm for datetime-local
  );

  const [previewOpen, setPreviewOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    // reset from new initial each time dialog opens
    setSubject(initial?.subject ?? "");
    setMessage(initial?.message ?? "");
    setAudienceType(initial?.audienceType ?? "all");
    setTenantIds(initial?.tenantIds ?? []);
    setScheduledAt(initial?.scheduledAt ? initial.scheduledAt.slice(0, 16) : "");
  }, [open, initial]);

  const makeBase = (status: AnnouncementStatus): Announcement => {
    const nowIso = new Date().toISOString();
    return {
      id: initial?.id ?? `a_${Math.random().toString(36).slice(2, 9)}`,
      title: subject || "(Untitled)",
      subject: subject || "(Untitled)",
      message,
      status,
      audienceType,
      tenantIds: audienceType === "specific" ? tenantIds : undefined,
      createdAt: initial?.createdAt ?? nowIso,
      scheduledAt:
        status === "scheduled" && scheduledAt
          ? new Date(scheduledAt).toISOString()
          : undefined,
      sentAt: status === "sent" ? nowIso : initial?.sentAt,
    };
  };

  const saveDraft = () => onSubmitDraft(makeBase("draft"));
  const sendNow = () => onSubmitSend(makeBase("sent"));
  const schedule = () => onSubmitSchedule(makeBase("scheduled"));

  const canSend = subject.trim().length > 0 && message.trim().length > 0;
  const canSchedule = canSend && Boolean(scheduledAt);

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold tracking-tight">
              {mode === "create" ? "New Announcement" : "Edit Announcement"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Craft your announcement, choose recipients, then preview before sending."
                : "Update the announcement details, recipients, and schedule as needed."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Megaphone className="h-6 w-6 text-purple-600" />
              <Input
                placeholder="Subject (Title)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Write the announcement message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
              />
            </div>

            <AudienceSelector
              tenants={tenants}
              audienceType={audienceType}
              selectedIds={tenantIds}
              onChangeType={setAudienceType}
              onChangeTenantIds={setTenantIds}
            />

            <div className="space-y-2">
              <Label>Scheduled Publish Date</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="max-w-xs"
                />
                <Badge variant="outline" className="ml-1">
                  <CalendarClock className="mr-1 h-4 w-4" />
                  {scheduledAt ? formatDateTime(new Date(scheduledAt).toISOString()) : "Not Set"}
                </Badge>
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between gap-3">
            <div className="text-xs text-muted-foreground">
              Audience:{" "}
              <span className="font-medium">
                {audienceType === "all"
                  ? AUDIENCE_LABEL.all
                  : `${AUDIENCE_LABEL.specific} (${tenantIds.length})`}
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={saveDraft}>
                Save Draft
              </Button>
              <Button
                variant="outline"
                disabled={!canSchedule}
                onClick={() => setPreviewOpen(true)}
              >
                Preview Schedule
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                disabled={!canSend}
                onClick={() => setPreviewOpen(true)}
              >
                <Send className="mr-2 h-4 w-4" />
                Preview & Send
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={(v) => !v && setPreviewOpen(false)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader className="text-center">
            <DialogTitle className="text-lg font-semibold tracking-tight">
              Preview: {subject || "(Untitled)"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center text-center gap-4 py-2">
            <Megaphone className="h-10 w-10 text-purple-600" />
            <div>
              <p className="text-sm text-muted-foreground">Subject</p>
              <h3 className="text-base font-semibold">{subject || "(Untitled)"}</h3>
            </div>
            <div className="w-full max-w-[36rem] rounded-md border p-4 text-left">
              <p className="whitespace-pre-wrap">{message || "—"}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge variant="outline">
                {audienceType === "all"
                  ? AUDIENCE_LABEL.all
                  : `${AUDIENCE_LABEL.specific}: ${tenantIds.length} selected`}
              </Badge>
              <Badge variant="secondary">{scheduledAt ? "Will Schedule" : "Send Now"}</Badge>
            </div>

            {scheduledAt && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Scheduled:</span>{" "}
                {formatDateTime(new Date(scheduledAt).toISOString())}
              </div>
            )}

            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
              {scheduledAt ? (
                <Button onClick={() => { schedule(); setPreviewOpen(false); onClose(); }}>
                  Confirm Schedule
                </Button>
              ) : (
                <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => { sendNow(); setPreviewOpen(false); onClose(); }}>
                  Send Now
                </Button>
              )}
              <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                Back To Edit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
