// src/components/users/requests/mock/role-requests-data.ts
// Mock data for role requests (UI-only; no backend)

export type RoleRequest = {
  id: string;
  full_name: string;
  email: string;
  requested_role_name: string;
  requested_modules: string[]; // module ids (match roles-permission.data modules)
  message: string;
  status: "pending" | "approved" | "declined";
  createdAt: string; // ISO
};

// a few seeded examples; tweak as you like
export const roleRequests: RoleRequest[] = [
  {
    id: "req_001",
    full_name: "Jane Doe",
    email: "jane@organization.org",
    requested_role_name: "Field Auditor",
    requested_modules: ["finance", "fundraising"],
    message:
      "Auditors should have read-only access to all finance reports and donor transactions. They should not edit or export sensitive data.",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h ago
  },
  {
    id: "req_002",
    full_name: "Tunde Okoro",
    email: "tunde@organization.org",
    requested_role_name: "Regional Manager (West)",
    requested_modules: ["programs", "fundraising"],
    message:
      "Managers need to approve pledges and review beneficiary updates for their region.",
    status: "approved",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 26h ago
  },
  {
    id: "req_003",
    full_name: "Amaka Eze",
    email: "amaka@organization.org",
    requested_role_name: "Data Reviewer",
    requested_modules: ["programs"],
    message:
      "Review only; no edits. Should be able to comment on beneficiary records.",
    status: "declined",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
  },
];
