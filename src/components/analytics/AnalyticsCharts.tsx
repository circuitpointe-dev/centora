
import React from "react";
import { TurnaroundTimeChart } from "./charts/TurnaroundTimeChart";
import { DonorSegmentationChart } from "./charts/DonorSegmentationChart";
import { FundingRaisedChart } from "./charts/FundingRaisedChart";
import { ProposalActivityChart } from "./charts/ProposalActivityChart";

export function AnalyticsCharts({ selectedPeriod }: { selectedPeriod?: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <TurnaroundTimeChart />
      <DonorSegmentationChart />
      <FundingRaisedChart />
      <ProposalActivityChart />
    </div>
  );
}
