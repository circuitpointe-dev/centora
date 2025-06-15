
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

export const DocumentByDepartmentSection = (): JSX.Element => {
  // Chart data
  const departmentData = [
    { name: "Finance", value: 165 },
    { name: "Operations", value: 346 },
    { name: "HR", value: 442 },
    { name: "Legal", value: 61 },
    { name: "IT", value: 284 },
  ];

  return (
    <Card className="border border-gray-200 shadow-sm rounded-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Documents by Department
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={departmentData}
              layout="horizontal"
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                type="number" 
                domain={[0, 'dataMax']}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                width={50}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey="value" 
                fill="#3b82f6" 
                radius={[0, 2, 2, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
