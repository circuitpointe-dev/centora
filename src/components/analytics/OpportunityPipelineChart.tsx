
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const opportunityData = [
  { name: "Identified", value: 40, color: "#8B5CF6" },
  { name: "Qualified", value: 30, color: "#F59E0B" },
  { name: "Lead", value: 20, color: "#3B82F6" },
  { name: "Approved", value: 10, color: "#10B981" },
];

const summaryStats = [
  { label: "New Opportunities", value: 10, color: "#8B5CF6" },
  { label: "Qualified Opportunities", value: 5, color: "#10B981" },
];

export const OpportunityPipelineChart: React.FC = () => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-[16px] font-semibold">Opportunity Pipeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3">
          {summaryStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-2"
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: stat.color }}
              />
              <div>
                <div className="text-sm font-medium text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Opportunity by Stage Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Opportunity by Stage</h4>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={opportunityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={50}
                  dataKey="value"
                  stroke="none"
                >
                  {opportunityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => [`${value}%`, "Percentage"]} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="flex flex-col gap-2">
              {opportunityData.map((entry) => (
                <div className="flex items-center gap-2 text-xs" key={entry.name}>
                  <span
                    className="block w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-gray-700">{entry.value}% {entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
