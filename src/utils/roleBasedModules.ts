import { 
  BarChart3,
  Settings,
  Archive,
  CheckCircle,
  FileCheck,
  Award,
  FileText,
  Target,
  File,
} from 'lucide-react';

export const getRoleBasedGrantsFeatures = (userType: 'NGO' | 'Donor') => {
  if (userType === 'Donor') {
    return [
      { id: 'grants-manager', name: 'Grants Manager', icon: BarChart3 },
      { id: 'active-grants', name: 'Active Grants', icon: CheckCircle },
      { id: 'grantee-submissions', name: 'Grantee Submissions', icon: FileCheck },
      { id: 'grants-archive', name: 'Grants Archive', icon: Archive },
      { id: 'settings', name: 'Settings', icon: Settings },
    ];
  }
  
  // NGO features
  return [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'assigned-grants', name: 'Assigned Grants', icon: Award },
    { id: 'reports', name: 'Reports', icon: FileText },
    { id: 'templates', name: 'Templates', icon: File },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];
};

export const getUserSpecificModuleConfig = (userType: 'NGO' | 'Donor') => {
  const baseModuleConfigs = {
    fundraising: {
      name: 'Fundraising',
      icon: BarChart3,
      color: 'text-red-600',
    },
    grants: {
      name: 'Grants Management',
      icon: Award,
      color: 'text-orange-600',
    },
    // ... other modules remain the same for both user types
  };

  return {
    ...baseModuleConfigs,
    grants: {
      ...baseModuleConfigs.grants,
      features: getRoleBasedGrantsFeatures(userType)
    }
  };
};
