
import React from 'react';
import { cn } from '@/lib/utils';
import { moduleConfigs } from '@/config/moduleConfigs';

interface SidebarHeaderProps {
  currentModule: string;
  isCollapsed: boolean;
}

const SidebarHeader = ({ currentModule, isCollapsed }: SidebarHeaderProps) => {
  const currentModuleConfig = moduleConfigs[currentModule as keyof typeof moduleConfigs];

  if (!currentModuleConfig) return null;

  return (
    <div className="p-4 border-b border-gray-200 shrink-0">
      <div className="flex items-center space-x-3">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100", currentModuleConfig.color)}>
          <currentModuleConfig.icon className="h-5 w-5" />
        </div>
        {!isCollapsed && (
          <div>
            <h2 className="font-medium text-gray-900 text-lg">{currentModuleConfig.name}</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarHeader;
