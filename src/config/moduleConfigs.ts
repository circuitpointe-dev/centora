
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
} from 'lucide-react';

export const moduleConfigs = {
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
  documents: {
    name: 'Document Management',
    icon: FileText,
    color: 'text-gray-600',
    features: [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
      { id: 'document-library', name: 'Document Library', icon: FileText },
      { id: 'document-workflow', name: 'Document Workflow', icon: FileText },
      { id: 'document-analytics', name: 'Analytics', icon: BarChart3 },
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
  grants: {
    name: 'Grants Management',
    icon: Award,
    color: 'text-orange-600',
    features: [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
      { id: 'grant-applications', name: 'Grant Applications', icon: Award },
      { id: 'grant-tracking', name: 'Grant Tracking', icon: BarChart3 },
      { id: 'compliance', name: 'Compliance', icon: FileText },
      { id: 'settings', name: 'Settings', icon: Settings },
    ]
  },
};

export const allModules = Object.keys(moduleConfigs);
