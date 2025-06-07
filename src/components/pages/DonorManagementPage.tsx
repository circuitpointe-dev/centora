
import React from 'react';
import FundingCycles from '@/components/fundraising/FundingCycles';
import DonorList from '@/components/fundraising/DonorList';

const DonorManagementPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-medium text-gray-900">Donor Management</h1>
        <p className="text-gray-600 mt-2">
          Manage your donors, funding cycles, and focus areas
        </p>
      </div>

      {/* Funding Cycles Section */}
      <FundingCycles />

      {/* Donor List Section */}
      <DonorList />
    </div>
  );
};

export default DonorManagementPage;
