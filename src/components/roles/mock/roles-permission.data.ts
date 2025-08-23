// src/components/roles/mock/roles-permission.data.ts

import type { RoleSummary, ModuleWithFeatures, RoleUser, Feature } from '@/types/roles-permission';

export const roles: RoleSummary[] = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Full access to all features',
    totalMembers: 5,
    avatarPreview: ['JD', 'IO', 'MG']
  },
  {
    id: 'contributor',
    name: 'Contributor', 
    description: 'Edit access to assigned features',
    totalMembers: 12,
    avatarPreview: ['AS', 'BN', 'CD']
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'View-only access',
    totalMembers: 8,
    avatarPreview: ['EF', 'GH', 'IJ']
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Customized permissions',
    totalMembers: 3,
    avatarPreview: ['KL', 'MN']
  }
];

export const modules: ModuleWithFeatures[] = [
  {
    id: 'fundraising',
    name: 'Fundraising',
    features: [
      { id: 'fundraising.dashboard', name: 'Dashboard' },
      { id: 'fundraising.donor_management', name: 'Donor Management' },
      { id: 'fundraising.pledges', name: 'Pledges & Commitments' },
      { id: 'fundraising.campaigns', name: 'Campaign Management' }
    ]
  },
  {
    id: 'programmes',
    name: 'Programme Management',
    features: [
      { id: 'programmes.dashboard', name: 'Dashboard' },
      { id: 'programmes.beneficiaries', name: 'Beneficiary Management' },
      { id: 'programmes.monitoring', name: 'Monitoring & Evaluation' }
    ]
  },
  {
    id: 'finance',
    name: 'Finance & Control',
    features: [
      { id: 'finance.dashboard', name: 'Dashboard' },
      { id: 'finance.expenses', name: 'Expense Management' },
      { id: 'finance.reports', name: 'Financial Reports' },
      { id: 'finance.budgets', name: 'Budget Planning' }
    ]
  }
];

// Mock users for different roles and features
const mockUsers: RoleUser[] = [
  { id: 'u1', full_name: 'Jane Doe', email: 'jane@example.org', department: 'Finance', status: 'active' },
  { id: 'u2', full_name: 'Ifeanyi Okafor', email: 'ifeanyi@org.org', department: 'Human Resources', status: 'inactive' },
  { id: 'u3', full_name: 'Mary Grant', email: 'mary@ngo.org', department: 'Programmes', status: 'active' },
  { id: 'u4', full_name: 'Ahmed Hassan', email: 'ahmed@org.org', department: 'Finance', status: 'active' },
  { id: 'u5', full_name: 'Sarah Chen', email: 'sarah@example.org', department: 'Operations', status: 'active' },
  { id: 'u6', full_name: 'David Wilson', email: 'david@ngo.org', department: 'Programmes', status: 'deactivated' },
  { id: 'u7', full_name: 'Lisa Johnson', email: 'lisa@org.org', department: 'Marketing', status: 'active' },
  { id: 'u8', full_name: 'Carlos Rodriguez', email: 'carlos@example.org', department: 'IT', status: 'active' }
];

// Mapping of feature+role to users
export const roleMemberships: Record<string, Record<string, RoleUser[]>> = {
  'fundraising.dashboard': {
    'admin': [mockUsers[0], mockUsers[4]],
    'contributor': [mockUsers[2], mockUsers[6], mockUsers[3]],
    'viewer': [mockUsers[1], mockUsers[7]],
    'custom': [mockUsers[5]]
  },
  'fundraising.donor_management': {
    'admin': [mockUsers[0], mockUsers[4]],
    'contributor': [mockUsers[2], mockUsers[6]],
    'viewer': [mockUsers[1], mockUsers[7], mockUsers[3]],
    'custom': []
  },
  'fundraising.pledges': {
    'admin': [mockUsers[0]],
    'contributor': [mockUsers[2], mockUsers[4]],
    'viewer': [mockUsers[1], mockUsers[3], mockUsers[7]],
    'custom': [mockUsers[5]]
  },
  'fundraising.campaigns': {
    'admin': [mockUsers[0], mockUsers[4]],
    'contributor': [mockUsers[6]],
    'viewer': [mockUsers[1], mockUsers[2], mockUsers[3]],
    'custom': []
  },
  'programmes.dashboard': {
    'admin': [mockUsers[2], mockUsers[0]],
    'contributor': [mockUsers[5], mockUsers[3]],
    'viewer': [mockUsers[1], mockUsers[4], mockUsers[7]],
    'custom': [mockUsers[6]]
  },
  'programmes.beneficiaries': {
    'admin': [mockUsers[2]],
    'contributor': [mockUsers[5], mockUsers[3], mockUsers[0]],
    'viewer': [mockUsers[1], mockUsers[4]],
    'custom': []
  },
  'programmes.monitoring': {
    'admin': [mockUsers[2], mockUsers[0]],
    'contributor': [mockUsers[5]],
    'viewer': [mockUsers[1], mockUsers[3], mockUsers[4], mockUsers[7]],
    'custom': []
  },
  'finance.dashboard': {
    'admin': [mockUsers[0], mockUsers[3]],
    'contributor': [mockUsers[4]],
    'viewer': [mockUsers[1], mockUsers[2], mockUsers[7]],
    'custom': [mockUsers[5]]
  },
  'finance.expenses': {
    'admin': [mockUsers[0], mockUsers[3]],
    'contributor': [mockUsers[4], mockUsers[2]],
    'viewer': [mockUsers[1]],
    'custom': []
  },
  'finance.reports': {
    'admin': [mockUsers[0], mockUsers[3]],
    'contributor': [mockUsers[4]],
    'viewer': [mockUsers[1], mockUsers[2], mockUsers[7], mockUsers[5]],
    'custom': []
  },
  'finance.budgets': {
    'admin': [mockUsers[0]],
    'contributor': [mockUsers[3], mockUsers[4]],
    'viewer': [mockUsers[2], mockUsers[1]],
    'custom': [mockUsers[5]]
  }
};

// Flat user directory for easier access
export const userDirectory = mockUsers;