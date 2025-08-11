import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const StepOrganizationDetails = ({ formData, onChange, errors = {} }: { 
  formData: any, 
  onChange: (field: string, value: any) => void,
  errors?: Partial<Record<'organizationName' | 'organizationType' | 'primaryCurrency' | 'address' | 'contactName' | 'phone' | 'email' | 'password', string>>
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  // Password strength helpers (display-only)
  const password: string = formData.password || '';
  const hasMinLen = password.length >= 8;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const strengthScore = [hasMinLen, hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthLabel = strengthScore <= 2 ? 'Weak' : strengthScore === 3 ? 'Medium' : 'Strong';
  const strengthBars = Math.min(3, Math.max(1, strengthScore - 1)); // 1..3 bars
  const suggestions = [
    !hasMinLen && 'Use at least 8 characters',
    !hasLower && 'Add a lowercase letter',
    !hasUpper && 'Add an uppercase letter',
    !hasNumber && 'Add a number',
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-600">
          Organization Name *
        </label>
        <input
          type="text"
          placeholder="e.g., Green Leaf Foundation"
          autoComplete="organization"
          aria-invalid={!!errors.organizationName}
          aria-describedby={errors.organizationName ? 'org-name-error' : undefined}
          className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
          value={formData.organizationName}
          onChange={(e) => onChange('organizationName', e.target.value)}
        />
        {errors.organizationName && (
          <p id="org-name-error" className="text-xs text-red-600 mt-1">{errors.organizationName}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-600">
            Organization Type *
          </label>
          <select
            className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
            value={formData.organizationType}
            aria-invalid={!!errors.organizationType}
            aria-describedby={errors.organizationType ? 'org-type-error' : undefined}
            onChange={(e) => onChange('organizationType', e.target.value)}
          >
            <option value="" disabled>Select organization type</option>
            <option value="NGO">Non-Profit</option>
            <option value="DONOR">Donor</option>
          </select>
          {errors.organizationType && (
            <p id="org-type-error" className="text-xs text-red-600 mt-1">{errors.organizationType}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-600">
            Primary Currency *
          </label>
          <select
            className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
            value={formData.primaryCurrency}
            aria-invalid={!!errors.primaryCurrency}
            aria-describedby={errors.primaryCurrency ? 'currency-error' : undefined}
            onChange={(e) => onChange('primaryCurrency', e.target.value)}
          >
            <option value="" disabled>Select currency</option>
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
          {errors.primaryCurrency && (
            <p id="currency-error" className="text-xs text-red-600 mt-1">{errors.primaryCurrency}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-600">
          Address
        </label>
        <Textarea
          placeholder="Street, City, State, Country"
          className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-gray-300 bg-white focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
          value={formData.address}
          onChange={(e) => onChange('address', (e.target as HTMLTextAreaElement).value)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-600">
          Contact Person *
        </label>
        <input
          type="text"
          placeholder="e.g., Amina Yusuf"
          aria-invalid={!!errors.contactName}
          aria-describedby={errors.contactName ? 'contact-error' : undefined}
          className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
          value={formData.contactName}
          onChange={(e) => onChange('contactName', e.target.value)}
        />
        {errors.contactName && (
          <p id="contact-error" className="text-xs text-red-600 mt-1">{errors.contactName}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-600">
            Email *
          </label>
          <input
            type="email"
            placeholder="name@org.org"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-red-600 mt-1">{errors.email}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-600">
            Phone
          </label>
          <input
            type="tel"
            placeholder="e.g., +234 801 234 5678"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
          />
          {errors.phone && (
            <p id="phone-error" className="text-xs text-red-600 mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-600">
          Password *
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
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
        {password && (
          <div className="mt-2">
            <div className="flex gap-1">
              <span className={`h-1 flex-1 rounded ${strengthBars >= 1 ? 'bg-gray-800' : 'bg-gray-300'}`} />
              <span className={`h-1 flex-1 rounded ${strengthBars >= 2 ? 'bg-gray-800' : 'bg-gray-300'}`} />
              <span className={`h-1 flex-1 rounded ${strengthBars >= 3 ? 'bg-gray-800' : 'bg-gray-300'}`} />
            </div>
            <p className="text-xs text-gray-600 mt-1">Strength: {strengthLabel}</p>
          </div>
        )}
        {errors.password && (
          <p id="password-error" className="text-xs text-red-600 mt-1">{errors.password}</p>
        )}
        {password && suggestions.length > 0 && !errors.password && (
          <ul className="list-disc pl-4 mt-1 text-xs text-gray-500">
            {suggestions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StepOrganizationDetails;
