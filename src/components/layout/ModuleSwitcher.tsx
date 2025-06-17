
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { moduleConfigs } from '@/config/moduleConfigs';
import { useAuth } from '@/contexts/AuthContext';

interface ModuleSwitcherProps {
  currentModule: string;
  isCollapsed: boolean;
  onModuleSwitch: (moduleId: string) => void;
}

const ModuleSwitcher = ({ currentModule, isCollapsed, onModuleSwitch }: ModuleSwitcherProps) => {
  const { user } = useAuth();

  if (!user) return null;

  // Filter modules based on user's subscriptions
  const availableModules = user.subscribedModules.filter(moduleId => 
    moduleConfigs[moduleId as keyof typeof moduleConfigs]
  );

  const isDonor = user.userType === 'Donor';

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        {!isCollapsed && (
          <div className="mb-3">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              {isDonor ? "Available Module" : "Switch Module"}
            </h3>
            {isDonor && (
              <p className="text-xs text-gray-400 mb-2">
                Donors have access to Grants Management only
              </p>
            )}
          </div>
        )}
        {availableModules.map((moduleId) => {
          const module = moduleConfigs[moduleId as keyof typeof moduleConfigs];
          if (!module) return null;
          
          const isCurrentModule = moduleId === currentModule;
          
          return (
            <Button
              key={moduleId}
              variant={isCurrentModule ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-left font-light transition-colors",
                isCollapsed ? "px-2" : "px-3",
                isCurrentModule 
                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                  : "hover:bg-blue-100 hover:text-blue-900",
                isDonor && !isCurrentModule && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => {
                if (!isDonor || isCurrentModule) {
                  onModuleSwitch(moduleId);
                }
              }}
              disabled={isDonor && !isCurrentModule}
            >
              <module.icon className={cn("h-4 w-4", module.color, isCollapsed ? "" : "mr-3")} />
              {!isCollapsed && <span className="text-sm font-light">{module.name}</span>}
            </Button>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default ModuleSwitcher;
