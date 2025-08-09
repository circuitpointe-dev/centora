import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

const StepOrganizationDetails = ({ formData, onChange }: { 
  formData: any, 
  onChange: (field: string, value: any) => void 
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
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
            <option value="USD">USD — US Dollar</option>
            <option value="EUR">EUR — Euro</option>
            <option value="GBP">GBP — British Pound</option>
            <option value="NGN">NGN — Nigerian Naira</option>
            <option value="JPY">JPY — Japanese Yen</option>
            <option value="CAD">CAD — Canadian Dollar</option>
            <option value="AUD">AUD — Australian Dollar</option>
            <option value="INR">INR — Indian Rupee</option>
            <option value="ZAR">ZAR — South African Rand</option>
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
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full pr-10 px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
            value={formData.password}
            onChange={(e) => onChange('password', e.target.value)}
          />
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepOrganizationDetails;
