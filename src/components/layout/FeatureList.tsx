
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { moduleConfigs, getRoleBasedModuleConfig } from '@/config/moduleConfigs';
import { useAuth } from '@/contexts/AuthContext';

interface FeatureListProps {
  currentModule: string;
  isCollapsed: boolean;
  onFeatureClick: (featureId: string) => void;
}

const FeatureList = ({ currentModule, isCollapsed, onFeatureClick }: FeatureListProps) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Get role-based module configuration
  const currentModuleConfig = user?.userType && currentModule === 'grants' 
    ? getRoleBasedModuleConfig(currentModule, user.userType)
    : moduleConfigs[currentModule as keyof typeof moduleConfigs];

  if (!currentModuleConfig) return null;

  return (
    <div className="p-4 space-y-2 h-full overflow-y-auto">
      {currentModuleConfig.features.map((feature) => {
        const isActive = location.pathname.includes(`/${currentModule}/${feature.id}`);
        
        return (
          <Button
            key={feature.id}
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start text-left font-light",
              isCollapsed ? "px-2" : "px-3",
              isActive && "bg-blue-50 text-blue-700 border border-blue-200"
            )}
            onClick={() => onFeatureClick(feature.id)}
          >
            <feature.icon className={cn("h-4 w-4", isCollapsed ? "" : "mr-3")} />
            {!isCollapsed && <span className="text-sm font-light">{feature.name}</span>}
          </Button>
        );
      })}
    </div>
  );
};

export default FeatureList;
