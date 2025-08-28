// src/components/users/tenant-subscriptions/mock/billings.ts
export type BillingRow = {
  id: string;
  tenant: string;
  type: "NGO" | "Donor";
  plan: "Tier 1" | "Tier 2" | "Tier 3";
  users: { current: number; max: number };
  storage: { current: string; max: string }; // e.g. "4GB"
  api: { current: number; max: number };
  status: "Active" | "Pending Upgrade" | "Suspended" | "Trial";
};

export const BILLING_ROWS: BillingRow[] = [
  {
    id: "tnt-101",
    tenant: "AidConnect Foundation",
    type: "NGO",
    plan: "Tier 2",
    users: { current: 38, max: 75 },
    storage: { current: "8GB", max: "100GB" },
    api: { current: 18500, max: 100000 },
    status: "Active",
  },
  {
    id: "tnt-102",
    tenant: "Global Relief Trust",
    type: "Donor",
    plan: "Tier 3",
    users: { current: 10, max: 30 },
    storage: { current: "1GB", max: "50GB" },
    api: { current: 5400, max: 50000 },
    status: "Active",
  },
  {
    id: "tnt-103",
    tenant: "Clean Water Initiative",
    type: "NGO",
    plan: "Tier 1",
    users: { current: 12, max: 20 },
    storage: { current: "2GB", max: "20GB" },
    api: { current: 3000, max: 20000 },
    status: "Trial",
  },
  {
    id: "tnt-104",
    tenant: "HopeWorks International",
    type: "Donor",
    plan: "Tier 2",
    users: { current: 24, max: 50 },
    storage: { current: "6GB", max: "100GB" },
    api: { current: 22100, max: 100000 },
    status: "Pending Upgrade",
  },
  {
    id: "tnt-105",
    tenant: "Healthcare Without Borders",
    type: "NGO",
    plan: "Tier 3",
    users: { current: 120, max: 150 },
    storage: { current: "60GB", max: "500GB" },
    api: { current: 220000, max: 500000 },
    status: "Active",
  },
  {
    id: "tnt-106",
    tenant: "Education Forward Fund",
    type: "Donor",
    plan: "Tier 1",
    users: { current: 8, max: 15 },
    storage: { current: "1GB", max: "20GB" },
    api: { current: 1200, max: 20000 },
    status: "Suspended",
  },
  {
    id: "tnt-107",
    tenant: "Green Earth Alliance",
    type: "NGO",
    plan: "Tier 2",
    users: { current: 55, max: 80 },
    storage: { current: "12GB", max: "200GB" },
    api: { current: 45000, max: 200000 },
    status: "Active",
  },
  {
    id: "tnt-108",
    tenant: "United Cities Partnership",
    type: "Donor",
    plan: "Tier 3",
    users: { current: 200, max: 250 },
    storage: { current: "150GB", max: "1TB" },
    api: { current: 900000, max: 1000000 },
    status: "Active",
  },
];
