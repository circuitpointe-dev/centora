// src/components/users/clients/types.ts

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
  requiredModules: string[];
  pricingTier: PricingTier;
  lastActiveAt: string;
  status: 'onboarding' | 'active' | 'suspended';
  usage: {
    storageGB: number;
    users: number;
    emailAccounts: number;
    projects: number;
    apiCallsThisMonth: number;
  };
  customSettings?: {
    assignedAdmins?: string[];
    domain?: string;
    theme?: string;
  };
}

export type OrganizationType = 'NGO' | 'Donor';
export type PricingTier = 'Tier 1' | 'Tier 2' | 'Tier 3';

export interface ClientActivity {
  id: string;
  clientId: string;
  action: string;
  description: string;
  timestamp: string;
  user?: string;
  report?: string;
  module?: string;
}

export interface ClientFilters {
  status: string;
  organizationType: string;
  pricingTier: string;
}

export const TIER_OPTIONS = [
  { value: 'Tier 1', label: 'Tier 1 - Small Teams', price: '$49/month' },
  { value: 'Tier 2', label: 'Tier 2 - Growing Organizations', price: '$99/month' },
  { value: 'Tier 3', label: 'Tier 3 - Large Enterprises', price: '$199/month' },
];

export const ALL_MODULES = [
  'User Management',
  'Document Management', 
  'Finance Management',
  'Grant Management',
  'HR Management',
  'Procurement',
  'Inventory Management',
  'Analytics & Reporting'
];