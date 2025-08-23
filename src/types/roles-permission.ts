// src/types/roles-permission.ts

export type UserStatus = 'active' | 'inactive' | 'deactivated';

export interface RoleSummary {
  id: string;            // e.g., 'admin' | 'contributor' | 'viewer' | 'custom'
  name: string;          // 'Admin'
  description: string;   // short hint for the card
  totalMembers?: number;
  avatarPreview?: string[];
}

export interface RoleUser {
  id: string;
  full_name: string;
  email: string;
  department: string;
  status: UserStatus;
  avatarUrl?: string;    // or initial fallback
}

export interface Feature {
  id: string;            // e.g., 'fundraising.dashboard'
  name: string;          // 'Dashboard'
}

export interface ModuleWithFeatures {
  id: string;            // e.g., 'fundraising'
  name: string;          // 'Fundraising'
  features: Feature[];
}