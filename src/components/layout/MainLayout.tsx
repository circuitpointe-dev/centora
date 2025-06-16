
import React, { useState, useEffect } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "@/contexts/AuthContext";

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { module } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    // Redirect if user doesn't have access to current module
    if (user && module && !user.subscribedModules.includes(module)) {
      const firstModule = user.subscribedModules[0];
      if (firstModule) {
        navigate(`/dashboard/${firstModule}/dashboard`);
      }
    }
  }, [user, module, navigate]);

  if (!user || !module) {
    return null;
  }

  // Check if user has access to the current module
  if (!user.subscribedModules.includes(module)) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar
        currentModule={module}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? "md:ml-16" : "md:ml-16 lg:ml-64"
        }`}
      >
        <Header sidebarCollapsed={isCollapsed} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
