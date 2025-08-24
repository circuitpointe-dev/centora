// src/components/users/subscriptions/mock/subscriptions-data.ts

export type OrgModule = { id: string; name: string; active: boolean };

export type Plan = {
  tier: 1 | 2 | 3;
  tierLabel: string;
  billingCycle: "monthly" | "yearly";
  renewalDate: string; // ISO
  prices: {
    monthlyPerModuleUSD: number;
    yearlyPerModuleUSD: number;
  };
  card: {
    cardholder: string;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    updatedAt: string;
  };
};

// List all Centora modules (mock). Backend would normally provide this and which are active.
export const allModules: OrgModule[] = [
  { id: "finance", name: "Finance & Control", active: true },
  { id: "grants", name: "Grant Management", active: true },
  { id: "programs", name: "Program Management", active: true },
  { id: "inventory", name: "Inventory Management", active: true },
  { id: "hr", name: "HR Management", active: true },
  { id: "documents", name: "Document Management", active: true },
  // Add more as Centora grows…
];

export const currentPlan: Plan = {
  tier: 1,
  tierLabel: "Tier 1 - Small Teams",
  billingCycle: "monthly",
  renewalDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
  prices: {
    monthlyPerModuleUSD: 49, // mock price
    yearlyPerModuleUSD: 499, // mock price (save ~2 months)
  },
  card: {
    cardholder: "Jane Doe",
    brand: "Visa",
    last4: "4242",
    expMonth: 8,
    expYear: 2030,
    updatedAt: new Date().toISOString(),
  },
};
