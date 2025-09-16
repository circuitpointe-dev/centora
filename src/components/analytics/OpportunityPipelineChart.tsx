
import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useOpportunities } from "@/hooks/useOpportunities";

export const OpportunityPipelineChart: React.FC = () => {
  const { data: opportunities = [] } = useOpportunities();

  const opportunityData = useMemo(() => {
    const statusCounts = opportunities.reduce((acc, opp) => {
      acc[opp.status] = (acc[opp.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = opportunities.length || 1;
    const colors = {
      "To Review": "#8B5CF6",
      "In Progress": "#F59E0B", 
      "Awarded": "#10B981",
      "Rejected": "#EF4444"
    };

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: Math.round((count / total) * 100),
      color: colors[status as keyof typeof colors] || "#6B7280"
    }));
  }, [opportunities]);

  const summaryStats = useMemo(() => {
    const newOpportunities = opportunities.filter(opp => {
      const createdDate = new Date(opp.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdDate >= thirtyDaysAgo;
    }).length;

    const forecastRevenue = opportunities
      .filter(opp => opp.status === 'In Progress' || opp.status === 'To Review')
      .reduce((sum, opp) => sum + (opp.amount || 0), 0);

    return [
      { 
        label: "New Opportunities", 
        value: newOpportunities.toString(), 
        change: "", 
        positive: true
      },
      { 
        label: "Forecast Revenue", 
        value: `$${(forecastRevenue / 1000000).toFixed(1)}M`, 
        change: "", 
        positive: true
      },
    ];
  }, [opportunities]);
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
