
import React from "react";
import { DonorSnapshotCards } from "./DonorSnapshotCards";
import { DonorSegmentationChart } from "./charts/DonorSegmentationChart";
import { OpportunityPipelineChart } from "./OpportunityPipelineChart";
import { EmptyDonorSnapshot } from "./EmptyDonorSnapshot";
import { EmptyOpportunityPipeline } from "./EmptyOpportunityPipeline";
import { useDonors } from "@/hooks/useDonors";
import { useOpportunities } from "@/hooks/useOpportunities";

export const DonorSnapshotSection: React.FC = () => {
  const { data: donors = [] } = useDonors();
  const { data: opportunities = [] } = useOpportunities();
  
  const hasDonorData = donors.length > 0;
  const hasOpportunityData = opportunities.length > 0;

  return (
    <div className="space-y-6">
      {/* Donor Snapshot and Opportunity Pipeline Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donor Snapshot Card */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Donor Snapshot</h2>
          <div className="bg-white shadow rounded-lg border border-gray-100 p-6">
            {hasDonorData ? (
              <div className="space-y-4">
                <DonorSnapshotCards />
                <DonorSegmentationChart />
              </div>
            ) : (
              <EmptyDonorSnapshot onAddDonor={() => {/* Navigate to add donor */}} />
            )}
          </div>
        </div>

        {/* Opportunity Pipeline Card */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Opportunity Pipeline</h2>
          <div className="bg-white shadow rounded-lg border border-gray-100 p-6">
            {hasOpportunityData ? (
              <OpportunityPipelineChart />
            ) : (
              <EmptyOpportunityPipeline onCreateOpportunity={() => {/* Navigate to create opportunity */}} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
