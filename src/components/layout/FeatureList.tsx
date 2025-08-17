// src/components/layout/FeatureList.tsx
import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { moduleConfigs } from "@/config/moduleConfigs";
import { useAuth } from "@/contexts/AuthContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EnhancedTooltip } from "@/components/ui/enhanced-tooltip";
import { Info } from "lucide-react";

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

  const getFeatures = () => {
    if (currentModule === "grants") {
      const isDonor = userType === "Donor";
      return isDonor ? currentModuleConfig.donorFeatures : currentModuleConfig.ngoFeatures;
    }
    if (currentModule === "users") {
      const isSuperAdmin = user?.is_super_admin;
      return isSuperAdmin ? currentModuleConfig.superAdminFeatures : currentModuleConfig.adminFeatures;
    }
    return currentModuleConfig.features;
  };

  const features = getFeatures();

  // Grab :feature segment from the URL safely
  const pathParts = location.pathname.split("?")[0].split("/").filter(Boolean); // ['dashboard', ':module', ':feature?']
  const activeFeature = pathParts[2] || ""; // if missing, Sidebar effect will redirect

  const getFeatureDescription = (featureId: string) => {
    const map: Record<string, string> = {
      "user-accounts": "Manage user accounts, profiles, and access within your organization",
      "roles-permissions": "Define and assign user roles with specific permissions and access levels",
      "subscription-billing": "View and manage your organization's subscription plans and billing information",
      "super-admin-users": "Manage system administrator accounts with elevated privileges",
      "announcements": "Create and manage system-wide announcements for all users",
      "client-directory": "View and manage all client organizations using the platform",
      "module-settings": "Configure and manage system modules and their availability",
      "audit-logs": "View comprehensive system activity logs and security events",
      "integrations": "Manage third-party integrations and API connections",
      "subscriptions-billing": "Oversee all client subscriptions, billing, and payment processing",
      "support-tickets": "Manage customer support requests and technical issues",
    };
    return map[featureId];
  };

  return (
    <TooltipProvider>
      <div className="p-4 space-y-2 h-full overflow-y-auto">
        {features?.map((feature) => {
          const isActive = activeFeature === feature.id;
          const description = getFeatureDescription(feature.id);

          return (
            <div key={feature.id} className="relative">
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-left font-light transition-colors",
                  isCollapsed ? "px-2" : "px-3",
                  isActive ? "bg-violet-700 text-white hover:bg-violet-800" : "hover:bg-violet-100 hover:text-violet-900"
                )}
                onClick={() => onFeatureClick(feature.id)}
              >
                <feature.icon
                  className={cn("h-4 w-4", isCollapsed ? "" : "mr-3", isActive ? "text-white" : "")}
                />
                {!isCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-light">{feature.name}</span>

                    {description && currentModule === "users" && (
                      <EnhancedTooltip content={description}>
                        <button type="button" className="flex items-center">
                          <Info
                            className={cn(
                              "h-3 w-3 ml-2 opacity-60 hover:opacity-100 transition-opacity",
                              isActive ? "text-white" : "text-gray-500"
                            )}
                          />
                        </button>
                      </EnhancedTooltip>
                    )}

                    {description && currentModule !== "users" && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="flex items-center">
                            <Info
                              className={cn(
                                "h-3 w-3 ml-2 opacity-60 hover:opacity-100 transition-opacity",
                                isActive ? "text-white" : "text-gray-500"
                              )}
                            />
                          </button>
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
