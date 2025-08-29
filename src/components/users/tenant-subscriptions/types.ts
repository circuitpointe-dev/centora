// src/components/users/tenants-subscriptions/types.ts

export type BillingStatus = "Active" | "Pending Upgrade" | "Suspended";
export type OrgType = "NGO" | "Donor";
export type PlanTier = "Tier 1" | "Tier 2" | "Tier 3";
export type InvoiceStatus = "Paid" | "Pending" | "Failed" | "Overdue";

export type PlanBillingCycle = "monthly" | "yearly";

export interface BillingFilters {
  search: string;
  status: BillingStatus | "";
  plan: PlanTier | "";
  type: OrgType | "";
}

export interface InvoiceFilters {
  search: string;
  status: InvoiceStatus | "";
}

export interface PlanModel {
  id: string;
  tier: string;            // e.g. "Tier - 1"
  description: string;
  storageGb: number;
  apiCalls: number;
  priceMonthly: number;    // USD
  priceYearly: number;     // USD
  subscribersCount: number;
}
