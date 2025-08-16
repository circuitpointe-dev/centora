import React from 'react';
import { moduleConfigs } from '@/config/moduleConfigs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
const StepModules = ({ formData, onChange }: { 
  formData: any, 
  onChange: (field: string, value: any) => void 
}) => {
  const moduleEntries = Object.entries(moduleConfigs);
  const enabledKeys = new Set(['fundraising', 'documents', 'users']);
  const [openKey, setOpenKey] = React.useState<string | null>(null);
  const handleToggle = (moduleKey: string, enabled: boolean, checked: boolean) => {
    if (!enabled) return;
    const updated = checked
      ? [...formData.modules, moduleKey]
      : formData.modules.filter((m: string) => m !== moduleKey);
    onChange('modules', updated);
  };

  return (
    <div className="space-y-3 p-2">
      <p className="text-xs text-gray-500">Select the modules your organization needs:</p>
      <div className="grid grid-cols-2 gap-2">
        {moduleEntries.map(([key, cfg]) => {
          const enabled = enabledKeys.has(key);
          const name = cfg.name;
          const checked = formData.modules.includes(key);
          return (
            <Tooltip key={key} open={openKey === key}>
              <TooltipTrigger asChild>
                <div
                  className="flex items-center"
                  onClick={
                    enabled
                      ? undefined
                      : (e) => {
                          e.preventDefault();
                          setOpenKey(key);
                          window.setTimeout(() => setOpenKey(null), 1200);
                        }
                  }
                  role={enabled ? undefined : 'button'}
                  tabIndex={enabled ? -1 : 0}
                  onKeyDown={
                    enabled
                      ? undefined
                      : (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setOpenKey(key);
                            window.setTimeout(() => setOpenKey(null), 1200);
                          }
                        }
                  }
                >
          <input
            type="checkbox"
            id={`module-${key}`}
            checked={checked}
            disabled={!enabled}
            onChange={(e) => handleToggle(key, enabled, e.target.checked)}
            className="h-3.5 w-3.5 text-violet-600 rounded border-gray-300 focus:ring-violet-500 disabled:opacity-50"
          />
                  <label
                    htmlFor={`module-${key}`}
                    className={`ml-2 text-xs ${enabled ? 'text-gray-700' : 'text-gray-400'}`}
                  >
                    {name}
                  </label>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">Coming soon</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default StepModules;
