
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { moduleConfigs } from '@/config/moduleConfigs';
import { useAuth } from '@/contexts/AuthContext';

interface FeatureListProps {
  currentModule: string;
  isCollapsed: boolean;
  onFeatureClick: (featureId: string) => void;
}

const FeatureList = ({ currentModule, isCollapsed, onFeatureClick }: FeatureListProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const currentModuleConfig = moduleConfigs[currentModule as keyof typeof moduleConfigs];

  if (!currentModuleConfig || !user) return null;

  // Get the appropriate features based on user type for grants module
  const getFeatures = () => {
    if (currentModule === 'grants') {
      const isDonor = user.userType === 'Donor';
      return isDonor ? currentModuleConfig.donorFeatures : currentModuleConfig.ngoFeatures;
    }
    return currentModuleConfig.features;
  };

  const features = getFeatures();

  return (
    <div className="p-4 space-y-2 h-full overflow-y-auto">
      {features?.map((feature) => {
        // Simplified route matching logic
        const isActive = (() => {
          if (feature.id === 'dashboard') {
            // For dashboard, check if we're on the main module dashboard route
            return location.pathname === `/dashboard/${currentModule}` || 
                   location.pathname === `/dashboard/${currentModule}/dashboard`;
          } else {
            // For other features, check if the route includes the feature id
            return location.pathname.includes(`/${currentModule}/${feature.id}`);
          }
        })();
        
        return (
          <Button
            key={feature.id}
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start text-left font-light transition-colors",
              isCollapsed ? "px-2" : "px-3",
              isActive 
                ? "bg-violet-700 text-white hover:bg-violet-800" 
                : "hover:bg-violet-100 hover:text-violet-900"
            )}
            onClick={() => onFeatureClick(feature.id)}
          >
            <feature.icon className={cn(
              "h-4 w-4", 
              isCollapsed ? "" : "mr-3",
              isActive ? "text-white" : ""
            )} />
            {!isCollapsed && <span className="text-sm font-light">{feature.name}</span>}
          </Button>
        );
      })}
    </div>
  );
};

export default FeatureList;
