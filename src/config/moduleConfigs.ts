import { 
  Heart, 
  Target, 
  ShoppingCart, 
  Package, 
  Calculator, 
  BookOpen, 
  FileText, 
  Users, 
  User, 
  Award,
  BarChart3,
  Settings,
  Archive,
  Clock,
  CheckCircle,
  FileCheck,
  UserCheck,
  FileSignature,
  Shield,
  File,
} from 'lucide-react';

interface ModuleFeature {
  id: string;
  name: string;
  icon: any;
}

interface ModuleConfig {
  name: string;
  icon: any;
  color: string;
  features: ModuleFeature[];
  ngoFeatures?: ModuleFeature[];
  donorFeatures?: ModuleFeature[];
}

export const moduleConfigs: Record<string, ModuleConfig> = {
  fundraising: {
    name: 'Fundraising',
    icon: Heart,
    color: 'text-red-600',
    features: [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
      { id: 'donor-management', name: 'Donor Management', icon: Users },
      { id: 'opportunity-tracking', name: 'Opportunity Tracking', icon: Target },
      { id: 'proposal-management', name: 'Proposal Management', icon: FileText },
      { id: 'fundraising-analytics', name: 'Analytics', icon: BarChart3 },
      { id: 'settings', name: 'Settings', icon: Settings },
    ]
  },
  grants: {
    name: 'Grants Management',
    icon: Award,
    color: 'text-orange-600',
    features: [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
      { id: 'grants-manager', name: 'Grants Manager', icon: BarChart3 },
      { id: 'total-grants', name: 'Total Grants', icon: Award },
      { id: 'active-grants', name: 'Active Grants', icon: CheckCircle },
      { id: 'pending-grants', name: 'Pending Grants', icon: Clock },
      { id: 'closed-grants', name: 'Closed Grants', icon: Archive },
      { id: 'grants-archive', name: 'Grants Archive', icon: Archive },
      { id: 'grantee-submissions', name: 'Grantee Submissions', icon: FileCheck },
      { id: 'settings', name: 'Settings/Admin', icon: Settings },
    ],
    ngoFeatures: [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
      { id: 'assigned-grants', name: 'Assigned Grants', icon: Award },
      { id: 'reports', name: 'Reports', icon: FileText },
      { id: 'templates-docs', name: 'Templates & Docs', icon: File },
      { id: 'settings', name: 'Settings', icon: Settings },
    ],
    donorFeatures: [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
      { id: 'active-grants', name: 'Active Grants', icon: CheckCircle },
      { id: 'grantee-submissions', name: 'Grantee Submissions', icon: FileCheck },
      { id: 'grants-archive', name: 'Grants Archive', icon: Archive },
      { id: 'settings', name: 'Settings', icon: Settings },
    ]
  },
  documents: {
    name: 'Document Management',
    icon: FileText,
    color: 'text-gray-600',
    features: [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
      { id: 'documents', name: 'Documents', icon: FileText },
      { id: 'e-signature', name: 'E-Signature', icon: FileSignature },
      { id: 'compliance', name: 'Compliance', icon: Shield },
      { id: 'templates', name: 'Templates', icon: File },
      { id: 'settings', name: 'Settings', icon: Settings },
    ]
  },
  programme: {
    name: 'Programme Management',
    icon: Target,
    color: 'text-blue-600',
    features: [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
      { id: 'project-management', name: 'Project Management', icon: Target },
      { id: 'beneficiary-management', name: 'Beneficiary Management', icon: Users },
      { id: 'impact-tracking', name: 'Impact Tracking', icon: BarChart3 },
      { id: 'settings', name: 'Settings', icon: Settings },
    ]
  },
  procurement: {
    name: 'Procurement',
    icon: ShoppingCart,
    color: 'text-green-600',
    features: [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
      { id: 'purchase-orders', name: 'Purchase Orders', icon: ShoppingCart },
      { id: 'vendor-management', name: 'Vendor Management', icon: Users },
      { id: 'procurement-analytics', name: 'Analytics', icon: BarChart3 },
      { id: 'settings', name: 'Settings', icon: Settings },
    ]
  },
  inventory: {
    name: 'Inventory Management',
    icon: Package,
    color: 'text-purple-600',
    features: [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
      { id: 'stock-management', name: 'Stock Management', icon: Package },
      { id: 'warehouse-management', name: 'Warehouse Management', icon: Package },
      { id: 'inventory-analytics', name: 'Analytics', icon: BarChart3 },
      { id: 'settings', name: 'Settings', icon: Settings },
    ]
  },
  finance: {
    name: 'Finance & Control',
    icon: Calculator,
    color: 'text-indigo-600',
    features: [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
      { id: 'accounting', name: 'Accounting', icon: Calculator },
      { id: 'budgeting', name: 'Budgeting', icon: Calculator },
      { id: 'financial-reporting', name: 'Financial Reporting', icon: BarChart3 },
      { id: 'settings', name: 'Settings', icon: Settings },
    ]
  },
  learning: {
    name: 'Learning Management',
    icon: BookOpen,
    color: 'text-yellow-600',
    features: [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
      { id: 'course-management', name: 'Course Management', icon: BookOpen },
      { id: 'training-records', name: 'Training Records', icon: FileText },
      { id: 'learning-analytics', name: 'Analytics', icon: BarChart3 },
      { id: 'settings', name: 'Settings', icon: Settings },
    ]
  },
  hr: {
    name: 'HR Management',
    icon: Users,
    color: 'text-pink-600',
    features: [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
      { id: 'employee-management', name: 'Employee Management', icon: Users },
      { id: 'payroll', name: 'Payroll', icon: Calculator },
      { id: 'hr-analytics', name: 'Analytics', icon: BarChart3 },
      { id: 'settings', name: 'Settings', icon: Settings },
    ]
  },
  users: {
    name: 'User Management',
    icon: User,
    color: 'text-cyan-600',
    features: [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
      { id: 'user-accounts', name: 'User Accounts', icon: User },
      { id: 'roles-permissions', name: 'Roles & Permissions', icon: User },
      { id: 'user-analytics', name: 'Analytics', icon: BarChart3 },
      { id: 'settings', name: 'Settings', icon: Settings },
    ]
  },
};

export const allModules = Object.keys(moduleConfigs);
