// src/components/users/clients/types.ts

export type ClientStatus = 'active' | 'onboarding' | 'suspended';

export type OrganizationType = 'NGO' | 'Donor';

export type PricingTier = 'Tier 1' | 'Tier 2' | 'Tier 3';

export interface Client {
  id: string;
  name: string;
  organizationType: OrganizationType;
  primaryCurrency: string;
  address: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  modules: string[];
  requiredModules?: string[]; // always includes "User Management"
  pricingTier: PricingTier;
  lastActiveAt: string; // ISO
  status: ClientStatus;
  usage: {
    storageGB: number;
    users: number;
    emailAccounts?: number;
    projects?: number;
    apiCallsThisMonth?: number;
  };
  customSettings?: {
    domain?: string;
    theme?: string;
    assignedAdmins?: string[];
  };
}

export interface ClientActivity {
  id: string;
  clientId: string;
  timestamp: string; // ISO
  user: string;
  report: string;
  module: string;
}

export const ALL_MODULES: string[] = [
  'Fundraising',
  'Grants Management',
  'Documents Manager',
  'Program Management',
  'Procurement',
  'Inventory Management',
  'Finance & Control',
  'Learning Management',
  'HR Management',
  'User Management', 
];
