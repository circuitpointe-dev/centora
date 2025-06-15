
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

export const DocumentByTypeSection = (): JSX.Element => {
  // Document types data for the chart
  const documentTypes = [
    { name: "Policies", value: 16, color: "#3b82f6" },
    { name: "Contracts", value: 28, color: "#ef4444" },
    { name: "Finance", value: 24, color: "#a855f7" },
    { name: "Reports", value: 32, color: "#10b981" },
  ];

  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-col space-y-2">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">
              {entry.value} ({entry.payload.value}%)
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="border border-gray-200 shadow-sm rounded-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Documents by Type
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between h-80">
          <div className="flex-1">
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
                >
                  {documentTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-shrink-0 ml-6">
            <CustomLegend payload={documentTypes.map(item => ({ 
              value: item.name, 
              color: item.color, 
              payload: item 
            }))} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
