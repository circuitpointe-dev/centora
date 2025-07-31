
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RegistrationData } from "../RegistrationForm";

interface ModuleSelectionStepProps {
  formData: RegistrationData;
  updateFormData: (data: Partial<RegistrationData>) => void;
}

const ModuleSelectionStep = ({
  formData,
  updateFormData,
}: ModuleSelectionStepProps) => {
  const allModules = [
    { name: "Fundraising", available: true },
    { name: "Documents Manager", available: true },
    { name: "Programme Management", available: false },
    { name: "Procurement", available: false },
    { name: "Inventory Management", available: false },
    { name: "Finance & Control", available: false },
    { name: "Learning Management", available: false },
    { name: "HR Management", available: false },
    { name: "User Management", available: false },
    { name: "Grant Management", available: false },
  ];

  // Show all modules but only allow selection of available ones
  const availableModules = allModules;

  const handleModuleToggle = (moduleName: string) => {
    // Only allow toggling of available modules
    const module = allModules.find(m => m.name === moduleName);
    if (!module || !module.available) {
      return;
    }

    const isSelected = formData.selectedModules.includes(moduleName);
    const updatedModules = isSelected
      ? formData.selectedModules.filter(m => m !== moduleName)
      : [...formData.selectedModules, moduleName];
    
    updateFormData({ selectedModules: updatedModules });
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Choose your ERP Modules
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          Select the modules your organization needs. Only highlighted modules are currently available.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        {availableModules.map((module) => (
          <div key={module.name} className={`flex items-center space-x-2 ${!module.available ? 'opacity-50' : ''}`}>
            <Checkbox
              id={module.name}
              checked={formData.selectedModules.includes(module.name)}
              onCheckedChange={() => handleModuleToggle(module.name)}
              className="h-5 w-5"
              disabled={!module.available}
            />
            <Label
              htmlFor={module.name}
              className={`text-sm font-normal leading-none cursor-pointer ${
                !module.available 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              }`}
            >
              {module.name}
              {!module.available && (
                <span className="text-xs text-gray-400 block">Coming Soon</span>
              )}
            </Label>
          </div>
        ))}
      </div>

      {formData.selectedModules.length > 0 && (
        <div className="mt-3 p-2 bg-violet-50 rounded-lg">
          <p className="text-sm text-violet-700">
            Selected: {formData.selectedModules.length} module
            {formData.selectedModules.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default ModuleSelectionStep;
