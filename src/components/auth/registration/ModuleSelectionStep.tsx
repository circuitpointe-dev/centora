
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RegistrationData, AVAILABLE_MODULES } from "@/types/registration";

interface ModuleSelectionStepProps {
  formData: RegistrationData;
  updateFormData: (data: Partial<RegistrationData>) => void;
}

const ModuleSelectionStep = ({
  formData,
  updateFormData,
}: ModuleSelectionStepProps) => {
  // Show all modules but only allow selection of available ones
  const availableModules = AVAILABLE_MODULES;

  const handleModuleToggle = (moduleName: string) => {
    // Only allow toggling of available modules
    const module = AVAILABLE_MODULES.find(m => m.name === moduleName);
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
        <TooltipProvider>
          {availableModules.map((module) => (
            <div key={module.name} className={`flex items-center space-x-2 ${!module.available ? 'opacity-50' : ''}`}>
              {!module.available ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2 cursor-not-allowed">
                      <Checkbox
                        id={module.name}
                        checked={false}
                        disabled={true}
                        className="h-5 w-5"
                      />
                      <Label
                        htmlFor={module.name}
                        className="text-sm font-normal leading-none text-gray-400 cursor-not-allowed"
                      >
                        {module.name}
                        <span className="text-xs text-gray-400 block">Coming Soon</span>
                      </Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This module is coming soon</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <>
                  <Checkbox
                    id={module.name}
                    checked={formData.selectedModules.includes(module.name)}
                    onCheckedChange={() => handleModuleToggle(module.name)}
                    className="h-5 w-5"
                  />
                  <Label
                    htmlFor={module.name}
                    className="text-sm font-normal leading-none cursor-pointer"
                  >
                    {module.name}
                  </Label>
                </>
              )}
            </div>
          ))}
        </TooltipProvider>
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
