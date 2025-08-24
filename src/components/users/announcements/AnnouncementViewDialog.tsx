// src/components/users/announcements/AnnouncementViewDialog.tsx

import * as React from "react";
import { Megaphone, Pencil, Send, Archive, Play, Undo2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Announcement, STATUS_LABEL, AUDIENCE_LABEL, formatDateTime } from "./types";
import { StatusPill } from "./StatusPill";

interface AnnouncementViewDialogProps {
  open: boolean;
  announcement: Announcement | null;
  tenantNameResolver?: (ids?: string[]) => string;
  onClose: () => void;
  onEdit: (a: Announcement) => void;
  onUpdateStatus: (id: string, next: Partial<Announcement>) => void;
}

export function AnnouncementViewDialog({
  open,
  announcement,
  tenantNameResolver,
  onClose,
  onEdit,
  onUpdateStatus,
}: AnnouncementViewDialogProps) {
  if (!announcement) return null;

  const status = announcement.status;

  const buttonsByStatus: Record<Announcement["status"], React.ReactNode> = {
    draft: (
      <div className="flex gap-2">
        <Button
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => onEdit(announcement)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="outline" onClick={() => onEdit(announcement)}>
          <Send className="mr-2 h-4 w-4" />
          Preview & Send
        </Button>
      </div>
    ),
    scheduled: (
      <div className="flex gap-2">
        <Button
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() =>
            onUpdateStatus(announcement.id, {
              status: "sent",
              sentAt: new Date().toISOString(),
            })
          }
        >
          <Play className="mr-2 h-4 w-4" />
          Send Now
        </Button>
        <Button variant="outline" onClick={() => onEdit(announcement)}>
          <Pencil className="mr-2 h-4 w-4" />
          Reschedule / Edit
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            onUpdateStatus(announcement.id, { status: "draft", scheduledAt: undefined })
          }
        >
          <Undo2 className="mr-2 h-4 w-4" />
          Cancel Schedule
        </Button>
      </div>
    ),
    sent: (
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => onUpdateStatus(announcement.id, { status: "archived" })}
        >
          <Archive className="mr-2 h-4 w-4" />
          Archive
        </Button>
      </div>
    ),
    archived: (
      <div className="flex gap-2">
        <Button
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => onUpdateStatus(announcement.id, { status: "draft" })}
        >
          <Undo2 className="mr-2 h-4 w-4" />
          Restore To Draft
        </Button>
      </div>
    ),
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            {announcement.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center text-center gap-4 py-2">
          <Megaphone className="h-10 w-10 text-purple-600" />
          <div>
            <p className="text-sm text-muted-foreground">Subject</p>
            <h3 className="text-base font-semibold">{announcement.subject}</h3>
          </div>
          <div className="w-full max-w-[36rem] rounded-md border p-4 text-left">
            <p className="whitespace-pre-wrap">{announcement.message}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <StatusPill status={status} />
            <Badge variant="outline">
              {announcement.audienceType === "all"
                ? AUDIENCE_LABEL.all
                : tenantNameResolver?.(announcement.tenantIds) ||
                  AUDIENCE_LABEL.specific}
            </Badge>
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            <div>
              <span className="font-medium">Created:</span>{" "}
              {formatDateTime(announcement.createdAt)}
            </div>
            {announcement.scheduledAt && (
              <div>
                <span className="font-medium">Scheduled:</span>{" "}
                {formatDateTime(announcement.scheduledAt)}
              </div>
            )}
            {announcement.sentAt && (
              <div>
                <span className="font-medium">Sent:</span>{" "}
                {formatDateTime(announcement.sentAt)}
              </div>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            {buttonsByStatus[status]}
            <Button variant="ghost" onClick={onClose}>
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
