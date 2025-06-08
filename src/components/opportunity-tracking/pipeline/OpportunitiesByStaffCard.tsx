
import React from "react";
import { Card } from "@/components/ui/card";

// Demo: Hardcoded staff with completion/outstanding for development
const devStaffMetric = [
  {
    name: "Amina Yusuf",
    completed: 2,
    total: 4,
  },
  {
    name: "Fatima Bello",
    completed: 1,
    total: 3,
  },
  {
    name: "Emeka Nwankwo",
    completed: 3,
    total: 3,
  },
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface OpportunitiesByStaffCardProps {
  onViewAll: () => void;
  month: number;
}

const OpportunitiesByStaffCard: React.FC<OpportunitiesByStaffCardProps> = ({
  onViewAll,
  month,
}) => {
  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold">Opportunities by Staff - {MONTHS[month]}</span>
        <button
          className="text-violet-600 text-sm underline hover:font-semibold"
          onClick={onViewAll}
        >
          View All
        </button>
      </div>
      <div className="space-y-6 flex-1">
        {devStaffMetric.map(s => (
          <div key={s.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold">{s.name}</span>
              <span className="text-sm text-gray-500">{s.completed}/{s.total} completed opportunities</span>
            </div>
            <div className="w-full bg-gray-100 rounded h-2 overflow-hidden">
              <div
                className="bg-violet-500 h-2 rounded"
                style={{ width: s.total > 0 ? `${Math.round((s.completed / s.total) * 100)}%` : "0%" }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default OpportunitiesByStaffCard;
