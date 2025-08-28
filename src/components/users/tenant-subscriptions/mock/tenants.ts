// src/components/users/tenants-subscriptions/mock/tenants.ts

import { BillingStatus, OrgType, PlanTier } from "../types";

export type TenantRow = {
  id: string;
  tenant: string;
  type: OrgType;
  plan: PlanTier;
  users: { used: number; limit: number };
  storage: { used: number; limit: number }; // GB
  api: { used: number; limit: number };
  status: BillingStatus;
};

const names = [
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

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const PLANS: PlanTier[] = ["Tier 1", "Tier 2", "Tier 3"];
const TYPES: OrgType[] = ["NGO", "Donor"];
const STATUS: BillingStatus[] = ["Active", "Pending Upgrade", "Suspended"];

export const tenants: TenantRow[] = Array.from({ length: 120 }).map((_, i) => {
  const name = names[i % names.length];
  const limitUsers = [50, 120, 300][i % 3];
  const usedUsers = rand(Math.max(5, Math.floor(limitUsers * 0.1)), limitUsers);
  const limitStorage = [20, 50, 100][i % 3];
  const usedStorage = rand(2, limitStorage);
  const limitApi = [20000, 50000, 100000][i % 3];
  const usedApi = rand(500, limitApi);

  return {
    id: `t_${i + 1}`,
    tenant: `${name} ${i + 1}`,
    type: TYPES[i % TYPES.length],
    plan: PLANS[i % PLANS.length],
    users: { used: usedUsers, limit: limitUsers },
    storage: { used: usedStorage, limit: limitStorage },
    api: { used: usedApi, limit: limitApi },
    status: STATUS[i % STATUS.length],
  };
});
