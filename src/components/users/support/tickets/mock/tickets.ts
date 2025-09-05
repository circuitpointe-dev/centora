// src/components/support/tickets/mock/tickets.ts

import { Ticket } from "../TicketTypes";

export const mockAgents = [
  { name: "Amara Okoye", email: "amara@projectspecc.com" },
  { name: "Dele Akin", email: "dele@projectspecc.com" },
  { name: "Yemi Alade", email: "yemi@projectspecc.com" },
];

export const mockTickets: Ticket[] = [
  {
    id: "TCK-1024",
    subject: "Unable to Access Dashboard",
    tenantName: "NimbusPay",
    status: "Open",
    priority: "Urgent",
    category: "Access",
    description:
      "We are getting a 403 when trying to access the analytics dashboard for our team members.",
    requester: { name: "Chidi N.", email: "chidi@nimbuspay.io" },
    assignee: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    comments: [
      {
        id: "c1",
        author: { name: "Chidi N.", role: "Tenant Admin" },
        message: "Issue started after we rotated SSO keys.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
    ],
    activity: [
      {
        id: "a1",
        label: "Ticket Created",
        at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        by: "Chidi N.",
        icon: "Ticket",
      },
    ],
  },
  {
    id: "TCK-1025",
    subject: "Billing Mismatch For August",
    tenantName: "QuickMart",
    status: "In Progress",
    priority: "High",
    category: "Billing",
    description: "Invoices do not reflect the applied discount tier.",
    requester: { name: "Sandra I.", email: "sandra@quickmart.africa" },
    assignee: { name: "Amara Okoye", email: "amara@projectspecc.com" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 1d2h ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    comments: [
      {
        id: "c2",
        author: { name: "Amara Okoye", role: "Support" },
        message: "Investigating pricing rules in the new billing engine.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      },
      {
        id: "c3",
        author: { name: "Sandra I.", role: "Tenant Admin" },
        message: "Thanks. We can share logs if needed.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 19).toISOString(),
      },
    ],
  },
  {
    id: "TCK-1026",
    subject: "Feature Request: Export Audit Logs",
    tenantName: "BlueCargo",
    status: "Resolved",
    priority: "Low",
    category: "Other",
    description: "We'd love CSV export from the audit logs screen.",
    requester: { name: "Owusu K.", email: "owusu@bluecargo.io" },
    assignee: { name: "Dele Akin", email: "dele@projectspecc.com" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    comments: [
      {
        id: "c4",
        author: { name: "Dele Akin", role: "Support" },
        message: "Added to roadmap. Temporary workaround via API shared.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      },
    ],
  },
  {
    id: "TCK-1027",
    subject: "Webhook Failures (500)",
    tenantName: "FarmLink",
    status: "Open",
    priority: "High",
    category: "Technical",
    description:
      "Outbound webhooks to our ERP listener started failing intermittently.",
    requester: { name: "Tolani B.", email: "tolani@farmlink.africa" },
    assignee: { name: "Yemi Alade", email: "yemi@projectspecc.com" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    comments: [],
  },
];
