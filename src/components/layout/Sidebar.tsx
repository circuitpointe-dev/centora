
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Grid3X3, ChevronUp } from 'lucide-react';
import { moduleConfigs } from '@/config/moduleConfigs';
import SidebarHeader from './SidebarHeader';
import FeatureList from './FeatureList';
import ModuleSwitcher from './ModuleSwitcher';

interface SidebarProps {
  currentModule: string;
  isCollapsed: boolean;
}

const Sidebar = ({ currentModule, isCollapsed }: SidebarProps) => {
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
      "h-[100vh]",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Current Module Header */}
      <SidebarHeader currentModule={currentModule} isCollapsed={isCollapsed} />

      {/* Content Area - Either Features or Module Switcher */}
      <div className="flex-1 overflow-hidden">
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

      {/* Module Switcher Toggle */}
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
              {!isCollapsed && <span className="text-sm font-light">Switch Module</span>}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
