
import React from "react";
import { DonorSnapshotCards } from "./DonorSnapshotCards";
import { DonorSegmentationChart } from "./charts/DonorSegmentationChart";
import { OpportunityPipelineChart } from "./OpportunityPipelineChart";

export const DonorSnapshotSection: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Donor Snapshot Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Donor Snapshot</h2>
        <div className="bg-white shadow rounded-lg border border-gray-100 p-6">
          <div className="space-y-4">
            <DonorSnapshotCards />
            <DonorSegmentationChart />
          </div>
        </div>
      </div>

      {/* Opportunity Pipeline Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Opportunity Pipeline</h2>
        <div className="bg-white shadow rounded-lg border border-gray-100 p-6">
          <OpportunityPipelineChart />
        </div>
      </div>
    </div>
  );
};
