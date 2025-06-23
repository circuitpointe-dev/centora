
import React from "react";
import { TurnaroundTimeChart } from "./charts/TurnaroundTimeChart";
import { DonorSegmentationChart } from "./charts/DonorSegmentationChart";
import { FundingRaisedChart } from "./charts/FundingRaisedChart";
import { ProposalActivityChart } from "./charts/ProposalActivityChart";

export function AnalyticsCharts({ selectedPeriod }: { selectedPeriod?: string }) {
  return (
    <div className="space-y-6">
      {/* First: Funding Raised Chart (full width) */}
      <div className="w-full">
        <FundingRaisedChart />
      </div>
      
      {/* Second: Proposal Activity Chart (full width) */}
      <div className="w-full">
        <ProposalActivityChart />
      </div>
      
      {/* Third: Other charts in a grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TurnaroundTimeChart />
        <DonorSegmentationChart />
      </div>
    </div>
  );
}
