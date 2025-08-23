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
      { id: 'fundraising.opportunity_tracking', name: 'Opportunity Tracking' },
      { id: 'fundraising.proposal_management', name: 'Proposal Management' },
      { id: 'fundraising.analytics', name: 'Analytics' }
    ]
  },
  {
    id: 'grants',
    name: 'Grants Management',
    features: [
      { id: 'grants.dashboard', name: 'Dashboard' },
      { id: 'grants.grants_manager', name: 'Grants Manager' },
      { id: 'grants.total_grants', name: 'Total Grants' },
      { id: 'grants.active_grants', name: 'Active Grants' },
      { id: 'grants.pending_grants', name: 'Pending Grants' },
      { id: 'grants.grantee_submissions', name: 'Grantee Submissions' }
    ]
  },
  {
    id: 'documents',
    name: 'Document Manager',
    features: [
      { id: 'documents.dashboard', name: 'Dashboard' },
      { id: 'documents.documents', name: 'Documents' },
      { id: 'documents.e_signature', name: 'E-Signature' },
      { id: 'documents.compliance', name: 'Compliance' },
      { id: 'documents.templates', name: 'Templates' }
    ]
  },
  {
    id: 'programme',
    name: 'Programme Management',
    features: [
      { id: 'programme.dashboard', name: 'Dashboard' },
      { id: 'programme.projects', name: 'Projects' },
      { id: 'programme.products', name: 'Products' },
      { id: 'programme.me_framework', name: 'M&E Framework' },
      { id: 'programme.collaboration_knowledge', name: 'Collaboration & Knowledge Hub' }
    ]
  },
  {
    id: 'procurement',
    name: 'Procurement',
    features: [
      { id: 'procurement.dashboard', name: 'Dashboard' },
      { id: 'procurement.purchase_orders', name: 'Purchase Orders' },
      { id: 'procurement.vendor_management', name: 'Vendor Management' },
      { id: 'procurement.analytics', name: 'Analytics' }
    ]
  },
  {
    id: 'inventory',
    name: 'Inventory Management',
    features: [
      { id: 'inventory.dashboard', name: 'Dashboard' },
      { id: 'inventory.stock_management', name: 'Stock Management' },
      { id: 'inventory.warehouse_management', name: 'Warehouse Management' },
      { id: 'inventory.analytics', name: 'Analytics' }
    ]
  },
  {
    id: 'finance',
    name: 'Finance & Control',
    features: [
      { id: 'finance.dashboard', name: 'Dashboard' },
      { id: 'finance.accounting', name: 'Accounting' },
      { id: 'finance.budgeting', name: 'Budgeting' },
      { id: 'finance.financial_reporting', name: 'Financial Reporting' }
    ]
  },
  {
    id: 'learning',
    name: 'Learning Management',
    features: [
      { id: 'learning.dashboard', name: 'Dashboard' },
      { id: 'learning.course_management', name: 'Course Management' },
      { id: 'learning.training_records', name: 'Training Records' },
      { id: 'learning.analytics', name: 'Analytics' }
    ]
  },
  {
    id: 'hr',
    name: 'HR Management',
    features: [
      { id: 'hr.dashboard', name: 'Dashboard' },
      { id: 'hr.employee_management', name: 'Employee Management' },
      { id: 'hr.payroll', name: 'Payroll' },
      { id: 'hr.analytics', name: 'Analytics' }
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
  // Fundraising
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
  'fundraising.opportunity_tracking': {
    'admin': [mockUsers[0]],
    'contributor': [mockUsers[2], mockUsers[4]],
    'viewer': [mockUsers[1], mockUsers[3], mockUsers[7]],
    'custom': [mockUsers[5]]
  },
  'fundraising.proposal_management': {
    'admin': [mockUsers[0], mockUsers[4]],
    'contributor': [mockUsers[6]],
    'viewer': [mockUsers[1], mockUsers[2], mockUsers[3]],
    'custom': []
  },
  'fundraising.analytics': {
    'admin': [mockUsers[0], mockUsers[4]],
    'contributor': [mockUsers[2]],
    'viewer': [mockUsers[1], mockUsers[3], mockUsers[7]],
    'custom': [mockUsers[5]]
  },
  
  // Grants Management
  'grants.dashboard': {
    'admin': [mockUsers[0], mockUsers[3]],
    'contributor': [mockUsers[2], mockUsers[4]],
    'viewer': [mockUsers[1], mockUsers[7]],
    'custom': [mockUsers[5]]
  },
  'grants.grants_manager': {
    'admin': [mockUsers[0], mockUsers[3]],
    'contributor': [mockUsers[2]],
    'viewer': [mockUsers[1], mockUsers[4]],
    'custom': []
  },
  'grants.total_grants': {
    'admin': [mockUsers[0]],
    'contributor': [mockUsers[2], mockUsers[3]],
    'viewer': [mockUsers[1], mockUsers[4], mockUsers[7]],
    'custom': [mockUsers[5]]
  },
  'grants.active_grants': {
    'admin': [mockUsers[0], mockUsers[3]],
    'contributor': [mockUsers[2], mockUsers[4]],
    'viewer': [mockUsers[1], mockUsers[7]],
    'custom': []
  },
  'grants.pending_grants': {
    'admin': [mockUsers[0], mockUsers[3]],
    'contributor': [mockUsers[2]],
    'viewer': [mockUsers[1], mockUsers[4], mockUsers[7]],
    'custom': [mockUsers[5]]
  },
  'grants.grantee_submissions': {
    'admin': [mockUsers[0]],
    'contributor': [mockUsers[2], mockUsers[3]],
    'viewer': [mockUsers[1], mockUsers[4]],
    'custom': []
  },

  // Documents
  'documents.dashboard': {
    'admin': [mockUsers[0], mockUsers[7]],
    'contributor': [mockUsers[2], mockUsers[4]],
    'viewer': [mockUsers[1], mockUsers[3]],
    'custom': [mockUsers[5]]
  },
  'documents.documents': {
    'admin': [mockUsers[0], mockUsers[7]],
    'contributor': [mockUsers[2], mockUsers[4]],
    'viewer': [mockUsers[1], mockUsers[3], mockUsers[6]],
    'custom': []
  },
  'documents.e_signature': {
    'admin': [mockUsers[0]],
    'contributor': [mockUsers[2], mockUsers[7]],
    'viewer': [mockUsers[1], mockUsers[4]],
    'custom': [mockUsers[5]]
  },
  'documents.compliance': {
    'admin': [mockUsers[0], mockUsers[7]],
    'contributor': [mockUsers[2]],
    'viewer': [mockUsers[1], mockUsers[3], mockUsers[4]],
    'custom': []
  },
  'documents.templates': {
    'admin': [mockUsers[0]],
    'contributor': [mockUsers[2], mockUsers[7]],
    'viewer': [mockUsers[1], mockUsers[3]],
    'custom': [mockUsers[5]]
  },

  // Programme Management
  'programme.dashboard': {
    'admin': [mockUsers[2], mockUsers[0]],
    'contributor': [mockUsers[5], mockUsers[3]],
    'viewer': [mockUsers[1], mockUsers[4], mockUsers[7]],
    'custom': [mockUsers[6]]
  },
  'programme.projects': {
    'admin': [mockUsers[2]],
    'contributor': [mockUsers[5], mockUsers[3], mockUsers[0]],
    'viewer': [mockUsers[1], mockUsers[4]],
    'custom': []
  },
  'programme.products': {
    'admin': [mockUsers[2], mockUsers[0]],
    'contributor': [mockUsers[5]],
    'viewer': [mockUsers[1], mockUsers[3], mockUsers[4], mockUsers[7]],
    'custom': []
  },
  'programme.me_framework': {
    'admin': [mockUsers[2]],
    'contributor': [mockUsers[0], mockUsers[5]],
    'viewer': [mockUsers[1], mockUsers[3], mockUsers[4]],
    'custom': [mockUsers[6]]
  },
  'programme.collaboration_knowledge': {
    'admin': [mockUsers[2], mockUsers[0]],
    'contributor': [mockUsers[5]],
    'viewer': [mockUsers[1], mockUsers[4], mockUsers[7]],
    'custom': []
  },

  // Procurement
  'procurement.dashboard': {
    'admin': [mockUsers[0], mockUsers[4]],
    'contributor': [mockUsers[3]],
    'viewer': [mockUsers[1], mockUsers[2], mockUsers[7]],
    'custom': [mockUsers[5]]
  },
  'procurement.purchase_orders': {
    'admin': [mockUsers[0], mockUsers[4]],
    'contributor': [mockUsers[3], mockUsers[2]],
    'viewer': [mockUsers[1]],
    'custom': []
  },
  'procurement.vendor_management': {
    'admin': [mockUsers[0]],
    'contributor': [mockUsers[3], mockUsers[4]],
    'viewer': [mockUsers[1], mockUsers[2], mockUsers[7]],
    'custom': [mockUsers[5]]
  },
  'procurement.analytics': {
    'admin': [mockUsers[0], mockUsers[4]],
    'contributor': [mockUsers[3]],
    'viewer': [mockUsers[1], mockUsers[2], mockUsers[7]],
    'custom': []
  },

  // Inventory
  'inventory.dashboard': {
    'admin': [mockUsers[4], mockUsers[7]],
    'contributor': [mockUsers[0], mockUsers[3]],
    'viewer': [mockUsers[1], mockUsers[2]],
    'custom': [mockUsers[5]]
  },
  'inventory.stock_management': {
    'admin': [mockUsers[4], mockUsers[7]],
    'contributor': [mockUsers[0], mockUsers[3]],
    'viewer': [mockUsers[1]],
    'custom': []
  },
  'inventory.warehouse_management': {
    'admin': [mockUsers[4]],
    'contributor': [mockUsers[0], mockUsers[7]],
    'viewer': [mockUsers[1], mockUsers[2], mockUsers[3]],
    'custom': [mockUsers[5]]
  },
  'inventory.analytics': {
    'admin': [mockUsers[4], mockUsers[7]],
    'contributor': [mockUsers[0]],
    'viewer': [mockUsers[1], mockUsers[2], mockUsers[3]],
    'custom': []
  },

  // Finance
  'finance.dashboard': {
    'admin': [mockUsers[0], mockUsers[3]],
    'contributor': [mockUsers[4]],
    'viewer': [mockUsers[1], mockUsers[2], mockUsers[7]],
    'custom': [mockUsers[5]]
  },
  'finance.accounting': {
    'admin': [mockUsers[0], mockUsers[3]],
    'contributor': [mockUsers[4], mockUsers[2]],
    'viewer': [mockUsers[1]],
    'custom': []
  },
  'finance.budgeting': {
    'admin': [mockUsers[0], mockUsers[3]],
    'contributor': [mockUsers[4]],
    'viewer': [mockUsers[1], mockUsers[2], mockUsers[7], mockUsers[5]],
    'custom': []
  },
  'finance.financial_reporting': {
    'admin': [mockUsers[0]],
    'contributor': [mockUsers[3], mockUsers[4]],
    'viewer': [mockUsers[2], mockUsers[1]],
    'custom': [mockUsers[5]]
  },

  // Learning Management
  'learning.dashboard': {
    'admin': [mockUsers[1], mockUsers[6]],
    'contributor': [mockUsers[2], mockUsers[7]],
    'viewer': [mockUsers[0], mockUsers[3], mockUsers[4]],
    'custom': [mockUsers[5]]
  },
  'learning.course_management': {
    'admin': [mockUsers[1], mockUsers[6]],
    'contributor': [mockUsers[2], mockUsers[7]],
    'viewer': [mockUsers[0], mockUsers[3]],
    'custom': []
  },
  'learning.training_records': {
    'admin': [mockUsers[1]],
    'contributor': [mockUsers[6], mockUsers[2]],
    'viewer': [mockUsers[0], mockUsers[3], mockUsers[4], mockUsers[7]],
    'custom': [mockUsers[5]]
  },
  'learning.analytics': {
    'admin': [mockUsers[1], mockUsers[6]],
    'contributor': [mockUsers[2]],
    'viewer': [mockUsers[0], mockUsers[3], mockUsers[4], mockUsers[7]],
    'custom': []
  },

  // HR Management  
  'hr.dashboard': {
    'admin': [mockUsers[1], mockUsers[0]],
    'contributor': [mockUsers[6]],
    'viewer': [mockUsers[2], mockUsers[3], mockUsers[4], mockUsers[7]],
    'custom': [mockUsers[5]]
  },
  'hr.employee_management': {
    'admin': [mockUsers[1], mockUsers[0]],
    'contributor': [mockUsers[6]],
    'viewer': [mockUsers[2], mockUsers[3]],
    'custom': []
  },
  'hr.payroll': {
    'admin': [mockUsers[1]],
    'contributor': [mockUsers[0], mockUsers[6]],
    'viewer': [mockUsers[3]],
    'custom': [mockUsers[5]]
  },
  'hr.analytics': {
    'admin': [mockUsers[1], mockUsers[0]],
    'contributor': [mockUsers[6]],
    'viewer': [mockUsers[2], mockUsers[3], mockUsers[4]],
    'custom': []
  }
};

// Flat user directory for easier access
export const userDirectory = mockUsers;