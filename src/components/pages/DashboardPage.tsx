
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DocumentsDashboard from '@/components/documents/DocumentsDashboard';
import FundraisingDashboard from '@/components/fundraising/FundraisingDashboard';
import GenericDashboard from '@/components/dashboard/GenericDashboard';

const DashboardPage = () => {
  const { module, feature } = useParams();
  const navigate = useNavigate();
  
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

  // Grants-specific content - redirect to grants-manager
  if (module === 'grants') {
    // If we're on the generic dashboard route for grants, redirect to grants-manager
    if (feature === 'dashboard' || !feature) {
      navigate('/dashboard/grants/grants-manager', { replace: true });
      return null;
    }
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
