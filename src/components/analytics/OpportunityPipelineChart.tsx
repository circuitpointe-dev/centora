
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users } from "lucide-react";

const opportunityData = [
  { name: "Identified", value: 40, color: "#8B5CF6" },
  { name: "Qualified", value: 30, color: "#F59E0B" },
  { name: "Lead", value: 20, color: "#3B82F6" },
  { name: "Approved", value: 10, color: "#10B981" },
];

const summaryStats = [
  { 
    label: "New Opportunities", 
    value: 10, 
    icon: TrendingUp,
    iconColor: "#7C3AED", // Deep purple
    backgroundColor: "#F3E8FF", // Light purple background
  },
  { 
    label: "Qualified Opportunities", 
    value: 5, 
    icon: Users,
    iconColor: "#059669", // Deep green
    backgroundColor: "#ECFDF5", // Light green background
  },
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
          {summaryStats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-lg px-3 py-2 flex items-center gap-2"
                style={{ backgroundColor: stat.backgroundColor }}
              >
                <IconComponent 
                  size={16} 
                  style={{ color: stat.iconColor }}
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Opportunity by Stage Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Opportunity by Stage</h4>
          <div className="flex items-center justify-center h-56">
            <div className="flex items-center gap-8">
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
                    {opportunityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                </PieChart>
              </ResponsiveContainer>
              
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
