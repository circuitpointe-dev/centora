import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckEmailModal } from './CheckEmailModal';
import Step1 from './signup/StepOrganizationDetails';
import Step2 from './signup/StepModules';
import Step3 from './signup/StepPricingPlan';
import Step4 from './signup/StepReviewSubmit';

const ModalSignup = ({ onClose }: { onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showCheckEmailModal, setShowCheckEmailModal] = useState(false);
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: 'NGO',
    address: '',
    primaryCurrency: 'USD',
    contactName: '',
    phone: '',
    email: '',
    password: '',
    modules: [] as string[],
    pricingPlan: '',
    termsAccepted: false
  });

  const handleChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Validation for Step 1 - Organization Details
  type OrgErrors = Partial<Record<'organizationName' | 'organizationType' | 'primaryCurrency' | 'address' | 'contactName' | 'phone' | 'email' | 'password', string>>;

  const getOrgErrors = (fd: typeof formData): OrgErrors => {
    const errors: OrgErrors = {};

    if (!fd.organizationName || fd.organizationName.trim().length < 2) {
      errors.organizationName = 'Please enter your organization name (min 2 characters).';
    }

    if (!fd.organizationType) {
      errors.organizationType = 'Please select an organization type.';
    }

    if (!fd.primaryCurrency) {
      errors.primaryCurrency = 'Please select a primary currency.';
    }

    if (!fd.contactName || fd.contactName.trim().length < 2) {
      errors.contactName = 'Please enter a contact person (min 2 characters).';
    }

    if (!fd.email) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fd.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (fd.phone && !/^\+?[0-9\s().-]{7,20}$/.test(fd.phone)) {
      errors.phone = 'Please enter a valid phone number.';
    }

    const hasMinLen = fd.password.length >= 8;
    const hasLower = /[a-z]/.test(fd.password);
    const hasUpper = /[A-Z]/.test(fd.password);
    const hasNumber = /\d/.test(fd.password);
    // special is optional for now, but considered for strength
    if (!fd.password) {
      errors.password = 'Password is required.';
    } else if (!(hasMinLen && hasLower && hasUpper && hasNumber)) {
      errors.password = 'Use 8+ chars with upper, lower and a number.';
    }

    return errors;
  };

  const orgErrors = currentStep === 1 ? getOrgErrors(formData) : {};
  const isOrgValid = currentStep === 1 ? Object.keys(orgErrors).length === 0 : true;
  // Steps configuration
  const steps = [
    {
      title: "Organization Details",
      component: (
        <Step1 
          formData={formData} 
          onChange={handleChange} 
          errors={orgErrors}
        />
      ),
      validate: () => {
        return Object.keys(orgErrors).length === 0;
      }
    },
    {
      title: "Select Modules",
      component: (
        <Step2 
          formData={formData} 
          onChange={handleChange} 
        />
      ),
      validate: () => {
        if (formData.modules.length === 0) {
          toast({ title: "Error", description: "Please select at least one module", variant: "destructive" });
          return false;
        }
        return true;
      }
    },
    {
      title: "Pricing Plan",
      component: (
        <Step3 
          formData={formData} 
          onChange={handleChange} 
        />
      ),
      validate: () => {
        if (!formData.pricingPlan) {
          toast({ title: "Error", description: "Please select a pricing plan", variant: "destructive" });
          return false;
        }
        return true;
      }
    },
    {
      title: "Review & Submit",
      component: (
        <Step4 
          formData={formData} 
          onChange={handleChange} 
        />
      ),
      validate: () => {
        if (!formData.termsAccepted) {
          toast({ title: "Error", description: "You must accept the terms", variant: "destructive" });
          return false;
        }
        return true;
      }
    }
  ];

  const handleNext = () => {
    if (!steps[currentStep - 1].validate()) return;
    setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => setCurrentStep(prev => prev - 1);

  const handleProceedToVerification = () => {
    setShowCheckEmailModal(false);
    onClose();
    const params = new URLSearchParams({
      email: formData.email,
      org: formData.organizationName
    });
    navigate(`/verify-email?${params.toString()}`);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const showDuplicateEmailToast = () =>
      toast({
        title: 'Registration failed',
        description: 'This email is already registered. Please use a different email address.',
        variant: 'destructive',
      });

    const showGenericError = (msg?: string) =>
      toast({ title: 'Registration failed', description: msg || 'Please try again.', variant: 'destructive' });

    try {
      const { data, error } = await supabase.functions.invoke('register-tenant', {
        body: {
          organizationName: formData.organizationName,
          organizationType: formData.organizationType,
          address: formData.address,
          primaryCurrency: formData.primaryCurrency,
          contactName: formData.contactName,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          modules: formData.modules,
          pricingPlan: formData.pricingPlan,
          termsAccepted: formData.termsAccepted,
        },
      });

      if (error) {
        const rawMsg = (error as any)?.message || '';
        let parsed: any = null;
        try {
          parsed = JSON.parse(rawMsg);
        } catch {}

        if (parsed && typeof parsed === 'object') {
          if (parsed.code === 'DUPLICATE_EMAIL') {
            showDuplicateEmailToast();
            setCurrentStep(1);
            return;
          }
          showGenericError(parsed.message);
          return;
        }

        if (/duplicate|already registered|unique|exists/i.test(rawMsg)) {
          showDuplicateEmailToast();
          setCurrentStep(1);
          return;
        }

        showGenericError(rawMsg);
        return;
      }

      // Handle structured responses even on 200
      const resp: any = data;
      if (resp && resp.success === false) {
        if (resp.code === 'DUPLICATE_EMAIL') {
          showDuplicateEmailToast();
          setCurrentStep(1);
          return;
        }
        showGenericError(resp.message);
        return;
      }

      toast({ title: 'Success!', description: 'Account created successfully' });
      
      // Send verification code
      try {
        const { data: verificationData, error: verificationError } = await supabase.functions.invoke('send-verification-code', {
          body: { 
            email: formData.email, 
            organizationName: formData.organizationName 
          }
        });

        if (verificationError || verificationData?.error) {
          console.error('Failed to send verification code:', verificationError || verificationData?.error);
          // Don't block the user if verification email fails
          toast({ 
            title: 'Account Created', 
            description: 'Account created successfully, but verification email could not be sent. Please contact support.',
            variant: 'default'
          });
          navigate('/login');
          return;
        }

        // Show check email modal instead of redirecting immediately
        setShowCheckEmailModal(true);
      } catch (err) {
        console.error('Verification email error:', err);
        toast({ 
          title: 'Account Created', 
          description: 'Account created successfully, but verification email could not be sent. Please contact support.',
          variant: 'default'
        });
        navigate('/login');
      }
    } catch (err: any) {
      showGenericError(err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Glass overlay */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal container */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative w-full mx-auto ${currentStep === 3 ? 'max-w-4xl' : 'max-w-md'}`}
      >
        <div className="bg-white/90 backdrop-blur-lg rounded-lg shadow-xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {steps[currentStep - 1]?.title}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Step {currentStep} of {steps.length}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Animated step content */}
          <div className="p-5 max-h-[60vh] overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: currentStep > 1 ? -50 : 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: currentStep > 1 ? 50 : -50, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {steps[currentStep - 1]?.component}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Footer navigation */}
          <div className="p-3 border-t border-gray-200 flex justify-between">
            {currentStep > 1 ? (
              <Button 
                variant="ghost"
                onClick={handlePrev}
                className="flex items-center gap-1 text-gray-600 h-8 px-3 text-sm"
              >
                <ChevronLeft size={16} /> Back
              </Button>
            ) : (
              <div /> // Empty div for spacing
            )}
            
            <Button 
              onClick={currentStep === steps.length ? handleSubmit : handleNext}
              disabled={
                isLoading ||
                (currentStep === 1 && !isOrgValid) ||
                (currentStep === 2 && formData.modules.length === 0) ||
                (currentStep === steps.length && !formData.termsAccepted)
              }
              className="ml-auto bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 text-white h-8 px-4 text-sm"
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : currentStep === steps.length ? (
                'Complete Registration'
              ) : (
                <>
                  Next <ChevronRight size={16} className="ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Check Email Modal */}
      <CheckEmailModal 
        open={showCheckEmailModal}
        onOpenChange={setShowCheckEmailModal}
        onProceedToVerification={handleProceedToVerification}
        email={formData.email}
        organizationName={formData.organizationName}
      />
    </div>
  );
};

export default ModalSignup;