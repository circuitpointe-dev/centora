import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const disbursementProgressData = [
  { name: 'Fully Distributed', value: 45 },
  { name: 'Grants Below 50%', value: 35 },
  { name: 'Grants Below 25%', value: 25 },
  { name: 'Grants Below 15%', value: 15 },
  { name: 'Grants Below 60%', value: 60 },
];

const disbursementStatusData = [
  { name: 'Disbursed', value: 65, color: '#10B981' },
  { name: 'Scheduled', value: 25, color: '#F59E0B' },
  { name: 'Delayed', value: 10, color: '#EF4444' },
];

export const DisbursementCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Bar Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Disbursement Progress By Grant</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={disbursementProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Doughnut Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Disbursement Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={disbursementStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {disbursementStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span style={{ color: entry.color }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};