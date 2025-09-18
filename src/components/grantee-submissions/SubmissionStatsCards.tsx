import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useGranteeSubmissions } from '@/hooks/grants/useGranteeSubmissions';

const STATUS_COLORS = {
  'Pending review': '#f59e0b',
  'Revision requested': '#ef4444',
  'Approved': '#22c55e'
};

const OVERDUE_COLORS = {
  'Narrative': '#3b82f6',
  'Financial': '#8b5cf6',
  'M&E': '#22c55e',
  'Other': '#f59e0b',
  'Compliance': '#06b6d4'
};

const CustomLegend = ({ payload }: any) => (
  <div className="flex flex-wrap justify-center gap-4 mt-4">
    {payload.map((entry: any, index: number) => (
      <div key={index} className="flex items-center gap-2">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: entry.color }}
        />
        <span className="text-sm text-gray-600">
          {entry.payload.name}: {entry.payload.value}
        </span>
      </div>
    ))}
  </div>
);

export const SubmissionStatsCards = () => {
  const { submissions, loading } = useGranteeSubmissions();

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6 flex items-center justify-center h-64">
            <div className="text-center">Loading...</div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardContent className="p-6 flex items-center justify-center h-64">
            <div className="text-center">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Status Summary Data from real submissions
  const statusCounts = submissions.reduce((acc, submission) => {
    const status = submission.status === 'pending_review' ? 'Pending review' : 
                  submission.status === 'revision_requested' ? 'Revision requested' :
                  submission.status === 'approved' ? 'Approved' : submission.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
    fill: STATUS_COLORS[name as keyof typeof STATUS_COLORS] || '#6b7280'
  }));

  // Submissions by type data
  const typeCounts = submissions.reduce((acc, submission) => {
    acc[submission.submission_type] = (acc[submission.submission_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeData = Object.entries(typeCounts).map(([name, value]) => ({
    name,
    value,
    fill: OVERDUE_COLORS[name as keyof typeof OVERDUE_COLORS] || '#6b7280'
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Submission Status Summary */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base font-medium">Submission status summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Submissions by Type */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base font-medium">Submissions by type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {typeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No submissions data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};