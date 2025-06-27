
import React from "react";
import { DonorSnapshotCards } from "./DonorSnapshotCards";
import { DonorSegmentationChart } from "./charts/DonorSegmentationChart";
import { OpportunityPipelineChart } from "./OpportunityPipelineChart";

export const DonorSnapshotSection: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Donor Snapshot and Opportunity Pipeline Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donor Snapshot Card */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Donor Snapshot</h2>
          <div className="bg-white shadow rounded-lg border border-gray-100 p-6">
            <div className="space-y-4">
              <DonorSnapshotCards />
              <DonorSegmentationChart />
            </div>
          </div>
        </div>

        {/* Opportunity Pipeline Card */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Opportunity Pipeline</h2>
          <div className="bg-white shadow rounded-lg border border-gray-100 p-6">
            <OpportunityPipelineChart />
          </div>
        </div>
      </div>
    </div>
  );
};
