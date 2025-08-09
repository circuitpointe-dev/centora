import React from 'react';

const StepOrganizationDetails = ({ formData, onChange }: { 
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

export default StepOrganizationDetails;
