
import React from "react";

const statsData = {
  "this-month": [
    { label: "Proposals Submitted", value: "124", change: "+12%", positive: true },
    { label: "Success Rate", value: "68%", change: "+5%", positive: true },
    { label: "Total Funds Raised", value: "$2.4M", change: "-12%", positive: false },
    { label: "Average Grant Size", value: "$45K", change: "+12%", positive: true },
  ],
  "this-quarter": [
    { label: "Proposals Submitted", value: "385", change: "+18%", positive: true },
    { label: "Success Rate", value: "72%", change: "+8%", positive: true },
    { label: "Total Funds Raised", value: "$7.2M", change: "+15%", positive: true },
    { label: "Average Grant Size", value: "$48K", change: "+7%", positive: true },
  ],
  "last-12-months": [
    { label: "Proposals Submitted", value: "1,542", change: "+25%", positive: true },
    { label: "Success Rate", value: "65%", change: "+3%", positive: true },
    { label: "Total Funds Raised", value: "$28.5M", change: "+22%", positive: true },
    { label: "Average Grant Size", value: "$52K", change: "+15%", positive: true },
  ],
  "custom": [
    { label: "Proposals Submitted", value: "89", change: "+8%", positive: true },
    { label: "Success Rate", value: "61%", change: "-2%", positive: false },
    { label: "Total Funds Raised", value: "$1.8M", change: "+5%", positive: true },
    { label: "Average Grant Size", value: "$42K", change: "+3%", positive: true },
  ],
};

export const AnalyticsStatCards: React.FC<{ 
  variant: "this-month" | "generate-report";
  selectedPeriod?: string;
}> = ({ variant, selectedPeriod = "this-month" }) => {
  // For generate-report tab, use this-month data with slight variations
  let stats = variant === "generate-report" 
    ? statsData["this-month"].map((stat, i) => ({
        ...stat,
        change: i === 1 ? "+6%" : i === 2 ? "-13%" : stat.change
      }))
    : statsData[selectedPeriod as keyof typeof statsData] || statsData["this-month"];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
