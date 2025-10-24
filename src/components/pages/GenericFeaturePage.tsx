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
import LMSAdminMediaLibrary from '@/components/lms-admin/MediaLibrary';
import { DisbursementSchedulePage } from '@/components/grants/pages/DisbursementSchedulePage';
import { ProfilePage } from '@/components/grants/pages/ProfilePage';
import ComplianceMonitorPage from './ComplianceMonitorPage';
import ProcurementFeaturePage from '@/components/procurement/ProcurementFeaturePage';
import ProcurementAnalyticsPage from '@/components/procurement/ProcurementAnalyticsPage';
import ProcurementApprovalsPage from '@/components/procurement/ProcurementApprovalsPage';
import ProcurementDeliveriesPage from '@/components/procurement/ProcurementDeliveriesPage';
import ProcurementPlanningPage from '@/components/procurement/ProcurementPlanningPage';
import RequisitionDetailPage from '@/components/procurement/RequisitionDetailPage';
import InvoicesPaymentTrackersPage from '@/components/procurement/InvoicesPaymentTrackersPage';
import InvoiceDetailPage from '@/components/procurement/InvoiceDetailPage';
import ProcurementReportsPage from '@/components/procurement/ProcurementReportsPage';
import ComplianceAuditTrialReportPage from '@/components/procurement/ComplianceAuditTrialReportPage';
import ProcurementDocumentArchivePage from '@/components/procurement/ProcurementDocumentArchivePage';
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
import PeopleManagement from "@/components/hr/PeopleManagement";
import StaffDetailView from "@/components/hr/StaffDetailView";
import VolunteerProfile from "@/components/hr/VolunteerProfile";
import BoardMemberDetailView from "@/components/hr/BoardMemberDetailView";
import MeetingDetails from "@/components/hr/MeetingDetails";
import RecruitmentOnboarding from "@/components/hr/RecruitmentOnboarding";
import RequisitionDetailView from "@/components/hr/RequisitionDetailView";
import ReferenceCheckDetailView from "@/components/hr/ReferenceCheckDetailView";
import PerformanceManagement from "@/components/hr/PerformanceManagement";
import LearningDevelopment from "@/components/hr/LearningDevelopment";
import CompensationPolicies from "@/components/hr/CompensationPolicies";
import Exits from "@/components/hr/Exits";
import StartExit from "@/components/hr/StartExit";
import CourseDetailPage from "../learning/CourseDetailPage";
import CourseWorkspacePage from "../learning/CourseWorkspacePage";
import StudentCourseDetailPage from "../learning/StudentCourseDetailPage";
import LessonPage from "../learning/LessonPage";
import AssignmentPage from "../learning/AssignmentPage";
import QuizPage from "../learning/QuizPage";
import LiveSessionsPage from "../learning/LiveSessionsPage";
import LiveSessionsAuthor from "../learning/author/LiveSessions";
import MediaLibrary from "../learning/author/MediaLibrary";
import Templates from "../learning/author/Templates";
import TemplatePreview from "../learning/author/TemplatePreview";
import QuizBank from "../learning/author/QuizBank";
import QuizBankView from "../learning/author/QuizBankView";
import QuizBankEdit from "../learning/author/QuizBankEdit";
import HelpCenterPage from "../learning/HelpCenterPage";
import LMSAuthorDashboard from '../learning/author/LMSAuthorDashboard';
import CourseAnalyticsPage from '../learning/author/CourseAnalyticsPage';
import CreateCoursePage from '../learning/author/CreateCoursePage';
import CreateCourseStep2 from '../learning/author/CreateCourseStep2';
import CourseEditorChoice from '../learning/author/CourseEditorChoice';
import SlideEditor from '../learning/author/SlideEditor';
import SlideEditorPreview from '../learning/author/SlideEditorPreview';
import CourseBuilder from '../lms-admin/CourseBuilder';
import LearningCourseBuilder from '../learning/author/CourseBuilder';
import AddSectionPage from '../lms-admin/AddSectionPage';
import QuizEditor from '../learning/author/QuizEditor';
import AssignmentEditor from '../learning/author/AssignmentEditor';
import VideoLessonEditor from '../learning/author/VideoLessonEditor';
import TextLessonEditor from '../learning/author/TextLessonEditor';
import CoursePreview from '../learning/author/CoursePreview';
import QuizPreview from '../learning/author/QuizPreview';
import LiveSessions from '../learning/author/LiveSessions';
import LMSAdminDashboard from '../lms-admin/LMSAdminDashboard';
import CourseManagement from '../lms-admin/CourseManagement';
import CourseDetailView from '../lms-admin/CourseDetailView';
import LearnerManagement from '../lms-admin/LearnerManagement';
import LearnerDetailView from '../lms-admin/LearnerDetailView';
import BulkEnrollment from '../lms-admin/BulkEnrollment';
import ReportsAnalytics from '../lms-admin/ReportsAnalytics';
import AccessibilityFlags from '../lms-admin/AccessibilityFlags';
import HelpCenter from '../lms-admin/HelpCenter';

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

  // Procurement module routes
  if (module === 'procurement' && feature === 'approvals') {
    return <ProcurementApprovalsPage />;
  }

  if (module === 'procurement' && feature === 'analytics') {
    return <ProcurementAnalyticsPage />;
  }

  if (module === 'procurement' && feature === 'deliveries') {
    return <ProcurementDeliveriesPage />;
  }

  if (module === 'procurement' && feature === 'planning') {
    return <ProcurementPlanningPage />;
  }

  if (module === 'procurement' && feature === 'procurement-planning') {
    return <ProcurementPlanningPage />;
  }

  // Procurement requisition detail dynamic route: requisition-detail-<id>
  if (module === 'procurement' && feature?.startsWith('requisition-detail-')) {
    return <RequisitionDetailPage />;
  }

  // Procurement invoice routes
  if (module === 'procurement' && feature === 'invoices') {
    return <InvoicesPaymentTrackersPage />;
  }

  if (module === 'procurement' && feature?.startsWith('invoice-detail-')) {
    return <InvoiceDetailPage />;
  }

  if (module === 'procurement' && feature === 'procurement-reports') {
    return <ProcurementReportsPage />;
  }

  if (module === 'procurement' && feature === 'compliance-audit-trial') {
    return <ComplianceAuditTrialReportPage />;
  }

  if (module === 'procurement' && feature === 'document-archive') {
    return <ProcurementDocumentArchivePage />;
  }

  if (module === 'procurement') {
    return <ProcurementFeaturePage />;
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
    return <LiveSessionsAuthor />;
  }

  if (module === 'lmsAuthor' && feature === 'media-library') {
    return <MediaLibrary />;
  }

  if (module === 'lmsAuthor' && feature === 'template-preview') {
    return <TemplatePreview />;
  }

  if (module === 'lmsAuthor' && feature === 'templates') {
    return <Templates />;
  }

  if (module === 'lmsAuthor' && feature === 'quiz-bank-edit') {
    return <QuizBankEdit />;
  }

  if (module === 'lmsAuthor' && feature === 'quiz-bank-view') {
    return <QuizBankView />;
  }

  if (module === 'lmsAuthor' && feature === 'quiz-bank') {
    return <QuizBank />;
  }

  // Course Analytics route (when clicking "View course analytics" button)
  if (module === 'lmsAuthor' && feature === 'course-analytics') {
    return <CourseAnalyticsPage />;
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

  // Course Editor Choice route
  if (module === 'lmsAuthor' && feature === 'course-editor-choice') {
    console.log('Matched Course Editor Choice route:', feature);
    return <CourseEditorChoice />;
  }

  // Slide Editor route
  if (module === 'lmsAuthor' && feature === 'slide-editor') {
    console.log('Matched Slide Editor route:', feature);
    return <SlideEditor />;
  }

  // Slide Editor Preview route
  if (module === 'lmsAuthor' && feature === 'slide-editor-preview') {
    console.log('Matched Slide Editor Preview route:', feature);
    return <SlideEditorPreview />;
  }

  // Course Builder route - simple static route
  if (module === 'lmsAuthor' && feature === 'courses') {
    console.log('Matched Course Builder route:', feature);
    return <CourseBuilder />;
  }

  // Learning Course Builder route - specific route for Add Section redirect
  if (module === 'lmsAuthor' && feature === 'courses-builder') {
    console.log('Matched Learning Course Builder route:', feature);
    return <LearningCourseBuilder />;
  }

  // Course Builder route - fallback for dynamic IDs (courses-*-builder)
  if (module === 'lmsAuthor' && feature && feature.includes('courses') && feature.includes('builder')) {
    console.log('Matched Course Builder route (dynamic):', feature);
    return <CourseBuilder />;
  }

  // Add Section route - simple static route
  if (module === 'lmsAuthor' && feature === 'courses-add-section') {
    console.log('Matched Add Section route:', feature);
    return <AddSectionPage
      onBack={() => navigate('/dashboard/lmsAuthor/courses')}
      onSave={(data) => {
        console.log('Section saved:', data);
        // Navigate to the learning CourseBuilder (with Module 1 and lesson types)
        navigate('/dashboard/lmsAuthor/courses-builder');
      }}
    />;
  }

  // Live Sessions route
  if (module === 'lmsAuthor' && feature === 'live-sessions') {
    console.log('Matched Live Sessions route:', feature);
    console.log('Live Sessions - module:', module, 'feature:', feature);
    return <LiveSessions />;
  }

  // Course Preview route - simple static route
  if (module === 'lmsAuthor' && feature === 'course-preview') {
    console.log('Matched Course Preview route:', feature);
    return <CoursePreview />;
  }

  // Lesson Editor routes - simple static routes
  if (module === 'lmsAuthor' && feature === 'lesson-video') {
    console.log('Matched Video Lesson Editor route:', feature);
    return <VideoLessonEditor />;
  }

  if (module === 'lmsAuthor' && feature === 'lesson-text') {
    console.log('Matched Text Lesson Editor route:', feature);
    return <TextLessonEditor />;
  }

  if (module === 'lmsAuthor' && feature === 'lesson-pdf') {
    console.log('Matched PDF Lesson Editor route:', feature);
    return <TextLessonEditor />; // Using TextLessonEditor as placeholder for PDF
  }

  if (module === 'lmsAuthor' && feature === 'lesson-audio') {
    console.log('Matched Audio Lesson Editor route:', feature);
    return <VideoLessonEditor />; // Using VideoLessonEditor as placeholder for Audio
  }

  if (module === 'lmsAuthor' && feature === 'lesson-quiz') {
    console.log('Matched Quiz Lesson Editor route:', feature);
    return <QuizEditor />;
  }

  if (module === 'lmsAuthor' && feature === 'lesson-assignment') {
    console.log('Matched Assignment Lesson Editor route:', feature);
    return <AssignmentEditor />;
  }

  // LMS Admin module routes
  if (module === 'lmsAdmin' && feature === 'dashboard') {
    return <GenericFeatureUI moduleName="LMS Admin" featureName="Dashboard" />;
  }

  if (module === 'lmsAdmin' && feature === 'user-management') {
    return <GenericFeatureUI moduleName="LMS Admin" featureName="User Management" />;
  }

  if (module === 'lmsAdmin' && feature === 'course-management') {
    return <CourseManagement />;
  }

  // Handle course detail view routes
  if (module === 'lmsAdmin' && feature === 'course-detail') {
    console.log('Matched course detail route:', feature);
    return <CourseDetailView />;
  }

  if (module === 'lmsAdmin' && feature === 'learner-detail') {
    return <LearnerDetailView />;
  }

  if (module === 'lmsAdmin' && feature === 'bulk-enrollment') {
    return <BulkEnrollment />;
  }

  if (module === 'lmsAdmin' && feature === 'learner-management') {
    return <LearnerManagement />;
  }

  if (module === 'lmsAdmin' && feature === 'reports-analytics') {
    return <ReportsAnalytics />;
  }

  if (module === 'lmsAdmin' && feature === 'media-library') {
    return <LMSAdminMediaLibrary />;
  }

  if (module === 'lmsAdmin' && feature === 'accessibility-flags') {
    return <AccessibilityFlags />;
  }

  if (module === 'lmsAdmin' && feature === 'help-center') {
    return <HelpCenter />;
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

  // HR Management routes
  if (module === 'hr' && feature === 'people-management') {
    return <PeopleManagement />;
  }

  if (module === 'hr' && feature === 'staff-detail') {
    return <StaffDetailView />;
  }

  if (module === 'hr' && feature === 'volunteer-profile') {
    return <VolunteerProfile />;
  }

  if (module === 'hr' && feature === 'board-member-detail') {
    return <BoardMemberDetailView />;
  }

  if (module === 'hr' && feature === 'meeting-details') {
    return <MeetingDetails />;
  }

  if (module === 'hr' && feature === 'recruitment-onboarding') {
    return <RecruitmentOnboarding />;
  }

  if (module === 'hr' && feature === 'requisition-detail') {
    return <RequisitionDetailView />;
  }

  if (module === 'hr' && feature === 'reference-check-detail') {
    return <ReferenceCheckDetailView />;
  }

  if (module === 'hr' && feature === 'performance-management') {
    return <PerformanceManagement />;
  }

  if (module === 'hr' && feature === 'learning-development') {
    return <LearningDevelopment />;
  }

  if (module === 'hr' && feature === 'compensation-policies') {
    return <CompensationPolicies />;
  }

  if (module === 'hr' && feature === 'exits') {
    return <Exits />;
  }

  if (module === 'hr' && feature === 'start-exit') {
    return <StartExit />;
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