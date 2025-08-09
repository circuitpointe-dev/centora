import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

const ModalSignup = ({ onClose }: { onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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

  // Steps configuration
  const steps = [
    {
      title: "Organization Details",
      component: (
        <Step1 
          formData={formData} 
          onChange={handleChange} 
        />
      ),
      validate: () => {
        if (!formData.organizationName.trim()) {
          toast({ title: "Error", description: "Organization name is required", variant: "destructive" });
          return false;
        }
        if (!formData.contactName.trim()) {
          toast({ title: "Error", description: "Contact name is required", variant: "destructive" });
          return false;
        }
        if (!formData.email.trim()) {
          toast({ title: "Error", description: "Email is required", variant: "destructive" });
          return false;
        }
        if (!formData.password) {
          toast({ title: "Error", description: "Password is required", variant: "destructive" });
          return false;
        }
        return true;
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

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({ title: "Success!", description: "Account created successfully" });
      navigate('/dashboard');
    } catch (error) {
      toast({ title: "Error", description: "Registration failed", variant: "destructive" });
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
        className="relative w-full max-w-md mx-auto"
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
              disabled={isLoading}
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
    </div>
  );
};

// Step Components
const Step1 = ({ formData, onChange }: { 
  formData: any, 
  onChange: (field: string, value: any) => void 
}) => (
  <div className="space-y-3">
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-600">
        Organization Name *
      </label>
      <input
        type="text"
        className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
        value={formData.organizationName}
        onChange={(e) => onChange('organizationName', e.target.value)}
      />
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-600">
          Organization Type *
        </label>
        <select
          className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
          value={formData.organizationType}
          onChange={(e) => onChange('organizationType', e.target.value)}
        >
          <option value="NGO">Non-Profit</option>
          <option value="DONOR">Donor</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-600">
          Primary Currency *
        </label>
        <select
          className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
          value={formData.primaryCurrency}
          onChange={(e) => onChange('primaryCurrency', e.target.value)}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>
    </div>

    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-600">
        Address
      </label>
      <input
        type="text"
        className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
        value={formData.address}
        onChange={(e) => onChange('address', e.target.value)}
      />
    </div>

    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-600">
        Contact Person *
      </label>
      <input
        type="text"
        className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
        value={formData.contactName}
        onChange={(e) => onChange('contactName', e.target.value)}
      />
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-600">
          Email *
        </label>
        <input
          type="email"
          className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-600">
          Phone
        </label>
        <input
          type="tel"
          className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
          value={formData.phone}
          onChange={(e) => onChange('phone', e.target.value)}
        />
      </div>
    </div>

    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-600">
        Password *
      </label>
      <input
        type="password"
        className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
        value={formData.password}
        onChange={(e) => onChange('password', e.target.value)}
      />
    </div>
  </div>
);

const Step2 = ({ formData, onChange }: { 
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

const Step3 = ({ formData, onChange }: { 
  formData: any, 
  onChange: (field: string, value: any) => void 
}) => {
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$29/month',
      features: ['Up to 5 users', 'Core modules', 'Email support']
    },
    {
      id: 'standard',
      name: 'Standard',
      price: '$99/month',
      features: ['Up to 20 users', 'All modules', 'Priority support']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      features: ['Unlimited users', 'Custom integrations', 'Dedicated support']
    }
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">Choose your preferred pricing plan:</p>
      <div className="grid gap-2">
        {plans.map(plan => (
          <div
            key={plan.id}
            onClick={() => onChange('pricingPlan', plan.id)}
            className={`p-3 border rounded-md cursor-pointer transition-all ${
              formData.pricingPlan === plan.id
                ? 'border-violet-500 bg-violet-50'
                : 'border-gray-200 hover:border-violet-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-medium">{plan.name}</h3>
              <span className="text-xs font-semibold text-violet-600">{plan.price}</span>
            </div>
            <ul className="mt-1 text-xs text-gray-600 space-y-0.5">
              {plan.features.map(feature => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const Step4 = ({ formData, onChange }: { 
  formData: any, 
  onChange: (field: string, value: any) => void 
}) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-800">Organization Details</h3>
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-gray-500">Name</p>
            <p>{formData.organizationName}</p>
          </div>
          <div>
            <p className="text-gray-500">Type</p>
            <p>{formData.organizationType === 'NGO' ? 'Non-Profit' : 'Donor'}</p>
          </div>
          <div>
            <p className="text-gray-500">Currency</p>
            <p>{formData.primaryCurrency}</p>
          </div>
          <div>
            <p className="text-gray-500">Address</p>
            <p>{formData.address || 'Not provided'}</p>
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-800">Contact Information</h3>
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-gray-500">Contact Person</p>
            <p>{formData.contactName}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p>{formData.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Phone</p>
            <p>{formData.phone || 'Not provided'}</p>
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-800">Selected Modules</h3>
      <div className="bg-gray-50 p-3 rounded-md">
        {formData.modules.length > 0 ? (
          <ul className="list-disc pl-4 text-xs space-y-0.5">
            {formData.modules.map((module: string) => (
              <li key={module}>{module}</li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-500">No modules selected</p>
        )}
      </div>
    </div>

    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-800">Pricing Plan</h3>
      <div className="bg-gray-50 p-3 rounded-md text-xs">
        {formData.pricingPlan ? (
          <p>{formData.pricingPlan.charAt(0).toUpperCase() + formData.pricingPlan.slice(1)} Plan</p>
        ) : (
          <p className="text-gray-500">No plan selected</p>
        )}
      </div>
    </div>

    <div className="flex items-start mt-3">
      <div className="flex items-center h-4">
        <input
          id="terms"
          type="checkbox"
          checked={formData.termsAccepted}
          onChange={(e) => onChange('termsAccepted', e.target.checked)}
          className="h-3.5 w-3.5 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
        />
      </div>
      <label htmlFor="terms" className="ml-2 text-xs text-gray-700">
        I agree to the{' '}
        <a href="#" className="text-violet-600 hover:text-violet-500">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="text-violet-600 hover:text-violet-500">
          Privacy Policy
        </a>
      </label>
    </div>
  </div>
);

export default ModalSignup;