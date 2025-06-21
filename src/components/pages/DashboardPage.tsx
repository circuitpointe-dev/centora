
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DocumentsDashboard from '@/components/documents/DocumentsDashboard';
import FundraisingDashboard from '@/components/fundraising/FundraisingDashboard';
import GrantsNGODashboard from '@/components/grants/GrantsNGODashboard';
import GrantsDonorDashboard from '@/components/grants/GrantsDonorDashboard';
import GenericDashboard from '@/components/dashboard/GenericDashboard';
import { useAuth } from '@/contexts/AuthContext';

const DashboardPage = () => {
  const { module, feature } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const getModuleName = (moduleId: string) => {
    const moduleNames: { [key: string]: string } = {
      fundraising: 'Fundraising',
      programme: 'Programme Management',
      procurement: 'Procurement',
      inventory: 'Inventory Management',
      finance: 'Finance & Control',
      learning: 'Learning Management',
      documents: 'Document Management',
      hr: 'HR Management',
      users: 'User Management',
      grants: 'Grants Management',
    };
    return moduleNames[moduleId] || moduleId;
  };

  // Grants-specific content based on user type (both for main dashboard and dashboard feature)
  if (module === 'grants') {
    if (!user) return null;
    
    const isDonor = user.userType === 'Donor';
    return isDonor ? <GrantsDonorDashboard /> : <GrantsNGODashboard />;
  }

  // Document Management specific content
  if (module === 'documents') {
    return <DocumentsDashboard />;
  }

  // Fundraising-specific content
  if (module === 'fundraising') {
    return <FundraisingDashboard />;
  }

  // Default content for other modules
  return <GenericDashboard moduleName={getModuleName(module || '')} />;
};

export default DashboardPage;
