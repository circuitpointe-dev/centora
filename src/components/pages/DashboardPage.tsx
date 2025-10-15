
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DocumentsDashboard from '@/components/documents/DocumentsDashboard';
import FundraisingDashboard from '@/components/fundraising/FundraisingDashboard';
import GrantsNGODashboard from '@/components/grants/GrantsNGODashboard';
import GrantsDonorDashboard from '@/components/grants/GrantsDonorDashboard';
import ProgrammeDashboard from '@/components/programme/ProgrammeDashboard';
import LearningDashboard from '@/components/learning/LearningDashboard';
import LMSAuthorDashboard from '@/components/learning/author/LMSAuthorDashboard';
import LMSAdminDashboard from '@/components/lms-admin/LMSAdminDashboard';
import ProcurementDashboard from '@/components/procurement/ProcurementDashboard';
import HRDashboard from '@/components/hr/HRDashboard';
import GenericDashboard from '@/components/dashboard/GenericDashboard';
import { useAuth } from '@/contexts/AuthContext';

const DashboardPage = () => {
  const { module, feature } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userType = user?.userType;

  const getModuleName = (moduleId: string) => {
    const moduleNames: { [key: string]: string } = {
      fundraising: 'Fundraising',
      programme: 'Programme Management',
      procurement: 'Procurement',
      inventory: 'Inventory Management',
      finance: 'Finance & Control',
      learning: 'Learning Management',
      lmsAuthor: 'LMS Author',
      lmsAdmin: 'LMS Admin',
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

  // Learning Management specific content
  if (module === 'learning') {
    return <LearningDashboard />;
  }

  // LMS Author specific content
  if (module === 'lmsAuthor') {
    return <LMSAuthorDashboard />;
  }

  // LMS Admin specific content
  if (module === 'lmsAdmin') {
    return <LMSAdminDashboard />;
  }

  // Procurement Management specific content
  if (module === 'procurement') {
    return <ProcurementDashboard />;
  }

  // HR Management specific content
  if (module === 'hr') {
    return <HRDashboard />;
  }

  // Default content for other modules
  return <GenericDashboard moduleName={getModuleName(module || '')} />;
};

export default DashboardPage;
