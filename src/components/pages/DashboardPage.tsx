
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DocumentsDashboard from '@/components/documents/DocumentsDashboard';
import FundraisingDashboard from '@/components/fundraising/FundraisingDashboard';
import GrantsNGODashboard from '@/components/grants/GrantsNGODashboard';
import GrantsDonorDashboard from '@/components/grants/GrantsDonorDashboard';
import ProgrammeDashboard from '@/components/programme/ProgrammeDashboard';
import GenericDashboard from '@/components/dashboard/GenericDashboard';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const DashboardPage = () => {
  const { module, feature } = useParams();
  const navigate = useNavigate();
  const { user, userType } = useAuth();
  
  const getModuleName = (moduleId: string) => {
    const moduleNames: { [key: string]: string } = {
      fundraising: 'Fundraising',
      programme: 'Programme Management',
      procurement: 'Procurement',
      inventory: 'Inventory Management',
      finance: 'Finance & Control',
      learning: 'Learning Management',
      documents: 'Document Manager',
      hr: 'HR Management',
      users: 'User Management',
      grants: 'Grants Management',
    };
    return moduleNames[moduleId] || moduleId;
  };

  // Grants-specific content based on user type (both for main dashboard and dashboard feature)
  if (module === 'grants') {
    if (!user) return null;
    
    const isDonor = userType === 'Donor';
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

  // Programme Management specific content
  if (module === 'programme') {
    return <ProgrammeDashboard />;
  }

  // Default content for other modules
  return <GenericDashboard moduleName={getModuleName(module || '')} />;
};

export default DashboardPage;
