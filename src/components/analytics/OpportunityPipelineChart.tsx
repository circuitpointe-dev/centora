
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, DollarSign } from "lucide-react";

const opportunityData = [
  { name: "Identified", value: 40, color: "#8B5CF6" },
  { name: "Qualified", value: 30, color: "#F59E0B" },
  { name: "Lead", value: 20, color: "#3B82F6" },
  { name: "Approved", value: 10, color: "#10B981" },
];

const summaryStats = [
  { 
    label: "New Opportunities", 
    value: "10", 
    change: "+8%", 
    positive: true
  },
  { 
    label: "Forecast Revenue", 
    value: "$2.4M", 
    change: "+15%", 
    positive: true
  },
];

export const OpportunityPipelineChart: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        {summaryStats.map((stat) => (
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

      {/* Opportunity by Stage Chart */}
      <div>
        <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[16px] font-semibold">
          Opportunity by Stage
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-56">
        <div className="flex items-center gap-8">
          {/* Pie Chart */}
          <ResponsiveContainer width={200} height={180}>
            <PieChart>
              <Pie
                data={opportunityData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
                stroke="none"
              >
                {opportunityData.map((entry, idx) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(value) => [`${value}%`, "Percentage"]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex flex-col gap-3">
            {opportunityData.map((entry) => (
              <div className="flex items-center gap-2 text-sm" key={entry.name}>
                <span
                  className="block w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-700">{entry.name}</span>
                <span className="text-gray-500">({entry.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
      </div>
    </div>
  );
};
