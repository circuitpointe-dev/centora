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
  Grid3X3,
  FolderOpen,
  Video,
  HelpCircle,
  Edit3,
  Plus,
  TrendingUp,
  GraduationCap,
  UserCog,
  Accessibility,
  UserPlus,
  DollarSign,
  LogOut,
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
    name: 'Procurement Management',
    icon: ShoppingCart,
    color: 'text-purple-600',
    features: [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
      { id: 'procurement-planning', name: 'Procurement Planning', icon: Target },
      { id: 'vendor-management', name: 'Vendor Management', icon: Users },
      { id: 'procurement-execution', name: 'Procurement Execution', icon: ShoppingCart },
      { id: 'procurement-reports', name: 'Procurement Reports', icon: FileText },
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
      { id: 'catalogue', name: 'Catalogue', icon: Grid3X3 },
      { id: 'course-workspace', name: 'Course workspace', icon: FolderOpen },
      { id: 'live-sessions', name: 'Live sessions', icon: Video },
      { id: 'help-center', name: 'Help center', icon: HelpCircle },
    ]
  },
  lmsAuthor: {
    name: 'LMS Author',
    icon: Edit3,
    color: 'text-green-600',
    features: [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
      { id: 'live-sessions', name: 'Live Sessions', icon: Video },
      { id: 'media-library', name: 'Media Library', icon: FileImage },
      { id: 'templates', name: 'Templates', icon: FileText },
      { id: 'quiz-bank', name: 'Quiz Bank', icon: ClipboardCheck },
    ]
  },
  lmsAdmin: {
    name: 'LMS Admin',
    icon: Shield,
    color: 'text-blue-600',
    features: [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
      { id: 'course-management', name: 'Course Management', icon: GraduationCap },
      { id: 'learner-management', name: 'Learner Management', icon: UserCog },
      { id: 'reports-analytics', name: 'Reports and Analytics', icon: TrendingUp },
      { id: 'media-library', name: 'Media Library', icon: FileImage },
      { id: 'accessibility-flags', name: 'Accessibility Flags', icon: Accessibility },
      { id: 'help-center', name: 'Help Center', icon: HelpCircle },
    ]
  },
  hr: {
    name: 'HR Management',
    icon: Users,
    color: 'text-pink-600',
    features: [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
      { id: 'people-management', name: 'People Management', icon: Users },
      { id: 'recruitment-onboarding', name: 'Recruitment & Onboarding', icon: UserPlus },
      { id: 'performance-management', name: 'Performance Management', icon: TrendingUp },
      { id: 'learning-development', name: 'Learning & Development', icon: GraduationCap },
      { id: 'compensation-policies', name: 'Compensation & Policies', icon: DollarSign },
      { id: 'exits', name: 'Exits', icon: LogOut },
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
      { id: 'role-requests', name: 'Role Requests', icon: UserCheck },
    ],
    superAdminFeatures: [
      { id: 'super-admin-users', name: 'Super Admin Users', icon: UserCheck },
      { id: 'announcements', name: 'Announcements', icon: Bell },
      { id: 'client-directory', name: 'Client Directory', icon: Building2 },
      { id: 'roles-permissions', name: 'Roles & Permissions', icon: Shield },
      { id: 'module-settings', name: 'Module Settings', icon: Settings2 },
      { id: 'audit-logs', name: 'Audit Logs', icon: History },
      { id: 'integrations', name: 'Integrations', icon: Plug },
      { id: 'tenant-subscriptions', name: 'Subscriptions & Billing', icon: CreditCard },
      { id: 'support-tickets', name: 'Support Tickets', icon: MessageCircle },
    ]
  },
};

export const allModules = Object.keys(moduleConfigs);
