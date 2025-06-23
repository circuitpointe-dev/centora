import React from "react";
import { AnalyticsStatCards } from "@/components/analytics/AnalyticsStatCards";
import { FundingRaisedChart } from "@/components/analytics/charts/FundingRaisedChart";
import { ProposalActivityChart } from "@/components/analytics/charts/ProposalActivityChart";
import { TurnaroundTimeChart } from "@/components/analytics/charts/TurnaroundTimeChart";
import { DonorSegmentationChart } from "@/components/analytics/charts/DonorSegmentationChart";
import { DonorSnapshotSection } from "@/components/analytics/DonorSnapshotSection";

interface AnalyticsContentProps {
  selectedPeriod: string;
}

export const AnalyticsContent: React.FC<AnalyticsContentProps> = ({
  selectedPeriod,
}) => {
  return (
    <div className="space-y-6">
      {/* Fundraising Overview Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Fundraising Overview</h2>
        <AnalyticsStatCards
          variant="this-month"
          selectedPeriod={selectedPeriod}
          group="fundraising"
        />
      </div>

      {/* Funding Raised Chart */}
      <div className="w-full">
        <FundingRaisedChart />
      </div>

      {/* Proposal Stats Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Proposal Stats</h2>
        <AnalyticsStatCards
          variant="this-month"
          selectedPeriod={selectedPeriod}
          group="proposals"
        />
      </div>

      {/* Proposal Activity Trend Chart */}
      <div className="w-full">
        <ProposalActivityChart />
      </div>

      {/* Donor Snapshot Section */}
      <DonorSnapshotSection />

      {/* Other charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TurnaroundTimeChart />
      </div>
    </div>
  );
};
