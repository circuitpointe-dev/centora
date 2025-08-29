// src/components/users/tenants-subscriptions/mock/tenants.ts

import { BillingStatus, OrgType, PlanTier } from "../types";

export type TenantRow = {
  id: string;
  tenant: string;
  type: OrgType;                  // "NGO" | "Donor"
  plan: PlanTier;                 // "Tier 1" | "Tier 2" | "Tier 3"
  users: { used: number; limit: number };
  storage: { used: number; limit: number }; // in GB
  api: { used: number; limit: number };
  status: BillingStatus;          // "Active" | "Pending Upgrade" | "Suspended"
};

const ORG_NAMES = [
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

const PLANS: PlanTier[] = ["Tier 1", "Tier 2", "Tier 3"];
const TYPES: OrgType[] = ["NGO", "Donor"];
const STATUSES: BillingStatus[] = ["Active", "Pending Upgrade", "Suspended"];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Deterministic-ish limits by plan tier
 */
function limitsForPlan(plan: PlanTier) {
  switch (plan) {
    case "Tier 1":
      return { users: 50, storage: 20, api: 20000 };
    case "Tier 2":
      return { users: 120, storage: 50, api: 50000 };
    case "Tier 3":
      return { users: 300, storage: 100, api: 100000 };
  }
}

/**
 * 120 mock tenants
 */
export const tenants: TenantRow[] = Array.from({ length: 120 }).map((_, i) => {
  const plan = PLANS[i % PLANS.length];
  const { users: userLimit, storage: storageLimit, api: apiLimit } = limitsForPlan(plan);

  const usedUsers = randInt(Math.max(5, Math.floor(userLimit * 0.1)), userLimit);
  const usedStorage = randInt(2, storageLimit);
  const usedApi = randInt(500, apiLimit);

  return {
    id: `t_${i + 1}`,
    tenant: `${ORG_NAMES[i % ORG_NAMES.length]} ${i + 1}`,
    type: TYPES[i % TYPES.length],
    plan,
    users: { used: usedUsers, limit: userLimit },
    storage: { used: usedStorage, limit: storageLimit },
    api: { used: usedApi, limit: apiLimit },
    status: STATUSES[i % STATUSES.length],
  };
});
