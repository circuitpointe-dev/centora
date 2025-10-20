// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

import Index from "./components/pages/Index";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import DashboardPage from "./components/pages/DashboardPage";
import GenericFeaturePage from "./components/pages/GenericFeaturePage";
import SuccessionCandidatePerformanceView from "./components/hr/SuccessionCandidatePerformanceView";
import VendorManagementPage from "./components/vendor/VendorManagementPage";
import VendorProfilePage from "./components/vendor/VendorProfilePage";
import VendorContractDetailPage from "./components/vendor/VendorContractDetailPage";
import VendorClassificationPage from "./components/vendor/VendorClassificationPage";
import ManualProposalCreationPage from "./components/pages/ManualProposalCreationPage";
import GrantViewPage from "./components/grants/view/GrantViewPage";
import CloseGrantPage from "./components/grants/view/CloseGrantPage";
import NGOGrantViewPage from "./components/grants/ngo/NGOGrantViewPage";
import NewGrantPage from "./components/grants/new/NewGrantPage";
import GrantReviewPage from "./components/grants/new/GrantReviewPage";
import { RequestSignatureWizardPage } from "./components/documents/e-signature/RequestSignatureWizardPage";
import { DocumentEditorPage } from "./components/documents/e-signature/DocumentEditorPage";
import EditorNewPage from "./components/documents/e-signature-new/EditorNewPage";
import { GrantsOverviewPage } from "./components/grants/pages/GrantsOverviewPage";
import PDFSigningPlatform from "./components/documents/pdf-signing-platform/PDFSigningPlatform";
import ProfessionalPDFEditor from "./components/documents/pdf-signing-platform/ProfessionalPDFEditor";
import DocumentSettingsPage from "./components/documents/settings/DocumentSettingsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Public: Landing */}
        <Route path="/" element={<Index />} />

        {/* Public: Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Public: Register (dedicated OAuth-based signup page) */}
        <Route path="/signup" element={<SignupPage />} />


        {/* Legacy register route redirect */}
        <Route path="/register" element={<Navigate to="/signup" replace />} />

        {/* Protected: Manual Proposal Creation */}
        <Route
          path="/dashboard/fundraising/manual-proposal-creation"
          element={
            <ProtectedRoute>
              <ManualProposalCreationPage />
            </ProtectedRoute>
          }
        />

        {/* Protected: Close Grant Page */}
        <Route
          path="/dashboard/grants/close/:grantId"
          element={
            <ProtectedRoute>
              <CloseGrantPage />
            </ProtectedRoute>
          }
        />

        {/* Protected: Request Signature Wizard */}
        <Route
          path="/dashboard/documents/request-signature"
          element={
            <ProtectedRoute>
              <RequestSignatureWizardPage />
            </ProtectedRoute>
          }
        />

        {/* Protected: Document Editor */}
        <Route
          path="/dashboard/documents/document-editor"
          element={
            <ProtectedRoute>
              <DocumentEditorPage />
            </ProtectedRoute>
          }
        />

        {/* Protected: Signature Editor */}
        <Route
          path="/dashboard/documents/signature-editor"
          element={
            <ProtectedRoute>
              <EditorNewPage />
            </ProtectedRoute>
          }
        />

        {/* Protected: Grants Overview Page */}
        <Route
          path="/dashboard/grants/overview"
          element={
            <ProtectedRoute>
              <GrantsOverviewPage />
            </ProtectedRoute>
          }
        />

        {/* Protected: PDF Signing Platform */}
        <Route
          path="/dashboard/documents/pdf-signing-platform"
          element={
            <ProtectedRoute>
              <PDFSigningPlatform />
            </ProtectedRoute>
          }
        />

        {/* Protected: Professional PDF Editor */}
        <Route
          path="/dashboard/documents/pdf-signing-platform/editor/:documentId"
          element={
            <ProtectedRoute>
              <ProfessionalPDFEditor />
            </ProtectedRoute>
          }
        />

        {/* Protected: Document Settings */}
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute>
              <DocumentSettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Protected: Dashboard + Features */}
        <Route
          path="/dashboard/:module"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard page - no longer redirect by default */}
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Grant View - nested within dashboard structure */}
          <Route path="view/:grantId" element={<GrantViewPage />} />

          {/* NGO Grant View - nested within dashboard structure */}
          <Route path="ngo-view/:grantId" element={<NGOGrantViewPage />} />

          {/* New Grant - nested within dashboard structure */}
          <Route path="new" element={<NewGrantPage />} />

          {/* Grant Review - nested within dashboard structure */}
          <Route path="review" element={<GrantReviewPage />} />

          {/* Other features */}
          <Route path=":feature" element={<GenericFeaturePage />} />
          {/* HR: Succession candidate performance (page) */}
          <Route path="succession/candidate-performance" element={<SuccessionCandidatePerformanceView onBack={() => history.back()} candidateName="Alex Bello" />} />
          {/* Procurement → Vendor Management dedicated routes */}
          <Route path="vendor-management" element={<VendorManagementPage />} />
          <Route path="vendor-classification" element={<VendorClassificationPage />} />
          <Route path="vendors/:vendorId" element={<VendorProfilePage />} />
          <Route path="vendors/:vendorId/contracts/:contractId" element={<VendorContractDetailPage />} />
        </Route>

        {/* Catch-all: send anything else back to "/" */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </AuthProvider>
);

export default App;
