// src/components/users/audit/mock/auditLogs.ts

import { AuditLog } from "../types";

const NAMES = [
  "Darlene Robertson",
  "David Ayomide",
  "Leslie Alexander",
  "Courtney Henry",
  "Marvin McKinney",
  "Brooklyn Simmons",
];

const ORGS = ["Acme Corp", "Beta Inc", "Circuit Pointe", "Globex", "Initech"];
const MODULES = ["Grants", "Program Management", "Finance", "HR", "CRM"];
const IPS = ["102.88.51.3", "10.20.55.17", "172.16.0.22", "54.201.13.99"];

const EVENTS = {
  Activity: ["Budget plan", "Grant timeline", "Set target progress", "Note added"],
  Login: ["Successful login", "Failed login", "MFA challenged"],
  CRUD: ["Created record", "Updated record", "Deleted record"],
  Roles: ["Role assigned", "Role revoked", "Permission matrix changed"],
  Export: ["CSV export", "PDF export", "Bulk report export"],
};

function rand<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const MOCK_AUDIT_LOGS: AuditLog[] = Array.from({ length: 120 }).map(
  (_, i) => {
    const categoryKeys = Object.keys(EVENTS) as (keyof typeof EVENTS)[];
    const cat = rand(categoryKeys);
    const event = rand(EVENTS[cat]);

    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 20));
    date.setHours(9 + Math.floor(Math.random() * 9), Math.floor(Math.random() * 60));

    return {
      id: `log_${i + 1}`,
      timestamp: date.toISOString(),
      user: { name: rand(NAMES), role: "Product Manager" },
      organization: rand(ORGS),
      event,
      module: rand(MODULES),
      ip: rand(IPS),
      category:
        cat === "Activity"
          ? "Activity"
          : cat === "Login"
          ? "Login"
          : cat === "CRUD"
          ? "CRUD"
          : cat === "Roles"
          ? "Roles"
          : "Export",
    };
  }
);
