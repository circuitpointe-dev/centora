
import React from 'react';
import { useParams } from 'react-router-dom';
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
import DocumentsFeaturePage from '@/components/documents/documents-feature/DocumentsFeaturePage';
import ESignaturePage from '@/components/documents/e-signature/ESignaturePage';
import CompliancePage from '@/components/documents/compliance/CompliancePage';
import { getFeatureName, getModuleName } from '@/utils/nameUtils';
import GenericFeatureUI from '@/components/generic/GenericFeatureUI';
import { useAuth } from '@/contexts/AuthContext';

const GenericFeaturePage = () => {
  const { module, feature } = useParams();
  const { user } = useAuth();
  
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

  // Render specific page components for grants routes
  if (module === 'grants' && feature === 'grants-manager') {
    // Use GrantsDonorDashboard for donors, GrantsManagerPage for NGOs
    if (user?.userType === 'Donor') {
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

  if (module === 'grants' && feature === 'settings') {
    return <GrantsSettingsPage />;
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

  return (
    <GenericFeatureUI 
      moduleName={getModuleName(module || '')} 
      featureName={getFeatureName(feature || '')}
    />
  );
};

export default GenericFeaturePage;
