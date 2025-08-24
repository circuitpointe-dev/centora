// src/components/users/announcements/AnnouncementSuccessDialog.tsx

import * as React from "react";
import { Megaphone, CalendarClock, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AUDIENCE_LABEL, Announcement } from "./types";

interface AnnouncementSuccessDialogProps {
  open: boolean;
  type: "sent" | "scheduled";
  announcement: Announcement | null;
  audienceText: string;
  onClose: () => void;
}

export function AnnouncementSuccessDialog({
  open,
  type,
  announcement,
  audienceText,
  onClose,
}: AnnouncementSuccessDialogProps) {
  const title =
    type === "sent" ? "Announcement Sent" : "Announcement Scheduled";

  const when =
    type === "sent" ? announcement?.sentAt : announcement?.scheduledAt;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center text-center gap-4 py-2">
          <div className="relative">
            <Megaphone className="h-12 w-12 text-purple-600" />
            <CheckCircle className="absolute -right-2 -bottom-2 h-6 w-6 text-green-600" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Subject</p>
            <h3 className="text-base font-semibold">
              {announcement?.subject || "—"}
            </h3>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="outline">{audienceText}</Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <CalendarClock className="h-3.5 w-3.5" />
              {when ? new Date(when).toLocaleString() : "Now"}
            </Badge>
          </div>

          <div className="mt-2">
            <Button onClick={onClose}>Done</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
