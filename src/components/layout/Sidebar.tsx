import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Grid3X3, ChevronUp, ArrowRight, Menu, X } from "lucide-react";
import { moduleConfigs } from "@/config/moduleConfigs";
import SidebarHeader from "./SidebarHeader";
import FeatureList from "./FeatureList";
import ModuleSwitcher from "./ModuleSwitcher";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import black_logo from "@/assets/images/black_logo.png";
import violet_logo from "@/assets/images/logo_violet.png";

interface SidebarProps {
  currentModule: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar = ({
  currentModule,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) => {
  const navigate = useNavigate();
  const { user, subscribedModules } = useAuth();
  const [showModuleSwitcher, setShowModuleSwitcher] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const currentModuleConfig =
    moduleConfigs[currentModule as keyof typeof moduleConfigs];

  const handleFeatureClick = (featureId: string) => {
    const [path, query] = featureId.split("?");
    const url = `/dashboard/${currentModule}/${path}${
      query ? `?${query}` : ""
    }`;
    navigate(url);
    // Close mobile sidebar after navigation
    setIsMobileOpen(false);
  };

  const handleModuleSwitch = (moduleId: string) => {
    navigate(`/dashboard/${moduleId}/dashboard`);
    setShowModuleSwitcher(false);
    // Close mobile sidebar after navigation
    setIsMobileOpen(false);
  };

  const toggleModuleSwitcher = () => {
    setShowModuleSwitcher(!showModuleSwitcher);
  };

  if (!currentModuleConfig || !user) return null;

  // Check if user has access to current module
  const hasAccess = subscribedModules.includes(currentModule);
  if (!hasAccess) {
    // Redirect to first available module
    const firstModule = subscribedModules[0];
    if (firstModule) {
      navigate(`/dashboard/${firstModule}/dashboard`);
    }
    return null;
  }

  const canSwitchModules = subscribedModules.length > 1;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileOpen(true)}
        className={cn(
          "fixed top-4 left-4 z-30 h-8 w-8 p-0 md:hidden",
          isMobileOpen && "hidden"
        )}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
          // Mobile: hidden by default, full screen when open
          "fixed left-0 top-0 h-screen z-50",
          // Mobile behavior
          "hidden md:flex",
          isMobileOpen ? "flex w-full" : "",
          // Desktop behavior
          !isCollapsed ? "md:w-16 lg:w-64" : "md:w-16"
        )}
      >
        {/* Mobile Close Button */}
        {isMobileOpen && (
          <div className="md:hidden p-4 border-b border-gray-200">
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Logo and Brand Header */}
        <div
          className={cn(
            "p-4 border-b border-gray-200 shrink-0",
            isMobileOpen ? "block" : "hidden md:block"
          )}
        >
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "flex items-center space-x-3",
                isCollapsed &&
                  !isMobileOpen &&
                  "justify-center md:block lg:flex"
              )}
            >
              {(!isCollapsed || isMobileOpen) && (
                <div className="flex items-center space-x-3 animate-fade-in">
                  <img
                    src={violet_logo}
                    alt="Orbit ERP Logo"
                    className="h-8 w-auto transition-opacity duration-300"
                  />
                  <h1 className="text-lg font-bold text-gray-900 transition-opacity duration-300 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    Orbit
                  </h1>
                </div>
              )}
            </div>
            <div className="hidden md:flex">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                className="h-8 w-8 p-0 flex items-center justify-center"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Current Module Header */}
        <div className={cn(isMobileOpen ? "block" : "hidden md:block")}>
          <SidebarHeader
            currentModule={currentModule}
            isCollapsed={isCollapsed && !isMobileOpen}
          />
        </div>

        {/* Content Area - Either Features or Module Switcher */}
        <div
          className={cn(
            "flex-1 overflow-auto min-h-0",
            isMobileOpen ? "block" : "hidden md:block"
          )}
        >
          {!showModuleSwitcher ? (
            <FeatureList
              currentModule={currentModule}
              isCollapsed={isCollapsed && !isMobileOpen}
              onFeatureClick={handleFeatureClick}
            />
          ) : (
            <ModuleSwitcher
              currentModule={currentModule}
              isCollapsed={isCollapsed && !isMobileOpen}
              onModuleSwitch={handleModuleSwitch}
            />
          )}
        </div>

        {/* Module Switcher Toggle - Fixed to bottom */}
        {canSwitchModules && (
          <div
            className={cn(
              "border-t border-gray-200 p-4 shrink-0",
              isMobileOpen ? "block" : "hidden md:block"
            )}
          >
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-left font-light bg-violet-100 text-violet-900 hover:bg-violet-200",
                isCollapsed && !isMobileOpen ? "px-2" : "px-3"
              )}
              onClick={toggleModuleSwitcher}
            >
              {showModuleSwitcher ? (
                <>
                  <ChevronUp
                    className={cn(
                      "h-4 w-4",
                      isCollapsed && !isMobileOpen ? "" : "mr-3"
                    )}
                  />
                  {(!isCollapsed || isMobileOpen) && (
                    <span className="text-sm font-light">Back to Features</span>
                  )}
                </>
              ) : (
                <>
                  <Grid3X3
                    className={cn(
                      "h-4 w-4",
                      isCollapsed && !isMobileOpen ? "" : "mr-3"
                    )}
                  />
                  {(!isCollapsed || isMobileOpen) && (
                    <>
                      <span className="text-sm font-light flex-1">
                        Switch Module
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
