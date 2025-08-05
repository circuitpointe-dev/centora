
// src/components/auth/RegistrationModal.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom"; // ← import Link
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2, X } from "lucide-react";
import BasicInfoStep from "./registration/BasicInfoStep";
import ModuleSelectionStep from "./registration/ModuleSelectionStep";
import AdditionalInfoStep from "./registration/AdditionalInfoStep";
import RegistrationStepper from "./registration/RegistrationStepper";

import { validateLegacyStep1, validateLegacyStep2 } from "@/utils/registrationValidation";
import { useRegistrationSubmit } from "@/hooks/useRegistrationSubmit";
import { LegacyRegistrationData } from "./RegistrationForm";
import { motion, AnimatePresence } from "framer-motion";

interface RegistrationModalProps {
  onClose: () => void;
}

const RegistrationModal = ({ onClose }: RegistrationModalProps) => {
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

    if (!step1Validation.isValid || !step2Validation.isValid) {
      toast({
        title: "Error",
        description: step1Validation.errors[0] || step2Validation.errors[0],
        variant: "destructive",
      });
      return;
    }

    const { error } = await handleSubmit(formData);
    if (!error) {
      onClose();
    }
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
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay with animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          {/* Modal container with animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="flex items-center justify-center min-h-screen p-4"
          >
            <div className="relative bg-white bg-opacity-95 backdrop-blur-lg rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-100">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Content */}
              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Join Orbit
                    </h1>
                    <span className="h-5 w-5 text-blue-500">🚀</span>
                  </div>
                  <p className="text-gray-500 mt-1 text-sm">
                    Create your NGO account to get started
                  </p>
                </div>

                {/* Stepper */}
                <RegistrationStepper currentStep={currentStep} />

                {/* Form Content with slide animation */}
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: currentStep > 1 ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6"
                >
                  {renderStep()}
                </motion.div>

                {/* Navigation */}
                <div className="mt-8 flex justify-between items-center">
                  {/* Back Home button: always visible on the far left */}
                  <Link to="/">
                    <Button variant="outline" className="h-10 rounded-md px-6">
                      Back Home
                    </Button>
                  </Link>

                  {/* Previous button: only when step > 1 */}
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={isLoading}
                      className="h-10 rounded-md px-6 ml-4"
                    >
                      Previous
                    </Button>
                  )}

                  {/* Right‐side actions (Skip / Next / Submit) */}
                  <div className="flex gap-2 ml-auto">
                    {currentStep === 3 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => onSubmit(true)}
                        disabled={isLoading}
                        className="h-10 rounded-md px-6"
                      >
                        Skip for now
                      </Button>
                    )}

                    {currentStep < 3 ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="h-10 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-md transition-colors px-6"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => onSubmit(false)}
                        disabled={isLoading}
                        className="h-10 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-md transition-colors px-6"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Submit Registration"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <p className="text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <button
                    onClick={onClose}
                    className="text-violet-600 hover:text-violet-700 font-medium cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

    </>
  );
};

export default RegistrationModal;
