
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { File, Clock, AlertTriangle, CheckCircle, Upload, FolderOpen, BookOpen, Shield, Settings } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { StatisticsCardSection } from ".dashboard/sections/StatisticsCardSection";

const DocumentsDashboard = () => {
  // Mock data for charts and statistics
  const documentTypeData = [
    { name: 'Policies', value: 35, fill: '#3b82f6' },
    { name: 'Contracts', value: 25, fill: '#10b981' },
    { name: 'Finance', value: 25, fill: '#f59e0b' },
    { name: 'Reports', value: 15, fill: '#ef4444' }
  ];

  const departmentData = [
    { department: 'Finance', count: 320 },
    { department: 'Operations', count: 280 },
    { department: 'Legal', count: 240 },
    { department: 'IT', count: 180 },
    { department: 'HR', count: 150 }
  ];

  const notifications = [
    {
      id: 1,
      icon: AlertTriangle,
      iconColor: 'text-red-500',
      title: 'Contract Expiring Soon',
      details: 'Service Agreement XYZ expires in 5 days',
      time: '2 hours ago'
    },
    {
      id: 2,
      icon: Clock,
      iconColor: 'text-yellow-500',
      title: 'Signature Request Pending',
      details: 'Policy document awaiting approval from Legal',
      time: '4 hours ago'
    },
    {
      id: 3,
      icon: CheckCircle,
      iconColor: 'text-green-500',
      title: 'Document Approved',
      details: 'Finance Policy v2.1 has been approved',
      time: '1 day ago'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      icon: Upload,
      iconColor: 'text-blue-500',
      title: 'New Document Uploaded',
      details: 'Employee Handbook v3.0 uploaded by HR Team',
      time: '30 minutes ago'
    },
    {
      id: 2,
      icon: CheckCircle,
      iconColor: 'text-green-500',
      title: 'Document Signed',
      details: 'Vendor Agreement signed by Operations',
      time: '1 hour ago'
    },
    {
      id: 3,
      icon: AlertTriangle,
      iconColor: 'text-orange-500',
      title: 'Compliance Alert',
      details: 'Annual audit documents due next week',
      time: '2 hours ago'
    },
    {
      id: 4,
      icon: File,
      iconColor: 'text-purple-500',
      title: 'Template Updated',
      details: 'Contract template revised by Legal',
      time: '3 hours ago'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-medium text-gray-900">
          Document Management Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Overview of documents, signatures, and compliance status
        </p>
      </div>

      {/* Section 1: Statistics Cards */}
      <StatisticsCardSection />

      {/* Section 2: Documents by Type and Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Documents by Type</CardTitle>
            <CardDescription>Distribution of document categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                policies: { label: "Policies", color: "#3b82f6" },
                contracts: { label: "Contracts", color: "#10b981" },
                finance: { label: "Finance", color: "#f59e0b" },
                reports: { label: "Reports", color: "#ef4444" }
              }}
              className="h-[300px]"
            >
              <PieChart>
                <Pie
                  data={documentTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {documentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Upload className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Upload Document</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <FolderOpen className="h-5 w-5 text-green-600" />
                <span className="font-medium">Go to Document Repository</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Access Templates & Library</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Shield className="h-5 w-5 text-orange-600" />
                <span className="font-medium">View Compliance Summary</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Settings className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Open Settings</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 3: Documents by Department and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Documents by Department</CardTitle>
            <CardDescription>Document count across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Document Count", color: "#3b82f6" }
              }}
              className="h-[300px]"
            >
              <BarChart data={departmentData} layout="horizontal" margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 400]} tickCount={9} />
                <YAxis dataKey="department" type="category" width={60} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Recent alerts and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <IconComponent className={`h-5 w-5 ${notification.iconColor} mt-0.5`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-gray-600">{notification.details}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 4: Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-start-2 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest document management activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 border-l-4 border-gray-200 bg-gray-50 rounded-r-lg">
                      <IconComponent className={`h-5 w-5 ${activity.iconColor} mt-0.5`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-gray-600">{activity.details}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentsDashboard;
