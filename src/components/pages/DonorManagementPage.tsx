
import React from 'react';
import FundingCycles from '@/components/fundraising/FundingCycles';
import DonorList from '@/components/fundraising/DonorList';
import FocusAreasCard from '@/components/fundraising/FocusAreasCard';

const DonorManagementPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-medium text-gray-900">Donor Management</h1>
        <p className="text-gray-600 mt-2">
          Manage your donors, funding cycles, and focus areas
        </p>
      </div>

      {/* Funding Cycles and Focus Areas Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <FundingCycles />
        </div>
        <div className="lg:col-span-1">
          <FocusAreasCard />
        </div>
      </div>

      {/* Donor List Section */}
      <DonorList />
    </div>
  );
};

export default DonorManagementPage;
