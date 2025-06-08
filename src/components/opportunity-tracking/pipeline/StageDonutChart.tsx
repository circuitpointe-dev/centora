
import React from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { Opportunity } from "@/types/opportunity";
import { Card } from "@/components/ui/card";

// Custom legend renderer to show percentage + label
function renderLegend(data: any[], total: number) {
  return (
    <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-4">
      {data.map((entry) => {
        const percent = total === 0 ? 0 : Math.round((entry.value / total) * 100);
        return (
          <li key={entry.name} className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <span className="w-3 h-3 rounded-full" style={{ background: entry.fill }} />
            <span>{percent}% {entry.name}</span>
          </li>
        );
      })}
    </ul>
  );
}

const STAGE_COLORS: Record<string, string> = {
  Identified: "#7c3aed",
  Qualified: "#f59e42",
  Sent: "#2563eb",
  Approved: "#10b981",
};

const STAGE_LABELS: Record<string, string> = {
  Identified: "Identified",
  Qualified: "Qualified",
  Sent: "Sent",
  Approved: "Approved",
};

interface StageDonutChartProps {
  opportunities: Opportunity[];
}

function getData(opportunities: Opportunity[]) {
  const map: Record<string, number> = {};
  opportunities.forEach(o => {
    if (o.pipeline) {
      map[o.pipeline] = (map[o.pipeline] || 0) + 1;
    }
  });
  return Object.entries(map).map(([key, value]) => ({
    name: STAGE_LABELS[key] || key,
    value,
    fill: STAGE_COLORS[key] || "#e0e7ef",
  }));
}

const StageDonutChart: React.FC<StageDonutChartProps> = ({ opportunities }) => {
  const data = getData(opportunities);
  const total = data.reduce((a, c) => a + c.value, 0);

  return (
    <Card className="p-6 flex flex-col h-full">
      <div className="font-semibold mb-4">Opportunity by Stage</div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <ResponsiveContainer width="100%" height={210}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              // Remove internal label
              label={false}
              stroke="white"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {renderLegend(data, total)}
      </div>
    </Card>
  );
};

export default StageDonutChart;
