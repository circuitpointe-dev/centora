
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export const DocumentByTypeSection = (): JSX.Element => {
  // Document types data for the chart
  const documentTypes = [
    { name: "Policies", value: 16, color: "#3b82f6" },
    { name: "Contracts", value: 28, color: "#ef4444" },
    { name: "Finance", value: 24, color: "#a855f7" },
    { name: "Reports", value: 32, color: "#10b981" },
  ];

  // Custom legend, stacked vertically, left-aligned, and closer to the chart
  const CustomLegend = ({
    payload,
  }: {
    payload: { value: string; color: string; payload: { value: number } }[];
  }) => (
    <div className="flex flex-col justify-center space-y-3 min-w-[120px]">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center space-x-3">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm font-medium text-gray-700">
            {entry.value} <span className="text-gray-500">({entry.payload.value}%)</span>
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="border border-gray-200 shadow-sm rounded-sm h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Documents by Type
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex w-full h-80 items-center justify-center">
          {/* Layout: chart centered horizontally with legend immediately right */}
          <div className="flex flex-row items-center mx-auto">
            {/* Center the pie chart vertically */}
            <div className="flex items-center justify-center h-64 w-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={documentTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    isAnimationActive={false}
                  >
                    {documentTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend closely to the right, left-aligned with chart */}
            <div className="ml-4 flex items-center self-center">
              <CustomLegend
                payload={documentTypes.map((item) => ({
                  value: item.name,
                  color: item.color,
                  payload: item,
                }))}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
