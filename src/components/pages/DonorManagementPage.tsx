
import React from 'react';
import FundingCycles from '@/components/fundraising/FundingCycles';
import DonorList from '@/components/fundraising/DonorList';
import FocusAreasCard from '@/components/fundraising/FocusAreasCard';

const DonorManagementPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Donor Management</h1>
      </div>

      {/* Funding Cycles and Focus Areas Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <FundingCycles />
        </div>
        <div className="lg:col-span-2">
          <FocusAreasCard />
        </div>
      </div>

      {/* Donor List Section */}
      <DonorList />
    </div>
  );
};

export default DonorManagementPage;
