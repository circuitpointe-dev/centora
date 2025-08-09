import React from 'react';
import { moduleConfigs } from '@/config/moduleConfigs';

const StepModules = ({ formData, onChange }: { 
  formData: any, 
  onChange: (field: string, value: any) => void 
}) => {
  const moduleEntries = Object.entries(moduleConfigs);
  const enabledKeys = new Set(['fundraising', 'documents']);

  const handleToggle = (moduleName: string, enabled: boolean, checked: boolean) => {
    if (!enabled) return;
    const updated = checked
      ? [...formData.modules, moduleName]
      : formData.modules.filter((m: string) => m !== moduleName);
    onChange('modules', updated);
  };

  return (
    <div className="space-y-3 p-2">
      <p className="text-xs text-gray-500">Select the modules your organization needs:</p>
      <div className="grid grid-cols-2 gap-2">
        {moduleEntries.map(([key, cfg]) => {
          const enabled = enabledKeys.has(key);
          const name = cfg.name;
          const checked = formData.modules.includes(name);
          return (
            <div key={key} className="flex items-center">
              <input
                type="checkbox"
                id={`module-${key}`}
                checked={checked}
                disabled={!enabled}
                onChange={(e) => handleToggle(name, enabled, e.target.checked)}
                className="h-3.5 w-3.5 text-violet-600 rounded border-gray-300 focus:ring-violet-500 disabled:opacity-50"
              />
              <label
                htmlFor={`module-${key}`}
                className={`ml-2 text-xs ${enabled ? 'text-gray-700' : 'text-gray-400'}`}
                title={enabled ? '' : 'Coming soon'}
              >
                {name} {!enabled && '(Coming soon)'}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepModules;
