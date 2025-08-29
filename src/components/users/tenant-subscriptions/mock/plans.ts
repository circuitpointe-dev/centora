// src/components/users/tenants-subscriptions/mock/plans.ts

import { PlanModel, InvoiceStatus } from "../types";

/** -----------------------
 *  Plans (mock catalog)
 *  ----------------------*/
export const PLANS: PlanModel[] = [
  {
    id: "plan_t1",
    tier: "Tier - 1",
    description: "Basic plan for small NGOs",
    storageGb: 1,
    apiCalls: 2000,
    priceMonthly: 49,
    priceYearly: 499,
    subscribersCount: 18,
  },
  {
    id: "plan_t2",
    tier: "Tier - 2",
    description: "Recommended for growing organizations",
    storageGb: 10,
    apiCalls: 10000,
    priceMonthly: 149,
    priceYearly: 1490,
    subscribersCount: 25,
  },
  {
    id: "plan_t3",
    tier: "Tier - 3",
    description: "For large organizations with higher limits",
    storageGb: 50,
    apiCalls: 50000,
    priceMonthly: 349,
    priceYearly: 3490,
    subscribersCount: 11,
  },
];

/** -----------------------
 *  Subscribers per plan (mock)
 *  ----------------------*/
type SubscriberRow = {
  id: string;
  tenant: string;
  users: number;
  status: "Active" | "Pending" | "Inactive";
};

const SUBSCRIBERS: Record<string, SubscriberRow[]> = {
  plan_t1: Array.from({ length: 18 }).map((_, i) => ({
    id: `t1_s_${i + 1}`,
    tenant: `Hope Foundation ${i + 1}`,
    users: 10 + (i % 7),
    status: i % 6 === 0 ? "Pending" : "Active",
  })),
  plan_t2: Array.from({ length: 25 }).map((_, i) => ({
    id: `t2_s_${i + 1}`,
    tenant: `Apex Donor Group ${i + 1}`,
    users: 20 + (i % 9),
    status: i % 8 === 0 ? "Inactive" : "Active",
  })),
  plan_t3: Array.from({ length: 11 }).map((_, i) => ({
    id: `t3_s_${i + 1}`,
    tenant: `Green Earth ${i + 1}`,
    users: 35 + (i % 5),
    status: "Active",
  })),
};

export function getSubscribersForPlan(planId: string) {
  return SUBSCRIBERS[planId] ?? [];
}

/** -----------------------
 *  Invoices per plan (mock)
 *  ----------------------*/
type PlanInvoiceRow = {
  id: string;       // INV-2025-0001
  tenant: string;
  amount: number;   // cents
  issuedAt: string; // ISO date
  dueAt: string;    // ISO date
  status: InvoiceStatus;
};

const TENANTS = [
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

function pad(n: number, w = 4) {
  return n.toString().padStart(w, "0");
}
function isoDaysFrom(base: Date, offset: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + offset);
  return d.toISOString();
}

const STATUS: InvoiceStatus[] = ["Paid", "Pending", "Failed", "Overdue"];

const PLAN_INVOICES: Record<string, PlanInvoiceRow[]> = {};
PLANS.forEach((p, pIdx) => {
  PLAN_INVOICES[p.id] = Array.from({ length: 32 }).map((_, i) => {
    const idx = pIdx * 100 + i + 1;
    const issued = isoDaysFrom(new Date(), -((i % 60) + 1));
    const due = isoDaysFrom(new Date(issued), 14);
    const amountUsd = [49, 149, 349][pIdx % 3];
    return {
      id: `INV-2025-${pad(idx)}`,
      tenant: `${TENANTS[i % TENANTS.length]} ${((i % 9) + 1)}`,
      amount: amountUsd * 100,
      issuedAt: issued,
      dueAt: due,
      status: STATUS[i % STATUS.length],
    };
  });
});

export function getInvoicesForPlan(planId: string) {
  return PLAN_INVOICES[planId] ?? [];
}
