
import React from "react";
import { AnalyticsStatCards } from "@/components/analytics/AnalyticsStatCards";
import { AnalyticsCharts } from "@/components/analytics/AnalyticsCharts";

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
      
      {/* Proposal Stats Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Proposal Stats</h2>
        <AnalyticsStatCards
          variant="this-month"
          selectedPeriod={selectedPeriod}
          group="proposals"
        />
      </div>

      {/* Analytics charts - includes Funding Raised chart first */}
      <AnalyticsCharts selectedPeriod={selectedPeriod} />

      
    </div>
  );
};
