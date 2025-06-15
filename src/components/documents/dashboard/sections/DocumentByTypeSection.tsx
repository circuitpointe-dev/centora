
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

  // Custom legend, shows name and value stacked vertically, aligned right
  const CustomLegend = ({
    payload,
  }: {
    payload: { value: string; color: string; payload: { value: number } }[];
  }) => (
    <div className="flex flex-col items-start space-y-3 min-w-[120px]">
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
        <div className="flex flex-row items-center justify-between w-full h-80">
          <div className="flex-1 h-full flex items-center justify-center">
            <div className="h-64 w-full flex items-center">
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
          </div>
          <div className="flex-shrink-0 ml-8">
            <CustomLegend
              payload={documentTypes.map((item) => ({
                value: item.name,
                color: item.color,
                payload: item,
              }))}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
