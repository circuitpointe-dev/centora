
import React from "react";
import { useDonors } from "@/hooks/useDonors";

export const DonorSnapshotCards: React.FC = () => {
  const { data: donors = [] } = useDonors();
  
  const totalDonors = donors.length;
  const activeDonors = donors.filter(donor => donor.status === 'active').length;
  
  const donorStats = [
    { label: "Total donors", value: totalDonors.toString(), change: "", positive: true },
    { label: "Active donors", value: activeDonors.toString(), change: "", positive: true },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {donorStats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white shadow rounded-lg px-4 py-4 flex flex-col border border-gray-100"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xl font-semibold text-gray-800">{stat.value}</span>
            <span
              className={`text-xs font-semibold ${
                stat.positive && stat.change.includes("+") 
                  ? "text-green-500" 
                  : "text-red-500"
              }`}
            >
              {stat.change}
            </span>
          </div>
          <span className="text-gray-600 text-sm">{stat.label}</span>
        </div>
      ))}
    </div>
  );
};
