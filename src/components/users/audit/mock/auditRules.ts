// src/components/users/audit/mock/auditRules.ts

import { AuditRule } from "../types";

export const MOCK_AUDIT_RULES: AuditRule[] = [
  {
    id: "r1",
    actionType: "Permission Change",
    threshold: "Any",
    alertMethod: "Email",
    active: true,
  },
  {
    id: "r2",
    actionType: "Failed Login Attempts",
    threshold: "> 5 in 1 hour",
    alertMethod: "Email + Banner",
    active: false,
  },
  {
    id: "r3",
    actionType: "NGO Deletion",
    threshold: "Any",
    alertMethod: "Slack Alert",
    active: true,
  },
  {
    id: "r4",
    actionType: "Data Export",
    threshold: "Any",
    alertMethod: "Email",
    active: true,
  },
];
