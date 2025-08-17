
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { moduleConfigs } from '@/config/moduleConfigs';
import { useAuth } from '@/contexts/AuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface FeatureListProps {
  currentModule: string;
  isCollapsed: boolean;
  onFeatureClick: (featureId: string) => void;
}

const FeatureList = ({ currentModule, isCollapsed, onFeatureClick }: FeatureListProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const userType = user?.userType;
  const currentModuleConfig = moduleConfigs[currentModule as keyof typeof moduleConfigs];

  if (!currentModuleConfig || !user) return null;

  // Get the appropriate features based on user type
  const getFeatures = () => {
    if (currentModule === 'grants') {
      const isDonor = userType === 'Donor';
      return isDonor ? currentModuleConfig.donorFeatures : currentModuleConfig.ngoFeatures;
    }
    if (currentModule === 'users') {
      const isSuperAdmin = user?.is_super_admin;
      return isSuperAdmin ? currentModuleConfig.superAdminFeatures : currentModuleConfig.adminFeatures;
    }
    return currentModuleConfig.features;
  };

  // Feature descriptions for tooltips
  const getFeatureDescription = (featureId: string) => {
    const descriptions: { [key: string]: string } = {
      // Admin features
      'user-accounts': 'Manage user accounts, profiles, and access within your organization',
      'roles-permissions': 'Define and assign user roles with specific permissions and access levels',
      'subscription-billing': 'View and manage your organization\'s subscription plans and billing information',
      
      // Super Admin features
      'super-admin-users': 'Manage system administrator accounts with elevated privileges',
      'announcements': 'Create and manage system-wide announcements for all users',
      'client-directory': 'View and manage all client organizations using the platform',
      'module-settings': 'Configure and manage system modules and their availability',
      'audit-logs': 'View comprehensive system activity logs and security events',
      'integrations': 'Manage third-party integrations and API connections',
      'subscriptions-billing': 'Oversee all client subscriptions, billing, and payment processing',
      'support-tickets': 'Manage customer support requests and technical issues',
    };
    return descriptions[featureId];
  };

  const features = getFeatures();

  return (
    <TooltipProvider>
      <div className="p-4 space-y-2 h-full overflow-y-auto">
        {features?.map((feature) => {
          // Enhanced route matching logic
          const isActive = (() => {
            const currentPath = location.pathname;
            
            if (feature.id === 'dashboard') {
              // For dashboard, check all possible dashboard routes
              const dashboardPaths = [
                `/dashboard/${currentModule}`,
                `/dashboard/${currentModule}/`,
                `/dashboard/${currentModule}/dashboard`,
                `/dashboard/${currentModule}/dashboard/`
              ];
              return dashboardPaths.some(path => currentPath === path);
            } else {
              // For other features, check if the route includes the feature id
              return currentPath.includes(`/${currentModule}/${feature.id}`);
            }
          })();

          const description = getFeatureDescription(feature.id);
          
          return (
            <div key={feature.id} className="relative">
              <Button
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
                {!isCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-light">{feature.name}</span>
                    {description && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className={cn(
                            "h-3 w-3 ml-2 opacity-60 hover:opacity-100 transition-opacity",
                            isActive ? "text-white" : "text-gray-500"
                          )} />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="text-sm">{description}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default FeatureList;
