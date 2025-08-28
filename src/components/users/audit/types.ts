// src/components/users/audit/types.ts

export type AlertActionType =
  | "Permission Change"
  | "Failed Login Attempts"
  | "NGO Deletion"
  | "Role Update"
  | "Data Export"
  | "CRUD Event";

export type AlertMethod = "Email" | "Email + Banner" | "Slack Alert" | "Webhook";

export type AuditRule = {
  id: string;
  actionType: AlertActionType;
  threshold: string; // human string for now (e.g., "> 5 in 1 hour")
  alertMethod: AlertMethod;
  active: boolean;
  selected?: boolean; // UI only
};

export type AuditLog = {
  id: string;
  timestamp: string; // ISO for mock simplicity
  user: { name: string; role?: string };
  organization: string;
  event: string;
  module?: string;
  ip?: string;
  category: "Activity" | "Login" | "CRUD" | "Roles" | "Export";
};

export type AuditFilterState = {
  q: string;
  category: AuditLog["category"] | "All";
  users: string[]; // names
  organizations: string[]; // org names
  actions: string[]; // event keywords
  dateFrom?: string;
  dateTo?: string;
};
