import React from 'react';
import { Building2, MapPin, Wallet, User as UserIcon, Mail, Phone, Layers3, BadgeCheck, ShieldCheck } from 'lucide-react';

const StepReviewSubmit = ({ formData, onChange }: { 
  formData: any, 
  onChange: (field: string, value: any) => void 
}) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-800 flex items-center gap-2"><Building2 className="h-4 w-4 text-gray-600" /> Organization Details</h3>
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
      <h3 className="text-sm font-medium text-gray-800 flex items-center gap-2"><UserIcon className="h-4 w-4 text-gray-600" /> Contact Information</h3>
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
      <h3 className="text-sm font-medium text-gray-800 flex items-center gap-2"><Layers3 className="h-4 w-4 text-gray-600" /> Selected Modules</h3>
      <div className="bg-gray-50 p-3 rounded-md">
        {formData.modules.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {formData.modules.map((module: string) => (
              <span key={module} className="text-xs px-2 py-1 rounded-sm border border-gray-200 text-gray-700">
                {module}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500">No modules selected</p>
        )}
      </div>
    </div>

    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-800 flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-gray-600" /> Pricing Plan</h3>
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
      <label htmlFor="terms" className="ml-2 text-xs text-gray-700 flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-gray-600" />
        <span>
          I agree to the{' '}
          <a href="#" className="underline underline-offset-2 hover:opacity-80">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline underline-offset-2 hover:opacity-80">
            Privacy Policy
          </a>
        </span>
      </label>
    </div>
  </div>
);

export default StepReviewSubmit;
