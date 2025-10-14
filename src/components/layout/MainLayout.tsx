
import React, { useState, useEffect } from "react";
import { Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "@/contexts/AuthContext";

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { module } = useParams();
  const { user } = useAuth();
  const subscribedModules = user?.subscribedModules || [];
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    // Redirect if user doesn't have access to current module
    // Allow lmsAuthor and lmsAdmin for testing
    const allowedTestModules = ['lmsAuthor', 'lmsAdmin'];
    if (user && module && !subscribedModules.includes(module) && !allowedTestModules.includes(module)) {
      const firstModule = subscribedModules[0];
      if (firstModule) {
        navigate(`/dashboard/${firstModule}/dashboard`);
      } else {
        // Fallback to a safe default module when none assigned yet
        navigate(`/dashboard/fundraising/dashboard`);
      }
    }
  }, [user, module, subscribedModules, navigate]);

  useEffect(() => {
    // If we're on a module root (like /dashboard/grants), redirect to dashboard
    if (location.pathname === `/dashboard/${module}`) {
      navigate(`/dashboard/${module}/dashboard`, { replace: true });
    }
  }, [location.pathname, module, navigate]);

  if (!user || !module) {
    return null;
  }

  // Check if user has access to the current module
  // Allow lmsAuthor and lmsAdmin for testing
  const allowedTestModules = ['lmsAuthor', 'lmsAdmin'];
  if (!subscribedModules.includes(module) && !allowedTestModules.includes(module)) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar
        currentModule={module}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <div
        className={`flex-1 min-w-0 flex flex-col transition-all duration-300 ${isCollapsed ? "lg:ml-16" : "lg:ml-16 xl:ml-64"
          }`}
      >
        <Header sidebarCollapsed={isCollapsed} />
        <main className="flex-1 min-w-0 overflow-y-auto pt-20 p-6 space-y-6 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
