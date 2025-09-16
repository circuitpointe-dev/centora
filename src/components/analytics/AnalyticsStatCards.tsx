
import React from "react";
import { useFundraisingStats } from "@/hooks/useFundraisingStats";
import { useDonors } from "@/hooks/useDonors";
import { useOpportunities } from "@/hooks/useOpportunities";

const statsData = {
  "this-month": [
    { label: "Total Funds Raised", value: "$2.4M", change: "-12%", positive: false },
    { label: "Average Grant Size", value: "$45K", change: "+12%", positive: true },
    { label: "Proposals Submitted", value: "124", change: "+12%", positive: true },
    { label: "Success Rate", value: "68%", change: "+5%", positive: true },
  ],
  "this-quarter": [
    { label: "Total Funds Raised", value: "$7.2M", change: "+15%", positive: true },
    { label: "Average Grant Size", value: "$48K", change: "+7%", positive: true },
    { label: "Proposals Submitted", value: "385", change: "+18%", positive: true },
    { label: "Success Rate", value: "72%", change: "+8%", positive: true },
  ],
  "last-12-months": [
    { label: "Total Funds Raised", value: "$28.5M", change: "+22%", positive: true },
    { label: "Average Grant Size", value: "$52K", change: "+15%", positive: true },
    { label: "Proposals Submitted", value: "1,542", change: "+25%", positive: true },
    { label: "Success Rate", value: "65%", change: "+3%", positive: true },
  ],
  "custom": [
    { label: "Total Funds Raised", value: "$1.8M", change: "+5%", positive: true },
    { label: "Average Grant Size", value: "$42K", change: "+3%", positive: true },
    { label: "Proposals Submitted", value: "89", change: "+8%", positive: true },
    { label: "Success Rate", value: "61%", change: "-2%", positive: false },
  ],
};

export const AnalyticsStatCards: React.FC<{ 
  variant: "this-month" | "generate-report";
  selectedPeriod?: string;
  group?: "fundraising" | "proposals";
}> = ({ variant, selectedPeriod = "this-month", group }) => {
  const { data: fundraisingStats } = useFundraisingStats();
  const { data: donors = [] } = useDonors();
  const { data: opportunities = [] } = useOpportunities();
  
  // For generate-report tab, use dynamic data with slight variations
  let stats = variant === "generate-report" 
    ? statsData["this-month"].map((stat, i) => {
        if (stat.label === "Total Funds Raised" && fundraisingStats) {
          return { ...stat, value: `$${(fundraisingStats.fundsRaised || 0).toLocaleString()}` };
        }
        if (stat.label === "Average Grant Size" && fundraisingStats) {
          return { ...stat, value: `$${(fundraisingStats.avgGrantSize || 0).toLocaleString()}` };
        }
        if (stat.label === "Proposals Submitted") {
          return { ...stat, value: opportunities.length.toString() };
        }
        if (stat.label === "Success Rate" && fundraisingStats) {
          return { ...stat, value: `${Math.round(fundraisingStats.conversionRate || 0)}%` };
        }
        return stat;
      })
    : statsData[selectedPeriod as keyof typeof statsData] || statsData["this-month"];

  // Use real data when available
  if (fundraisingStats && variant !== "generate-report") {
    stats = stats.map(stat => {
      if (stat.label === "Total Funds Raised") {
        return { ...stat, value: `$${(fundraisingStats.fundsRaised || 0).toLocaleString()}` };
      }
      if (stat.label === "Average Grant Size") {
        return { ...stat, value: `$${(fundraisingStats.avgGrantSize || 0).toLocaleString()}` };
      }
      if (stat.label === "Proposals Submitted") {
        return { ...stat, value: opportunities.length.toString() };
      }
      if (stat.label === "Success Rate") {
        return { ...stat, value: `${Math.round(fundraisingStats.conversionRate || 0)}%` };
      }
      return stat;
    });
  }

  // Filter stats based on group
  if (group === "fundraising") {
    stats = stats.filter(stat => 
      stat.label === "Total Funds Raised" || stat.label === "Average Grant Size"
    );
  } else if (group === "proposals") {
    stats = stats.filter(stat => 
      stat.label === "Proposals Submitted" || stat.label === "Success Rate"
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={stat.label}
          className="bg-white shadow rounded-lg px-6 py-5 flex flex-col flex-1 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <span className="text-[22px] font-semibold text-gray-800">{stat.value}</span>
            <span
              className={`ml-2 text-xs font-semibold ${stat.positive && stat.change.includes("+") ? "text-green-500" : "text-red-500"}`}
            >
              {stat.change}
            </span>
          </div>
          <span className="text-gray-500 text-sm mt-1">{stat.label}</span>
        </div>
      ))}
    </div>
  );
};
