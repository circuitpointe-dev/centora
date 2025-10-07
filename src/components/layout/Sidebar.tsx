// src/components/layout/Sidebar.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Grid3X3, ChevronUp, ArrowRight, Menu, X } from "lucide-react";
import { moduleConfigs } from "@/config/moduleConfigs";
import SidebarHeader from "./SidebarHeader";
import FeatureList from "./FeatureList";
import ModuleSwitcher from "./ModuleSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { getDefaultFeatureForModule } from "@/utils/defaultFeature";
import violet_logo from "@/assets/images/logo_violet.png";

interface SidebarProps {
  currentModule: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar = ({ currentModule, isCollapsed, onToggleCollapse }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const subscribedModules = user?.subscribedModules || [];
  const [showModuleSwitcher, setShowModuleSwitcher] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const currentModuleConfig =
    moduleConfigs[currentModule as keyof typeof moduleConfigs];

  const handleFeatureClick = (featureId: string) => {
    const [path, query] = featureId.split("?");
    const url = `/dashboard/${currentModule}/${path}${query ? `?${query}` : ""}`;
    navigate(url);
    setIsMobileOpen(false);
  };

  const handleModuleSwitch = (moduleId: string) => {
    const def = getDefaultFeatureForModule(moduleId, user);
    navigate(`/dashboard/${moduleId}/${def}`);
    setShowModuleSwitcher(false);
    setIsMobileOpen(false);
  };

  const toggleModuleSwitcher = () => setShowModuleSwitcher((v) => !v);

  if (!currentModuleConfig || !user) return null;

  // Guard: if user cannot access current module, kick to first accessible module's default feature
  const hasAccess = subscribedModules.includes(currentModule);
  if (!hasAccess) {
    const firstModule = subscribedModules[0];
    if (firstModule) {
      const def = getDefaultFeatureForModule(firstModule, user);
      navigate(`/dashboard/${firstModule}/${def}`);
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
          "fixed top-4 left-4 z-30 h-8 w-8 p-0 lg:hidden",
          isMobileOpen && "hidden"
        )}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "bg-sidebar-background border-r border-sidebar-border flex flex-col transition-all duration-300",
          // Mobile: hidden by default, full screen when open
          "fixed left-0 top-0 h-screen z-50",
          // Mobile behavior - hidden until large screens
          "hidden lg:flex",
          isMobileOpen ? "flex w-full" : "",
          // Desktop behavior - collapsed by default, expanded only on large screens when not collapsed
          !isCollapsed ? "lg:w-16 xl:w-64" : "lg:w-16"
        )}
      >
        {/* Mobile Close Button */}
        {isMobileOpen && (
          <div className="lg:hidden p-4 border-b border-sidebar-border">
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
            "p-4 border-b border-sidebar-border shrink-0",
            isMobileOpen ? "block" : "hidden lg:block"
          )}
        >
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "flex items-center space-x-3",
                isCollapsed &&
                  !isMobileOpen &&
                  "justify-center lg:block xl:flex"
              )}
            >
              {(!isCollapsed || isMobileOpen) && (
                <div className="flex items-center space-x-3 animate-fade-in">
                  <img
                    src={violet_logo}
                    alt="Centora ERP Logo"
                    className="h-8 w-auto transition-opacity duration-300"
                  />
                </div>
              )}
            </div>
            <div className="hidden lg:flex">
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
        <div className={cn(isMobileOpen ? "block" : "hidden lg:block")}>
          <SidebarHeader
            currentModule={currentModule}
            isCollapsed={isCollapsed && !isMobileOpen}
          />
        </div>

        {/* Content Area - Either Features or Module Switcher */}
        <div className={cn("flex-1 overflow-auto min-h-0", isMobileOpen ? "block" : "hidden lg:block")}>
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
              isMobileOpen ? "block" : "hidden lg:block"
            )}
          >
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-left font-light bg-accent text-accent-foreground hover:bg-accent/80",
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
