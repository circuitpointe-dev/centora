import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Users, 
  CheckCircle, 
  ClipboardList,
  Filter,
  Package,
  FileText,
  Clock
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
  Tooltip,
  PieChart,
  Pie,
  Cell
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

// Platform Reports data
const completionOverTimeData = [
  { month: 'Jan', completions: 100 },
  { month: 'Feb', completions: 450 },
  { month: 'Mar', completions: 150 },
  { month: 'Apr', completions: 300 },
  { month: 'May', completions: 400 },
];

const activeLearnersByDeptData = [
  { name: 'Field Operation', value: 21 },
  { name: 'Programs', value: 30 },
  { name: 'HR', value: 50 },
  { name: 'Marketing Strategy', value: 18 },
];

const courseProgressData = [
  { name: 'Field Operation', progress: 21 },
  { name: 'Programs', progress: 30 },
  { name: 'HR', progress: 50 },
  { name: 'Marketing Strategy', progress: 18 },
];

const topCoursesData = [
  { name: 'Digital Tools Intro', engagement: 86 },
  { name: 'Intro To Finance Management', engagement: 70 },
  { name: 'How To Market Your Idea', engagement: 51 },
];

const disbursementData = [
  { name: 'OK', value: 5, color: '#10B981' },
  { name: 'Auto-captions', value: 2, color: '#F59E0B' },
  { name: 'Missing captions/Alt', value: 1, color: '#EF4444' },
];

const departmentSnapshotData = [
  { department: 'Field Ops', activeUsers: 210, enrolled: 380, completion: 50 },
  { department: 'Programs', activeUsers: 180, enrolled: 320, completion: 45 },
  { department: 'HR', activeUsers: 150, enrolled: 280, completion: 60 },
  { department: 'Marketing', activeUsers: 120, enrolled: 200, completion: 40 },
];

const ReportsAnalytics = () => {
  const [activeTab, setActiveTab] = useState<'platform' | 'course'>('platform');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border border-border rounded-lg shadow-lg">
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-sm text-purple-600 dark:text-purple-400">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Report & analytic</h1>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex items-center justify-between">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('platform')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'platform'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              Platform reports
            </button>
            <button
              onClick={() => setActiveTab('course')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'course'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
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
            <Card className="bg-card border-border rounded-xl">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">2590</p>
                  <p className="text-sm font-medium text-muted-foreground">Total enrollements</p>
                </div>
              </CardContent>
            </Card>

            {/* Active Learners */}
            <Card className="bg-card border-border rounded-xl">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">95</p>
                  <p className="text-sm font-medium text-muted-foreground">Active learners</p>
                </div>
              </CardContent>
            </Card>

            {/* Completion Rate */}
            <Card className="bg-card border-border rounded-xl">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">62%</p>
                  <p className="text-sm font-medium text-muted-foreground">Completion rate</p>
                </div>
              </CardContent>
            </Card>

            {/* Average Quiz Score */}
            <Card className="bg-card border-border rounded-xl">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                    <ClipboardList className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">84%</p>
                  <p className="text-sm font-medium text-muted-foreground">Average quiz score</p>
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
                    <span className="text-sm text-muted-foreground">Low</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-purple-600 rounded"></div>
                    <span className="text-sm text-muted-foreground">High</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Platform Reports Tab */}
      {activeTab === 'platform' && (
        <div className="space-y-6">
          {/* Key Metrics Cards - 5 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Total Enrollments */}
            <Card className="bg-card border-border rounded-xl">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                    <Package className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">2590</p>
                  <p className="text-sm font-medium text-muted-foreground">Total enrollements</p>
                </div>
              </CardContent>
            </Card>

            {/* Active Learners */}
            <Card className="bg-card border-border rounded-xl">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">95</p>
                  <p className="text-sm font-medium text-muted-foreground">Active learners</p>
                </div>
              </CardContent>
            </Card>

            {/* Completions (%) */}
            <Card className="bg-card border-border rounded-xl">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">60%</p>
                  <p className="text-sm font-medium text-muted-foreground">Completions (%)</p>
                </div>
              </CardContent>
            </Card>

            {/* Average completion rate */}
            <Card className="bg-card border-border rounded-xl">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">62%</p>
                  <p className="text-sm font-medium text-muted-foreground">Average completion rate</p>
                </div>
              </CardContent>
            </Card>

            {/* Time spent (median) */}
            <Card className="bg-card border-border rounded-xl">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mb-4">
                    <Clock className="h-8 w-8 text-pink-600 dark:text-pink-400" />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">38min</p>
                  <p className="text-sm font-medium text-muted-foreground">Time spent (median)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section - Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Completion Over Time Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Completion Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={completionOverTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 800]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="completions" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Active Learners By Department Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Active Learners By Department</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={activeLearnersByDeptData}>
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

          {/* Charts Section - Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course Progress Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Course Progress Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={courseProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 60]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="progress" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Courses By Engagement List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Top Courses By Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topCoursesData.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium text-gray-900">{course.name}</span>
                      <span className="text-purple-600 dark:text-purple-400 font-semibold">{course.engagement}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section - Row 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Disbursement status Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Disbursement status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={disbursementData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {disbursementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-4 mt-4">
                  {disbursementData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Department Snapshot Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Department Snapshot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-sm font-medium text-muted-foreground">Department</th>
                        <th className="text-left py-2 text-sm font-medium text-muted-foreground">Active users</th>
                        <th className="text-left py-2 text-sm font-medium text-muted-foreground">Enrolled</th>
                        <th className="text-left py-2 text-sm font-medium text-muted-foreground">Completion %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentSnapshotData.map((dept, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 text-sm text-gray-900">{dept.department}</td>
                          <td className="py-3 text-sm text-muted-foreground">{dept.activeUsers}</td>
                          <td className="py-3 text-sm text-muted-foreground">{dept.enrolled}</td>
                          <td className="py-3 text-sm text-muted-foreground">{dept.completion}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsAnalytics;
