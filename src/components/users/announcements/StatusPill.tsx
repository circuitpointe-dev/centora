// src/components/users/announcements/StatusPill.tsx

import * as React from "react";
import { AnnouncementStatus, STATUS_LABEL } from "./types";

const COLORS: Record<AnnouncementStatus, string> = {
  draft:
    "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200",
  scheduled:
    "bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200",
  sent:
    "bg-green-100 text-green-800 ring-1 ring-inset ring-green-200",
  archived:
    "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
};

export function StatusPill({ status }: { status: AnnouncementStatus }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        COLORS[status],
      ].join(" ")}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {STATUS_LABEL[status]}
    </span>
  );
}
