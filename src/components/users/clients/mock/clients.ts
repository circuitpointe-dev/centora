// src/components/users/clients/mock/clients.ts

import { Client, ClientActivity, ALL_MODULES } from '../types';

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'c_001',
    name: 'Safe Shelters International',
    organizationType: 'NGO',
    primaryCurrency: 'USD',
    address: '12 Hope Street, Denver, CO',
    contactName: 'Jane Doe',
    contactEmail: 'admin@safeshelters.org',
    contactPhone: '+1 (303) 555-0112',
    modules: ['User Management', 'Grant Management', 'Program Management', 'Document Management'],
    requiredModules: ['User Management'],
    pricingTier: 'Tier 2',
    lastActiveAt: new Date().toISOString(),
    status: 'active',
    usage: { storageGB: 4.8, users: 18 },
    customSettings: {
      domain: 'safeshelters.org',
      theme: 'Default',
      assignedAdmins: ['jane.doe@safeshelters.org', 'david.doe@safeshelters.org'],
    },
  },
  {
    id: 'c_002',
    name: 'HopeWorks Foundation',
    organizationType: 'NGO',
    primaryCurrency: 'NGN',
    address: '23 Unity Ave, Abuja',
    contactName: 'Ifeanyi U.',
    contactEmail: 'admin@hopeworks.africa',
    contactPhone: '+234 803 555 8899',
    modules: ['User Management', 'Finance & Control', 'HR Management'],
    requiredModules: ['User Management'],
    pricingTier: 'Tier 1',
    lastActiveAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'onboarding',
    usage: { storageGB: 1.2, users: 5 },
  },
  {
    id: 'c_003',
    name: 'OpenHands Donor Circle',
    organizationType: 'Donor',
    primaryCurrency: 'EUR',
    address: '19 Charity Road, Berlin',
    contactName: 'Anna K.',
    contactEmail: 'ops@openhands.eu',
    contactPhone: '+49 30 123456',
    modules: ['User Management', 'Donor Relations', 'Document Management'],
    requiredModules: ['User Management'],
    pricingTier: 'Tier 3',
    lastActiveAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'suspended',
    usage: { storageGB: 0.6, users: 3 },
  },
];

export const MOCK_ACTIVITIES: ClientActivity[] = Array.from({ length: 42 }).map((_, i) => ({
  id: `a_${i + 1}`,
  clientId: i % 2 === 0 ? 'c_001' : 'c_002',
  timestamp: new Date(Date.now() - i * 3600_000).toISOString(),
  user: ['Darlene Robertson', 'Wade Warren', 'Jane Cooper'][i % 3],
  report: ['Set target progress', 'Budget plan', 'Grant timeline'][i % 3],
  module: ['Grants', 'Program Mgmt', 'Finance'][i % 3],
}));

export const MODULE_OPTIONS = ALL_MODULES;
export const TIER_OPTIONS = ['Tier 1', 'Tier 2', 'Tier 3'] as const;
