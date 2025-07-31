
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { moduleConfigs } from '@/config/moduleConfigs';
import { useAuth } from '@/contexts/SupabaseAuthContext';

interface ModuleSwitcherProps {
  currentModule: string;
  isCollapsed: boolean;
  onModuleSwitch: (moduleId: string) => void;
}

const ModuleSwitcher = ({ currentModule, isCollapsed, onModuleSwitch }: ModuleSwitcherProps) => {
  const { user, userType, subscribedModules } = useAuth();

  if (!user) return null;

  // Filter modules based on user's subscriptions
  const availableModules = subscribedModules.filter(moduleId => 
    moduleConfigs[moduleId as keyof typeof moduleConfigs]
  );

  const isDonor = userType === 'Donor';

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        {!isCollapsed && (
          <div className="mb-3">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Switch Module
            </h3>
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
                  ? "bg-violet-700 text-white hover:bg-violet-800" 
                  : "hover:bg-violet-100 hover:text-violet-900"
              )}
              onClick={() => onModuleSwitch(moduleId)}
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
