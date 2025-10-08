// src/components/generic/GenericFeaturePage.tsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDefaultFeatureForModule } from "@/utils/defaultFeature";
import DonorManagementPage from './DonorManagementPage';
import OpportunityTrackingPage from './OpportunityTrackingPage';
import ProposalManagementPage from './ProposalManagementPage';
import FundraisingAnalyticsPage from './FundraisingAnalyticsPage';
import { GrantsManagerDashboard } from '@/components/grants/dashboard/GrantsManagerDashboard';
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
import { RolesPermissionPage } from '@/components/users/roles/RolesPermissionPage';
import { SuperAdminRolesPermissionPage } from '@/components/users/roles/SuperAdminRolesPermissionPage';
import { getFeatureName, getModuleName } from '@/utils/nameUtils';
import GenericFeatureUI from '@/components/generic/GenericFeatureUI';
import { useAuth } from '@/contexts/AuthContext';
import { ComplianceChecklistPage } from '@/components/grants/pages/ComplianceChecklistPage';
import { DisbursementSchedulePage } from '@/components/grants/pages/DisbursementSchedulePage';
import { ProfilePage } from '@/components/grants/pages/ProfilePage';
import ComplianceMonitorPage from './ComplianceMonitorPage';
import { RoleRequestPage } from "../users/requests/RoleRequestsPage";
import { SubscriptionAndBillingsPage } from "../users/subscriptions/SubscriptionsAndBillingsPage";
import SuperAdminUserPage from "../users/super-admin/SuperAdminUserPage";
import SuperAdminAnnouncementPage from "../users/announcements/SuperAdminAnnouncementPage";
import ClientDirectoryPage from "../users/clients/ClientDirectoryPage";
import ModuleSettingsPage from "../users/modules/ModuleSettingsPage";
import SuperAdminAuditLogsPage from "../users/audit/SuperAdminAuditLogsPage";
import TenantSubscriptionsPage from "../users/tenant-subscriptions/TenantSubscriptionsPage";
import SupportTicketsPage from "../users/support/tickets/SupportTicketsPage";
import TenantIntegrationsPage from "../users/integrations/TenantIntegrationsPage";
import CataloguePage from "../learning/CataloguePage";
import CourseDetailPage from "../learning/CourseDetailPage";
import CourseWorkspacePage from "../learning/CourseWorkspacePage";
import StudentCourseDetailPage from "../learning/StudentCourseDetailPage";
import LessonPage from "../learning/LessonPage";
import AssignmentPage from "../learning/AssignmentPage";
import QuizPage from "../learning/QuizPage";
import LiveSessionsPage from "../learning/LiveSessionsPage";
import HelpCenterPage from "../learning/HelpCenterPage";
import LMSAuthorDashboard from '../learning/author/LMSAuthorDashboard';
import CourseAnalyticsPage from '../learning/author/CourseAnalyticsPage';
import CreateCoursePage from '../learning/author/CreateCoursePage';
import CreateCourseStep2 from '../learning/author/CreateCourseStep2';
import CourseBuilder from '../learning/author/CourseBuilder';
import QuizCreator from '../learning/author/QuizCreator';
import AssignmentCreator from '../learning/author/AssignmentCreator';
import VideoLessonCreator from '../learning/author/VideoLessonCreator';
import TextLessonCreator from '../learning/author/TextLessonCreator';
import CoursePreview from '../learning/author/CoursePreview';

const GenericFeaturePage = () => {
  const { module, feature } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Debug logging
  console.log('GenericFeaturePage - module:', module, 'feature:', feature);
  console.log('URL pathname:', window.location.pathname);
  console.log('Feature type:', typeof feature);
  console.log('Feature includes courses:', feature?.includes('courses'));
  console.log('Feature includes builder:', feature?.includes('builder'));
  const userType = user?.userType;


  // Redirect /dashboard/documents to /dashboard/documents/documents
  useEffect(() => {
    if (module === 'documents' && !feature) {
      navigate('/dashboard/documents/documents', { replace: true });
    }
  }, [module, feature, navigate]);
  
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
    // Use GrantsDonorDashboard for donors, GrantsManagerDashboard for NGOs
    if (userType === 'Donor') {
      return <GrantsDonorDashboard />;
    }
    return <GrantsManagerDashboard />;
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
    return <GrantsSettingsPage />;
  }

  if (module === 'grants' && feature === 'settings') {
    return <GrantsSettingsPage />;
  }

  if (module === 'grants' && feature === 'reports-submissions') {
    return <ReportSubmissionsPage />;
  }

  if (module === 'grants' && feature === 'compliance-checklist') {
    return <ComplianceChecklistPage />;
  }

  if (module === 'compliance-monitor') {
    return <ComplianceMonitorPage />;
  }

  if (module === 'grants' && feature === 'disbursement-schedule') {
    return <DisbursementSchedulePage />;
  }

  if (module === 'grants' && feature === 'profile') {
    return <ProfilePage />;
  }

  // User Management module routes
  if (module === 'users' && feature === 'user-accounts') {
    return <AdminUsersPage />;
  }

  if (module === 'users' && feature === 'super-admin-users') {
    return <SuperAdminUserPage />;
  }

  if (module === 'users' && feature === 'announcements') {
    return <SuperAdminAnnouncementPage />;
  }

  if (module === 'users' && feature === 'client-directory') {
    return <ClientDirectoryPage />;
  }

  if (module === 'users' && feature === 'module-settings') {
    return <ModuleSettingsPage />;
  }

  if (module === 'users' && feature === 'audit-logs') {
    return <SuperAdminAuditLogsPage />;
  }

  if (module === 'users' && feature === 'integrations') {
    return <TenantIntegrationsPage />;
  }

  if (module === 'users' && feature === 'subscription-billing') {
    return <SubscriptionAndBillingsPage />;
  }

  if (module === 'users' && feature === 'tenant-subscriptions') {
    return <TenantSubscriptionsPage />;
  }

  if (module === 'users' && feature === 'support-tickets') {
    return <SupportTicketsPage />;
  }

  // Learning Management module routes
  if (module === 'learning' && feature === 'catalogue') {
    return <CataloguePage />;
  }

  if (module === 'learning' && feature === 'course-workspace') {
    return <CourseWorkspacePage />;
  }

  if (module === 'learning' && feature === 'live-sessions') {
    return <LiveSessionsPage />;
  }

  if (module === 'learning' && feature === 'help-center') {
    return <HelpCenterPage />;
  }

  // Student course detail page (from course workspace start/continue buttons)
  if (module === 'learning' && feature?.startsWith('enrolled-course-')) {
    const courseId = feature.replace('enrolled-course-', '');
    return <StudentCourseDetailPage courseId={courseId} />;
  }

  // Lesson page (when clicking video lessons from modules tab)
  if (module === 'learning' && feature?.startsWith('lesson-')) {
    const lessonId = feature.replace('lesson-', '');
    // Extract courseId from lessonId if needed (e.g., lesson-1-course-2)
    const parts = lessonId.split('-');
    const lessonNum = parts[0];
    const courseId = parts[1] || '1'; // Default courseId
    return <LessonPage lessonId={lessonNum} courseId={courseId} />;
  }

  // Quiz page (when clicking quiz lessons from modules tab)
  if (module === 'learning' && feature?.startsWith('quiz-')) {
    const quizId = feature.replace('quiz-', '');
    // Extract courseId from quizId if needed (e.g., quiz-2.6-1)
    const parts = quizId.split('-');
    const quizNum = parts[0];
    const courseId = parts[1] || '1'; // Default courseId
    return <QuizPage quizId={quizNum} courseId={courseId} />;
  }

  // Assignment page (when clicking assignment lessons from modules tab)
  if (module === 'learning' && feature?.startsWith('assignment-')) {
    const assignmentId = feature.replace('assignment-', '');
    // Extract courseId from assignmentId if needed (e.g., assignment-1-course-2)
    const parts = assignmentId.split('-');
    const assignmentNum = parts[0];
    const courseId = parts[1] || '1'; // Default courseId
    return <AssignmentPage assignmentId={assignmentNum} courseId={courseId} />;
  }

  if (module === 'learning' && feature?.startsWith('course-')) {
    const courseId = feature.replace('course-', '');
    return <CourseDetailPage courseId={courseId} />;
  }

  // LMS Author module routes
  if (module === 'lmsAuthor' && feature === 'dashboard') {
    return <LMSAuthorDashboard />;
  }

  if (module === 'lmsAuthor' && feature === 'live-sessions') {
    return <LiveSessionsPage />;
  }

  if (module === 'lmsAuthor' && feature === 'media-library') {
    return <GenericFeatureUI moduleName="LMS Author" featureName="Media Library" />;
  }

  if (module === 'lmsAuthor' && feature === 'templates') {
    return <GenericFeatureUI moduleName="LMS Author" featureName="Templates" />;
  }

  if (module === 'lmsAuthor' && feature === 'quiz-bank') {
    return <GenericFeatureUI moduleName="LMS Author" featureName="Quiz Bank" />;
  }

  // Course Analytics route (when clicking "View course analytics" button)
  if (module === 'lmsAuthor' && feature?.startsWith('course-analytics-')) {
    const courseId = feature.replace('course-analytics-', '');
    return <CourseAnalyticsPage courseId={courseId} />;
  }

  // Create Course route (when clicking "Create course" button)
  if (module === 'lmsAuthor' && feature === 'create-course') {
    console.log('Matched Create Course route:', feature);
    return <CreateCoursePage />;
  }

  // Create Course Step 2 route
  if (module === 'lmsAuthor' && feature === 'create-course-step2') {
    console.log('Matched Create Course Step 2 route:', feature);
    return <CreateCourseStep2 />;
  }

  // Course Builder route - specific pattern
  if (module === 'lmsAuthor' && feature && feature.includes('courses') && feature.includes('builder')) {
    console.log('Matched Course Builder route:', feature);
    return <CourseBuilder />;
  }

  // Course Preview route - more specific pattern
  if (module === 'lmsAuthor' && feature && feature.includes('courses') && feature.includes('preview')) {
    console.log('Matched Course Preview route:', feature);
    return <CoursePreview />;
  }

  // Lesson Creator routes - more specific patterns
  if (module === 'lmsAuthor' && feature && feature.includes('courses') && feature.includes('lessons') && feature.includes('quiz')) {
    console.log('Matched Quiz Creator route:', feature);
    return <QuizCreator />;
  }

  if (module === 'lmsAuthor' && feature && feature.includes('courses') && feature.includes('lessons') && feature.includes('assignment')) {
    console.log('Matched Assignment Creator route:', feature);
    return <AssignmentCreator />;
  }

  if (module === 'lmsAuthor' && feature && feature.includes('courses') && feature.includes('lessons') && feature.includes('video')) {
    console.log('Matched Video Creator route:', feature);
    return <VideoLessonCreator />;
  }

  if (module === 'lmsAuthor' && feature && feature.includes('courses') && feature.includes('lessons') && feature.includes('text')) {
    console.log('Matched Text Creator route:', feature);
    return <TextLessonCreator />;
  }

  // LMS Admin module routes
  if (module === 'lmsAdmin' && feature === 'dashboard') {
    return <GenericFeatureUI moduleName="LMS Admin" featureName="Dashboard" />;
  }

  if (module === 'lmsAdmin' && feature === 'user-management') {
    return <GenericFeatureUI moduleName="LMS Admin" featureName="User Management" />;
  }

  if (module === 'lmsAdmin' && feature === 'course-approval') {
    return <GenericFeatureUI moduleName="LMS Admin" featureName="Course Approval" />;
  }

  if (module === 'lmsAdmin' && feature === 'system-settings') {
    return <GenericFeatureUI moduleName="LMS Admin" featureName="System Settings" />;
  }

  if (module === 'lmsAdmin' && feature === 'reports') {
    return <GenericFeatureUI moduleName="LMS Admin" featureName="Reports" />;
  }

  if (module === 'lmsAdmin' && feature === 'audit-logs') {
    return <GenericFeatureUI moduleName="LMS Admin" featureName="Audit Logs" />;
  }

  if (module === 'lmsAdmin' && feature === 'help-center') {
    return <HelpCenterPage />;
  }

  if (module === 'users' && feature === 'roles-permissions') {
    // Differentiate between tenant admin and super admin roles & permissions
    const isSuperAdmin = !!user?.is_super_admin;
    
    if (isSuperAdmin) {
      // Super admin sees system-wide role management
      return <SuperAdminRolesPermissionPage />;
    } else {
      // Tenant admin sees organization-specific role management
      return <RolesPermissionPage />;
    }
  }

  if (module === 'users' && feature === 'role-requests') {
    return <RoleRequestPage />;
  }

  // Fallback for unmatched routes
  console.log('No route matched for:', module, feature);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-foreground mb-4">Route Not Found</h1>
      <p className="text-muted-foreground mb-4">
        Module: {module}, Feature: {feature}
      </p>
      <p className="text-muted-foreground">
        This route is not yet implemented or the URL pattern doesn't match any existing routes.
      </p>
    </div>
  );
};

export default GenericFeaturePage;