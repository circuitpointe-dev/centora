// src/components/users/super-admin/types.ts
export type SuperAdminRole = "System Admin" | "Audit Manager" | "Support Agent" | "Billing Admin";

export type SuperAdminUser = {
  id: string;
  fullName: string;
  email: string;
  role: SuperAdminRole;
  lastLoginAt: string; // ISO
  status: "active" | "suspended" | "pending";
};

// --- Audit types (new) ---
export type AuditAction =
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_SUSPENDED"
  | "USER_ACTIVATED"
  | "PASSWORD_RESET_SENT"
  | "INVITE_SENT"
  | "LOGIN"
  | "ROLE_CHANGED"
  | "STATUS_CHANGED";

export type AuditLog = {
  id: string;
  at: string; // ISO datetime
  action: AuditAction;
  actorId?: string;
  actorName: string;
  actorEmail: string;
  targetUserId?: string;
  targetUserName?: string;
  targetUserEmail?: string;
  ip?: string;
  metadata?: Record<string, any>;
};
