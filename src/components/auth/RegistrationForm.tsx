import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import BasicInfoStep from "./registration/BasicInfoStep";
import ModuleSelectionStep from "./registration/ModuleSelectionStep";
import AdditionalInfoStep from "./registration/AdditionalInfoStep";
import RegistrationStepper from "./registration/RegistrationStepper";
import { validateLegacyStep1, validateLegacyStep2 } from "@/utils/registrationValidation";
import { useRegistrationSubmit } from "@/hooks/useRegistrationSubmit";
import { RegistrationData } from "@/types/registration";

// Legacy interface for backward compatibility with old components
export interface LegacyRegistrationData {
  organizationName: string;
  organizationType: "NGO" | "Donor" | "";
  email: string;
  password: string;
  contactPersonName: string;
  contactPhone: string;
  selectedModules: string[];
  contactEmail: string;
  address: string;
  establishmentDate: string;
  currency: string;
}

// Export RegistrationData for backward compatibility
export type { RegistrationData } from "@/types/registration";

interface RegistrationFormProps {
  onShowLogin: () => void;
}

const RegistrationForm = ({ onShowLogin }: RegistrationFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { handleSubmit, isLoading } = useRegistrationSubmit();

  const [formData, setFormData] = useState<LegacyRegistrationData>({
    organizationName: "",
    organizationType: "",
    email: "",
    password: "",
    contactPersonName: "",
    contactPhone: "",
    selectedModules: [],
    // Additional info fields for compatibility
    contactEmail: "",
    address: "",
    establishmentDate: "",
    currency: "USD",
  });

  const updateFormData = (data: Partial<LegacyRegistrationData>) => {
    setFormData((prev) => {
      const updated = { ...prev, ...data };
      
      // Sync email fields for compatibility
      if (data.email) {
        updated.contactEmail = data.email;
      }
      
      // Clear modules when organization type changes
      if (data.organizationType && data.organizationType !== prev.organizationType) {
        updated.selectedModules = [];
      }
      
      return updated;
    });
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const validation = validateLegacyStep1(formData);
      if (!validation.isValid) {
        toast({
          title: "Error",
          description: validation.errors[0],
          variant: "destructive",
        });
        return;
      }
    }

    if (currentStep === 2) {
      const validation = validateLegacyStep2(formData);
      if (!validation.isValid) {
        toast({
          title: "Error",
          description: validation.errors[0],
          variant: "destructive",
        });
        return;
      }
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (skipAdditional = false) => {
    const step1Validation = validateLegacyStep1(formData);
    const step2Validation = validateLegacyStep2(formData);

    if (!step1Validation.isValid) {
      toast({
        title: "Error",
        description: step1Validation.errors[0],
        variant: "destructive",
      });
      return;
    }

    if (!step2Validation.isValid) {
      toast({
        title: "Error",
        description: step2Validation.errors[0],
        variant: "destructive",
      });
      return;
    }

    await handleSubmit(formData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep formData={formData} updateFormData={updateFormData} />
        );
      case 2:
        return (
          <ModuleSelectionStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <AdditionalInfoStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center lg:justify-start justify-center px-2 sm:px-12">
      <div className="w-full max-w-xs sm:max-w-sm p-6 rounded-lg shadow-sm">
        {/* Welcome message */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Join Orbit</h1>
            <span className="h-5 w-5 text-blue-500">🚀</span>
          </div>
          <p className="text-gray-500 mt-1 text-sm">
            Create your NGO account to get started
          </p>
        </div>

        {/* Stepper */}
        <RegistrationStepper currentStep={currentStep} />

        {/* Form Content */}
        <div className="mt-6">{renderStep()}</div>

        {/* Navigation */}
        <div className="mt-4 flex justify-between">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={isLoading}
              className="h-8 rounded-md text-xs"
            >
              Previous
            </Button>
          )}

          <div className="flex gap-2 ml-auto">
            {currentStep === 3 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onSubmit(true)}
                disabled={isLoading}
                className="h-8 rounded-md text-xs"
              >
                Skip for now
              </Button>
            )}

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="h-8 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-md text-xs transition-colors"
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => onSubmit(false)}
                disabled={isLoading}
                className="h-8 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-md text-xs transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </Button>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-gray-500 text-xs">
          Already have an account?{" "}
          <button
            onClick={onShowLogin}
            className="text-violet-600 hover:text-violet-700 font-medium cursor-pointer"
          >
            Sign in
          </button>
        </p>

        <div className="mt-8 text-center text-xs text-gray-400">
          <div className="mb-3">© 2025 Orbit ERP. All rights reserved.</div>
          <div className="flex justify-center space-x-3">
            <a href="#" className="hover:text-violet-600">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-violet-600">
              Terms of Service
            </a>
            <a href="#" className="hover:text-violet-600">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
