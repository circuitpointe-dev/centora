// src/components/support/tickets/TicketTypes.ts

export type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed";
export type TicketPriority = "Low" | "Medium" | "High" | "Urgent";

export type TicketComment = {
  id: string;
  author: { name: string; role?: string; avatarUrl?: string };
  message: string;
  createdAt: string; // ISO
  internal?: boolean;
};

export type TicketActivity = {
  id: string;
  label: string;
  at: string; // ISO
  by?: string;
  icon?: string; // lucide name
};

export type Ticket = {
  id: string;
  subject: string;
  tenantName: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  description: string;
  requester: { name: string; email: string };
  assignee?: { name: string; email: string } | null;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  comments: TicketComment[];
  activity?: TicketActivity[];
};
