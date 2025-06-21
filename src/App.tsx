// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "./components/pages/Index";
import LoginPage from "./components/auth/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import DashboardPage from "./components/pages/DashboardPage";
import GenericFeaturePage from "./components/pages/GenericFeaturePage";
import ManualProposalCreationPage from "./components/pages/ManualProposalCreationPage";
import GrantViewPage from "./components/grants/view/GrantViewPage";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public: Landing */}
            <Route path="/" element={<Index />} />

            {/* Public: Login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Public: Register (also shows LoginPage, but auto-opens modal) */}
            <Route path="/register" element={<LoginPage />} />

            {/* Protected: Manual Proposal Creation */}
            <Route
              path="/dashboard/fundraising/manual-proposal-creation"
              element={
                <ProtectedRoute>
                  <ManualProposalCreationPage />
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
              
              {/* Other features */}
              <Route path=":feature" element={<GenericFeaturePage />} />
            </Route>

            {/* Catch-all: send anything else back to "/" */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
