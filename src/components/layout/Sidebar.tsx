
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Grid3X3, ChevronUp, ArrowRight, Menu } from 'lucide-react';
import { moduleConfigs } from '@/config/moduleConfigs';
import SidebarHeader from './SidebarHeader';
import FeatureList from './FeatureList';
import ModuleSwitcher from './ModuleSwitcher';

interface SidebarProps {
  currentModule: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar = ({ currentModule, isCollapsed, onToggleCollapse }: SidebarProps) => {
  const navigate = useNavigate();
  const [showModuleSwitcher, setShowModuleSwitcher] = useState(false);
  
  const currentModuleConfig = moduleConfigs[currentModule as keyof typeof moduleConfigs];
  
  const handleFeatureClick = (featureId: string) => {
    navigate(`/dashboard/${currentModule}/${featureId}`);
  };
  
  const handleModuleSwitch = (moduleId: string) => {
    navigate(`/dashboard/${moduleId}/dashboard`);
    setShowModuleSwitcher(false);
  };

  const toggleModuleSwitcher = () => {
    setShowModuleSwitcher(!showModuleSwitcher);
  };

  if (!currentModuleConfig) return null;

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
      "fixed left-0 top-0 h-screen z-30",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Logo and Brand Header */}
      <div className="p-4 border-b border-gray-200 shrink-0">
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center space-x-3", isCollapsed && "justify-center")}>
            <img
                  src={black_logo}
                  alt="Orbit ERP Logo"
                  className="h-8 w-auto"
                />
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-gray-900">Orbit ERP</h1>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className={cn("h-8 w-8 p-0", isCollapsed && "ml-0")}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Current Module Header */}
      <SidebarHeader currentModule={currentModule} isCollapsed={isCollapsed} />

      {/* Content Area - Either Features or Module Switcher */}
      <div className="flex-1 overflow-auto min-h-0">
        {!showModuleSwitcher ? (
          <FeatureList 
            currentModule={currentModule}
            isCollapsed={isCollapsed}
            onFeatureClick={handleFeatureClick}
          />
        ) : (
          <ModuleSwitcher
            currentModule={currentModule}
            isCollapsed={isCollapsed}
            onModuleSwitch={handleModuleSwitch}
          />
        )}
      </div>

      {/* Module Switcher Toggle - Fixed to bottom */}
      <div className="border-t border-gray-200 p-4 shrink-0">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-left font-light",
            isCollapsed ? "px-2" : "px-3"
          )}
          onClick={toggleModuleSwitcher}
        >
          {showModuleSwitcher ? (
            <>
              <ChevronUp className={cn("h-4 w-4", isCollapsed ? "" : "mr-3")} />
              {!isCollapsed && <span className="text-sm font-light">Back to Features</span>}
            </>
          ) : (
            <>
              <Grid3X3 className={cn("h-4 w-4", isCollapsed ? "" : "mr-3")} />
              {!isCollapsed && (
                <>
                  <span className="text-sm font-light flex-1">Switch Module</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
