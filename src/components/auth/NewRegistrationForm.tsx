import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import RegistrationStepper from "./registration/RegistrationStepper";
import BasicInfoStep from "./registration/BasicInfoStep";
import ModuleSelectionStep from "./registration/ModuleSelectionStep";
import PricingSelectionStep from "./registration/PricingSelectionStep";
import ConfirmationStep from "./registration/ConfirmationStep";
import { useNewRegistrationSubmit } from "@/hooks/useNewRegistrationSubmit";
import { validateStep1, validateStep2 } from "@/utils/registrationValidation";
import { RegistrationData } from "@/types/registration";

interface NewRegistrationFormProps {
  onShowLogin: () => void;
  onBackToHome?: () => void;
}

const NewRegistrationForm = ({ onShowLogin, onBackToHome }: NewRegistrationFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>({
    organizationName: "",
    organizationType: "NGO",
    organizationAddress: "",
    primaryCurrency: "",
    contactPersonName: "",
    contactPhone: "",
    email: "",
    password: "",
    selectedModules: [],
    selectedPricingTier: "",
    termsAccepted: false,
  });

  const { handleSubmit, saveProgress, isLoading } = useNewRegistrationSubmit();

  const updateFormData = (data: Partial<RegistrationData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      const validation = validateStep1(formData);
      if (!validation.isValid) {
        validation.errors.forEach(error => {
          console.error('Validation error:', error);
        });
        return;
      }
      // Convert to legacy format for progress saving compatibility
      const legacyData = {
        organizationName: formData.organizationName,
        organizationType: formData.organizationType,
        email: formData.email,
        password: formData.password,
        contactPersonName: formData.contactPersonName,
        contactPhone: formData.contactPhone,
        selectedModules: formData.selectedModules,
        contactEmail: formData.email,
        address: formData.organizationAddress,
        establishmentDate: "",
        currency: formData.primaryCurrency,
      };
      await saveProgress(formData.email, 1, legacyData);
    }

    if (currentStep === 2) {
      const validation = validateStep2(formData);
      if (!validation.isValid) {
        validation.errors.forEach(error => {
          console.error('Validation error:', error);
        });
        return;
      }
      // Save progress after step 2
      const legacyData = {
        organizationName: formData.organizationName,
        organizationType: formData.organizationType,
        email: formData.email,
        password: formData.password,
        contactPersonName: formData.contactPersonName,
        contactPhone: formData.contactPhone,
        selectedModules: formData.selectedModules,
        contactEmail: formData.email,
        address: formData.organizationAddress,
        establishmentDate: "",
        currency: formData.primaryCurrency,
      };
      await saveProgress(formData.email, 2, legacyData);
    }

    if (currentStep === 3) {
      if (!formData.selectedPricingTier) {
        console.error('Please select a pricing tier');
        return;
      }
      // Save progress after step 3
      const legacyData = {
        organizationName: formData.organizationName,
        organizationType: formData.organizationType,
        email: formData.email,
        password: formData.password,
        contactPersonName: formData.contactPersonName,
        contactPhone: formData.contactPhone,
        selectedModules: formData.selectedModules,
        contactEmail: formData.email,
        address: formData.organizationAddress,
        establishmentDate: "",
        currency: formData.primaryCurrency,
      };
      await saveProgress(formData.email, 3, legacyData);
    }

    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    if (!formData.termsAccepted) {
      console.error('Please accept the terms and conditions');
      return;
    }

    const result = await handleSubmit(formData);
    if (result.success) {
      // Redirect to login page
      onShowLogin();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData as any} updateFormData={updateFormData as any} />;
      case 2:
        return <ModuleSelectionStep formData={formData as any} updateFormData={updateFormData as any} />;
      case 3:
        return <PricingSelectionStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <ConfirmationStep formData={formData} updateFormData={updateFormData} />;
      default:
        return <BasicInfoStep formData={formData as any} updateFormData={updateFormData as any} />;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return validateStep1(formData).isValid;
      case 2:
        return validateStep2(formData).isValid;
      case 3:
        return !!formData.selectedPricingTier;
      case 4:
        return formData.termsAccepted;
      default:
        return false;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Register Your Organization</h1>
        <p className="text-gray-600 mt-2">Complete the steps below to set up your ERP system</p>
      </div>

      {/* Stepper */}
      <RegistrationStepper currentStep={currentStep} />

      {/* Form Content */}
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="min-h-[400px]">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex items-center space-x-2">
            {onBackToHome && (
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onBackToHome}
                className="text-gray-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back Home
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!canProceed() || isLoading}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {isLoading ? "Creating Account..." : "Complete Registration"}
              </Button>
            )}
          </div>
        </div>
      </form>

      {/* Footer */}
      <div className="text-center pt-4 border-t">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onShowLogin}
            className="text-violet-600 hover:text-violet-800 font-medium"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default NewRegistrationForm;