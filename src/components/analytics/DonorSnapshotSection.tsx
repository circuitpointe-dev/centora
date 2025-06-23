
import React from "react";
import { DonorSnapshotCards } from "./DonorSnapshotCards";
import { DonorSegmentationChart } from "./charts/DonorSegmentationChart";
import { OpportunityPipelineChart } from "./OpportunityPipelineChart";

export const DonorSnapshotSection: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Donor Snapshot</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Donor Stats and Segmentation */}
        <div className="space-y-4">
          <DonorSnapshotCards />
          <DonorSegmentationChart />
        </div>
        
        {/* Right Column: Opportunity Pipeline */}
        <div>
          <OpportunityPipelineChart />
        </div>
      </div>
    </div>
  );
};
