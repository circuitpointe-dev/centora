import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const projectHealthData = [
  { name: 'Project A', onTrack: 70, atRisk: 20, delayed: 10 },
  { name: 'Project B', onTrack: 60, atRisk: 30, delayed: 10 },
  { name: 'Project C', onTrack: 80, atRisk: 15, delayed: 5 },
  { name: 'Project D', onTrack: 50, atRisk: 25, delayed: 25 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ProgrammeProjectHealthChart = () => {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">Project Health</CardTitle>
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2">
          <ExternalLink className="h-4 w-4 mr-1" />
          View details
        </Button>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={projectHealthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="onTrack" 
              stackId="a" 
              fill="#22c55e" 
              name="On-Track" 
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="atRisk" 
              stackId="a" 
              fill="#eab308" 
              name="At Risk" 
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="delayed" 
              stackId="a" 
              fill="#ef4444" 
              name="Delayed" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};