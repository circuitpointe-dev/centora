
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
    "Fundraising",
    "Programme Management",
    "Procurement",
    "Inventory Management",
    "Finance & Control",
    "Learning Management",
    "Document Management",
    "Human Resources Management",
    "Users Management",
    "Grant Management",
  ];

  // If it's a Donor, only show Grant Management
  const availableModules = formData.organizationType === "Donor" 
    ? ["Grant Management"] 
    : allModules;

  const handleModuleToggle = (module: string) => {
    // If it's a Donor, Grant Management should always be selected
    if (formData.organizationType === "Donor" && module === "Grant Management") {
      return; // Don't allow unchecking for Donors
    }

    const updatedModules = formData.selectedModules.includes(module)
      ? formData.selectedModules.filter((m) => m !== module)
      : [...formData.selectedModules, module];

    updateFormData({ selectedModules: updatedModules });
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Choose your ERP Modules
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          {formData.organizationType === "Donor" 
            ? "As a Donor organization, you have access to Grant Management module."
            : "Select the functionalities your organization needs. You can always add more later."
          }
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        {availableModules.map((module) => (
          <div key={module} className="flex items-center space-x-2">
            <Checkbox
              id={module}
              checked={formData.selectedModules.includes(module)}
              onCheckedChange={() => handleModuleToggle(module)}
              className="h-5 w-5"
              disabled={formData.organizationType === "Donor" && module === "Grant Management"}
            />
            <Label
              htmlFor={module}
              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {module}
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
