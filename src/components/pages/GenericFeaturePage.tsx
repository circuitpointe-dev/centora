
// src/components/generic/GenericFeaturePage.tsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDefaultFeatureForModule } from "@/utils/defaultFeature";
import DonorManagementPage from './DonorManagementPage';
import OpportunityTrackingPage from './OpportunityTrackingPage';
import ProposalManagementPage from './ProposalManagementPage';
import FundraisingAnalyticsPage from './FundraisingAnalyticsPage';
import GrantsManagerPage from './GrantsManagerPage';
import GrantsDonorDashboard from '@/components/grants/GrantsDonorDashboard';
import TotalGrantsPage from './TotalGrantsPage';
import ActiveGrantsPage from './ActiveGrantsPage';
import PendingGrantsPage from './PendingGrantsPage';
import ClosedGrantsPage from './ClosedGrantsPage';
import GrantsArchivePage from './GrantsArchivePage';
import GranteeSubmissionsPage from './GranteeSubmissionsPage';
import GrantsSettingsPage from './GrantsSettingsPage';
import GrantsTemplatesPage from './TemplatesPage';
import DocumentsFeaturePage from '@/components/documents/documents-feature/DocumentsFeaturePage';
import ESignaturePage from '@/components/documents/e-signature/ESignaturePage';
import CompliancePage from '@/components/documents/compliance/CompliancePage';
import TemplatesPage from '@/components/documents/templates/TemplatesPage';
import ReportSubmissionsPage from './ReportSubmissionsPage';
import { AdminUsersPage } from '@/components/users/users/AdminUsersPage';
import { getFeatureName, getModuleName } from '@/utils/nameUtils';
import GenericFeatureUI from '@/components/generic/GenericFeatureUI';
import { useAuth } from '@/contexts/AuthContext';

const GenericFeaturePage = () => {
  const { module, feature } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const userType = user?.userType;
  
  // Render specific page components for fundraising routes
  if (module === 'fundraising' && feature === 'donor-management') {
    return <DonorManagementPage />;
  }

  if (module === 'fundraising' && feature === 'opportunity-tracking') {
    return <OpportunityTrackingPage />;
  }
  
  if (module === 'fundraising' && feature === 'proposal-management') {
    return <ProposalManagementPage />;
  }
  
  if (module === 'fundraising' && feature === 'fundraising-analytics') {
    return <FundraisingAnalyticsPage />;
  }

  if (module === 'documents' && feature === 'documents') {
    return <DocumentsFeaturePage />;
  }

  if (module === 'documents' && feature === 'e-signature') {
    return <ESignaturePage />;
  }

  if (module === 'documents' && feature === 'compliance') {
    return <CompliancePage />;
  }

  if (module === 'documents' && feature === 'templates') {
    return <TemplatesPage />;
  }

  // Render specific page components for grants routes
  if (module === 'grants' && feature === 'grants-manager') {
    // Use GrantsDonorDashboard for donors, GrantsManagerPage for NGOs
    if (userType === 'Donor') {
      return <GrantsDonorDashboard />;
    }
    return <GrantsManagerPage />;
  }

  if (module === 'grants' && feature === 'total-grants') {
    return <TotalGrantsPage />;
  }

  if (module === 'grants' && feature === 'active-grants') {
    return <ActiveGrantsPage />;
  }

  if (module === 'grants' && feature === 'pending-grants') {
    return <PendingGrantsPage />;
  }

  if (module === 'grants' && feature === 'closed-grants') {
    return <ClosedGrantsPage />;
  }

  if (module === 'grants' && feature === 'grants-archive') {
    return <GrantsArchivePage />;
  }

  if (module === 'grants' && feature === 'grantee-submissions') {
    return <GranteeSubmissionsPage />;
  }

  if (module === 'grants' && feature === 'templates') {
    return <GrantsTemplatesPage />;
  }

  if (module === 'grants' && feature === 'settings') {
    return <GrantsSettingsPage />;
  }

  if (module === 'grants' && feature === 'reports-submissions') {
    return <ReportSubmissionsPage />;
  }

  // User Management module routes
  if (module === 'users' && feature === 'user-accounts') {
    return <AdminUsersPage />;
  }

  if (module === 'users' && feature === 'super-admin-users') {
    return <GenericFeatureUI moduleName="User Management" featureName="Super Admin Users" />;
  }

  if (module === 'users' && feature === 'announcements') {
    return <GenericFeatureUI moduleName="User Management" featureName="Announcements" />;
  }

  if (module === 'users' && feature === 'client-directory') {
    return <GenericFeatureUI moduleName="User Management" featureName="Client Directory" />;
  }

  if (module === 'users' && feature === 'module-settings') {
    return <GenericFeatureUI moduleName="User Management" featureName="Module Settings" />;
  }

  if (module === 'users' && feature === 'audit-logs') {
    return <GenericFeatureUI moduleName="User Management" featureName="Audit Logs" />;
  }

  if (module === 'users' && feature === 'integrations') {
    return <GenericFeatureUI moduleName="User Management" featureName="Integrations" />;
  }

  if (module === 'users' && feature === 'subscription-billing' || module === 'users' && feature === 'subscriptions-billing') {
    return <GenericFeatureUI moduleName="User Management" featureName="Subscriptions & Billing" />;
  }

  if (module === 'users' && feature === 'support-tickets') {
    return <GenericFeatureUI moduleName="User Management" featureName="Support Tickets" />;
  }


  if (module === 'users' && feature === 'roles-permissions') {
    return <GenericFeatureUI moduleName="User Management" featureName="Roles & Permissions" />;
  }

  return (
    <GenericFeatureUI 
      moduleName={getModuleName(module || '')} 
      featureName={getFeatureName(feature || '')}
    />
  );
};

export default GenericFeaturePage;
