import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';

// Components
import Index from '@/components/pages/Index';
import LoginPage from '@/components/auth/LoginPage';
import RegistrationModal from '@/components/auth/RegistrationModal';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Dashboard Pages
import DashboardPage from '@/components/pages/DashboardPage';
import DonorManagementPage from '@/components/pages/DonorManagementPage';
import OpportunityTrackingPage from '@/components/pages/OpportunityTrackingPage';
import ProposalManagementPage from '@/components/pages/ProposalManagementPage';
import ManualProposalCreationPage from '@/components/pages/ManualProposalCreationPage';
import FundraisingAnalyticsPage from '@/components/pages/FundraisingAnalyticsPage';
import GenericFeaturePage from '@/components/pages/GenericFeaturePage';

const queryClient = new QueryClient();

// Wrapper component for Registration that has access to navigate
const RegistrationWrapper = () => {
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate('/login');
  };

  return <RegistrationModal onClose={handleClose} />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Toaster />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegistrationWrapper />} />
              
              {/* Protected Routes */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                
                {/* Fundraising Module Routes */}
                <Route path="fundraising/donors" element={<DonorManagementPage />} />
                <Route path="fundraising/opportunities" element={<OpportunityTrackingPage />} />
                <Route path="fundraising/proposal-management" element={<ProposalManagementPage />} />
                <Route path="fundraising/manual-proposal-creation" element={<ManualProposalCreationPage />} />
                <Route path="fundraising/fundraising-analytics" element={<FundraisingAnalyticsPage />} />
                
                {/* Other module routes */}
                <Route path=":module/:feature" element={<GenericFeaturePage />} />
                <Route path=":module" element={<GenericFeaturePage />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
