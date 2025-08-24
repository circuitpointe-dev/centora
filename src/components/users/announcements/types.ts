// src/components/users/announcements/types.ts

import { ReactNode } from "react";

export type AnnouncementStatus = "draft" | "scheduled" | "sent" | "archived";
export type AudienceType = "all" | "specific";

export interface Tenant {
  id: string;
  name: string; // NGOs or Donor organizations
  type: "NGO" | "Donor";
}

export interface Announcement {
  id: string;
  title: string; // shown in the table (same as subject)
  subject: string;
  message: string;
  status: AnnouncementStatus;
  audienceType: AudienceType;
  tenantIds?: string[]; // if audienceType === 'specific'
  createdAt: string; // ISO
  scheduledAt?: string; // ISO (if scheduled)
  sentAt?: string; // ISO (if sent)
}

export const STATUS_LABEL: Record<AnnouncementStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  sent: "Sent",
  archived: "Archived",
};

export const AUDIENCE_LABEL: Record<AudienceType, string> = {
  all: "All Tenants",
  specific: "Specific Tenant(s)",
};

export function formatDateTime(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export type Maybe<T> = T | null | undefined;

export type Children = { children?: ReactNode };
