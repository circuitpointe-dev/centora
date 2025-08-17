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
  Briefcase,
  FolderKanban,
  Network,
  MapPin,
  AlertTriangle,
  FileImage,
  Send,
  ClipboardCheck,
  Calendar,
  UserCircle,
  Bell,
  Building2,
  Settings2,
  History,
  Plug,
  CreditCard,
  MessageCircle,
  Info,
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
  adminFeatures?: ModuleFeature[];
  superAdminFeatures?: ModuleFeature[];
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
      { id: 'grantee-submissions', name: 'Grantee Submissions', icon: FileCheck },
      { id: 'templates', name: 'Templates', icon: FileImage },
      { id: 'grants-archive', name: 'Grants Archive', icon: Archive },
    ],
    ngoFeatures: [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
      { id: 'reports-submissions', name: 'Reports Submissions', icon: Send },
      { id: 'compliance-checklist', name: 'Compliance Checklist', icon: ClipboardCheck },
      { id: 'disbursement-schedule', name: 'Disbursement Schedule', icon: Calendar },
      { id: 'profile', name: 'Profile', icon: UserCircle },
    ],
    donorFeatures: [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
      { id: 'active-grants', name: 'Active Grants', icon: CheckCircle },
      { id: 'grantee-submissions', name: 'Grantee Submissions', icon: FileCheck },
      { id: 'templates', name: 'Templates', icon: FileImage },
      { id: 'grants-archive', name: 'Grants Archive', icon: Archive },
    ]
  },
  documents: {
    name: 'Document Manager',
    icon: FileText,
    color: 'text-gray-600',
    features: [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
      { id: 'documents', name: 'Documents', icon: FileText },
      { id: 'e-signature', name: 'E-Signature', icon: FileSignature },
      { id: 'compliance', name: 'Compliance', icon: Shield },
      { id: 'templates', name: 'Templates', icon: File },
    ]
  },
  programme: {
    name: 'Programme Management',
    icon: Target,
    color: 'text-blue-600',
    features: [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
      { id: 'projects', name: 'Projects', icon: FolderKanban },
      { id: 'products', name: 'Products', icon: Briefcase },
      { id: 'me-framework', name: 'M&E Framework', icon: Target },
      { id: 'collaboration-knowledge', name: 'Collaboration & Knowledge Hub', icon: Network },
      { id: 'resources-risk', name: 'Resources & Risk Management', icon: AlertTriangle },
      { id: 'gis-report', name: 'GIS & Report', icon: MapPin },
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
    ]
  },
  users: {
    name: 'User Management',
    icon: User,
    color: 'text-cyan-600',
    features: [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    ],
    adminFeatures: [
      { id: 'user-accounts', name: 'Users', icon: Users },
      { id: 'roles-permissions', name: 'Roles & Permissions', icon: Shield },
      { id: 'subscription-billing', name: 'Subscription & Billing', icon: CreditCard },
    ],
    superAdminFeatures: [
      { id: 'super-admin-users', name: 'Super Admin Users', icon: UserCheck },
      { id: 'announcements', name: 'Announcements', icon: Bell },
      { id: 'client-directory', name: 'Client Directory', icon: Building2 },
      { id: 'roles-permissions', name: 'Roles & Permissions', icon: Shield },
      { id: 'module-settings', name: 'Module Settings', icon: Settings2 },
      { id: 'audit-logs', name: 'Audit Logs', icon: History },
      { id: 'integrations', name: 'Integrations', icon: Plug },
      { id: 'subscriptions-billing', name: 'Subscriptions & Billing', icon: CreditCard },
      { id: 'support-tickets', name: 'Support Tickets', icon: MessageCircle },
    ]
  },
};

export const allModules = Object.keys(moduleConfigs);
