import React from 'react';

const StepModules = ({ formData, onChange }: { 
  formData: any, 
  onChange: (field: string, value: any) => void 
}) => {
  const modules = [
    'Fundraising',
    'Donor Management',
    'Grant Management',
    'Program Management',
    'Financial Reporting'
  ];

  return (
    <div className="space-y-3 p-2">
      <p className="text-xs text-gray-500">Select the modules your organization needs:</p>
      <div className="space-y-2">
        {modules.map(module => (
          <div key={module} className="flex items-center">
            <input
              type="checkbox"
              id={`module-${module}`}
              checked={formData.modules.includes(module)}
              onChange={(e) => {
                const updated = e.target.checked
                  ? [...formData.modules, module]
                  : formData.modules.filter((m: string) => m !== module);
                onChange('modules', updated);
              }}
              className="h-3.5 w-3.5 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
            />
            <label htmlFor={`module-${module}`} className="ml-2 text-xs text-gray-700">
              {module}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepModules;
