// src/components/users/tenants-subscriptions/mock/invoices.ts

import { InvoiceStatus } from "../types";

export type InvoiceRow = {
  id: string;            // INV-2025-0001
  tenant: string;        // Hope Foundation
  amount: number;        // cents
  issuedAt: string;      // ISO date
  dueAt: string;         // ISO date
  status: InvoiceStatus;
};

const tenants = [
  "Hope Foundation",
  "Apex Donor Group",
  "Green Earth",
  "Future Minds",
  "Bright Path",
  "CareBridge",
  "Ocean Relief",
  "Solar Aid",
  "River Trust",
  "Horizon Network",
];

const statuses: InvoiceStatus[] = ["Paid", "Pending", "Failed", "Overdue"];

function pad(n: number, w = 4) {
  return n.toString().padStart(w, "0");
}

function isoDaysFrom(base: Date, offsetDays: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString();
}

export const invoices: InvoiceRow[] = Array.from({ length: 120 }).map((_, i) => {
  const idx = i + 1;
  const today = new Date();
  const issued = isoDaysFrom(today, -((idx % 60) + 1));
  const due = isoDaysFrom(new Date(issued), 14);
  const amount = 5000 * ((idx % 7) + 5); // arbitrary amounts

  return {
    id: `INV-2025-${pad(idx)}`,
    tenant: tenants[i % tenants.length] + " " + ((i % 9) + 1),
    amount: amount * 100, // cents
    issuedAt: issued,
    dueAt: due,
    status: statuses[i % statuses.length],
  };
});
