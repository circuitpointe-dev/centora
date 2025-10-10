import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Users, 
  CheckCircle, 
  ClipboardList,
  Filter
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip
} from 'recharts';

// Mock data for the charts - matching the design exactly
const enrollmentData = [
  { month: 'Jan', enrollments: 200 },
  { month: 'Feb', enrollments: 800 },
  { month: 'Mar', enrollments: 400 },
  { month: 'Apr', enrollments: 600 },
  { month: 'May', enrollments: 700 },
];

const moduleFunnelData = [
  { name: 'Field Operation', value: 21 },
  { name: 'Programs', value: 30 },
  { name: 'HR', value: 50 },
  { name: 'Marketing Strategy', value: 18 },
];

const quizScoreData = [
  { name: 'Field Operation', score: 21 },
  { name: 'Programs', score: 30 },
  { name: 'Marketing Strategy', score: 18 },
  { name: 'HR', score: 50 },
  { name: 'Marketing Strategy', score: 18 },
  { name: 'Programs', score: 30 },
  { name: 'Field Operation', score: 21 },
];

// Heat map data for course analytics - matching the design with 7 columns
const heatMapData = [
  { category: 'Field Operation', col1: 'high', col2: 'low', col3: 'low', col4: 'high', col5: 'low', col6: 'high', col7: 'high' },
  { category: 'Programs', col1: 'high', col2: 'low', col3: 'high', col4: 'low', col5: 'high', col6: 'low', col7: 'low' },
  { category: 'Marketing Strategy', col1: 'high', col2: 'low', col3: 'low', col4: 'high', col5: 'low', col6: 'high', col7: 'low' },
  { category: 'Finance', col1: 'high', col2: 'low', col3: 'high', col4: 'low', col5: 'high', col6: 'low', col7: 'low' },
];

const ReportsAnalytics = () => {
  const [activeTab, setActiveTab] = useState<'platform' | 'course'>('course');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-purple-600">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Report & analytic</h1>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('platform')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'platform'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Platform reports
            </button>
            <button
              onClick={() => setActiveTab('course')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'course'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Course analytics
            </button>
          </nav>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>
      </div>

      {/* Course Analytics Tab - Default Active */}
      {activeTab === 'course' && (
        <div className="space-y-6">
          {/* Key Metrics Cards - 4 cards matching the design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Enrollments */}
            <Card className="bg-purple-50 border-purple-200 rounded-xl">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">2590</p>
                  <p className="text-sm font-medium text-gray-600">Total enrollements</p>
                </div>
              </CardContent>
            </Card>

            {/* Active Learners */}
            <Card className="bg-green-50 border-green-200 rounded-xl">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">95</p>
                  <p className="text-sm font-medium text-gray-600">Active learners</p>
                </div>
              </CardContent>
            </Card>

            {/* Completion Rate */}
            <Card className="bg-blue-50 border-blue-200 rounded-xl">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">62%</p>
                  <p className="text-sm font-medium text-gray-600">Completion rate</p>
                </div>
              </CardContent>
            </Card>

            {/* Average Quiz Score */}
            <Card className="bg-orange-50 border-orange-200 rounded-xl">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <ClipboardList className="h-8 w-8 text-orange-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">84%</p>
                  <p className="text-sm font-medium text-gray-600">Average quiz score</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section - Row 1: Enrollment Over Time */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enrollment Over Time Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Enrollment Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 800]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="enrollments" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Module Funnel / Top Drop-Offs Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Module Funnel / Top Drop-Offs</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={moduleFunnelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 60]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Quiz Score Distribution Chart - Full Width */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Quiz Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={quizScoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[0, 60]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="score" fill="#8B5CF6" radius={[4, 4, 0, 0]} label={{ position: 'top', fill: '#8B5CF6', fontSize: 12 }} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Engagement Heat-Map - Full Width */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Engagement Heat-Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Heat Map Grid */}
                <div className="grid grid-cols-8 gap-2">
                  {/* Header row */}
                  <div></div>
                  <div className="text-xs text-gray-500 text-center"></div>
                  <div className="text-xs text-gray-500 text-center"></div>
                  <div className="text-xs text-gray-500 text-center"></div>
                  <div className="text-xs text-gray-500 text-center"></div>
                  <div className="text-xs text-gray-500 text-center"></div>
                  <div className="text-xs text-gray-500 text-center"></div>
                  <div className="text-xs text-gray-500 text-center"></div>
                  
                  {/* Data rows */}
                  {heatMapData.map((row, index) => (
                    <React.Fragment key={index}>
                      <div className="text-sm font-medium text-gray-700 flex items-center">
                        {row.category}
                      </div>
                      <div className={`w-8 h-8 rounded ${
                        row.col1 === 'high' ? 'bg-purple-600' : 'bg-purple-200'
                      }`}></div>
                      <div className={`w-8 h-8 rounded ${
                        row.col2 === 'high' ? 'bg-purple-600' : 'bg-purple-200'
                      }`}></div>
                      <div className={`w-8 h-8 rounded ${
                        row.col3 === 'high' ? 'bg-purple-600' : 'bg-purple-200'
                      }`}></div>
                      <div className={`w-8 h-8 rounded ${
                        row.col4 === 'high' ? 'bg-purple-600' : 'bg-purple-200'
                      }`}></div>
                      <div className={`w-8 h-8 rounded ${
                        row.col5 === 'high' ? 'bg-purple-600' : 'bg-purple-200'
                      }`}></div>
                      <div className={`w-8 h-8 rounded ${
                        row.col6 === 'high' ? 'bg-purple-600' : 'bg-purple-200'
                      }`}></div>
                      <div className={`w-8 h-8 rounded ${
                        row.col7 === 'high' ? 'bg-purple-600' : 'bg-purple-200'
                      }`}></div>
                    </React.Fragment>
                  ))}
                </div>
                
                {/* Legend */}
                <div className="flex items-center justify-end space-x-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-purple-200 rounded"></div>
                    <span className="text-sm text-gray-600">Low</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-purple-600 rounded"></div>
                    <span className="text-sm text-gray-600">High</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Platform Reports Tab - Placeholder */}
      {activeTab === 'platform' && (
        <div className="space-y-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Platform reports content would go here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsAnalytics;
