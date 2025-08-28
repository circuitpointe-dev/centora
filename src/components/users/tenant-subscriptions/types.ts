// src/components/users/tenants-subscriptions/types.ts

export type BillingStatus = "Active" | "Pending Upgrade" | "Suspended";
export type OrgType = "NGO" | "Donor";
export type PlanTier = "Tier 1" | "Tier 2" | "Tier 3";

export interface BillingFilters {
  search: string;
  status: BillingStatus | "";
  plan: PlanTier | "";
  type: OrgType | "";
}
