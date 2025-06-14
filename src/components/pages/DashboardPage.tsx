
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, DollarSign, UserPlus, Plus, FileText, BarChart as BarChartIcon, File, Clock, AlertTriangle, CheckCircle, Upload, FolderOpen, BookOpen, Shield, Settings, Building2, Users2, Scale, Monitor } from 'lucide-react';
import { CalendarCard } from '@/components/fundraising/CalendarCard';
import { DeadlinesCard } from '@/components/fundraising/DeadlinesCard';
import NewDonorDialog from '@/components/fundraising/NewDonorDialog';
import AddOpportunityDialog from '@/components/opportunity-tracking/AddOpportunityDialog';
import CreateProposalDialog from '@/components/proposal-management/CreateProposalDialog';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
  const { module, feature } = useParams();
  const navigate = useNavigate();
  const [showAddOpportunityDialog, setShowAddOpportunityDialog] = useState(false);
  const [showCreateProposalDialog, setShowCreateProposalDialog] = useState(false);
  
  const getModuleName = (moduleId: string) => {
    const moduleNames: { [key: string]: string } = {
      fundraising: 'Fundraising',
      programme: 'Programme Management',
      procurement: 'Procurement',
      inventory: 'Inventory Management',
      finance: 'Finance & Control',
      learning: 'Learning Management',
      documents: 'Document Management',
      hr: 'HR Management',
      users: 'User Management',
      grants: 'Grants Management',
    };
    return moduleNames[moduleId] || moduleId;
  };

  // Mock donors data for opportunity dialog
  const mockDonors = [
    { id: 'donor-1', name: 'Gates Foundation' },
    { id: 'donor-2', name: 'Ford Foundation' },
    { id: 'donor-3', name: 'Rockefeller Foundation' },
  ];

  const handleAddOpportunity = (opportunity: any) => {
    console.log('New opportunity:', opportunity);
    setShowAddOpportunityDialog(false);
  };

  const handleGenerateReports = () => {
    navigate('/dashboard/fundraising/fundraising-analytics?tab=generate-report');
  };

  // Grants-specific content - redirect to grants-manager
  if (module === 'grants') {
    // If we're on the generic dashboard route for grants, redirect to grants-manager
    if (feature === 'dashboard' || !feature) {
      navigate('/dashboard/grants/grants-manager', { replace: true });
      return null;
    }
  }

  // Document Management specific content
  if (module === 'documents') {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: '#e0f2fe' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documents Uploaded</CardTitle>
              <File className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-gray-500">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: '#fef3c7' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Signature Requests</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-gray-500">
                -2 from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: '#fecaca' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents Expiring in 30 Days</CardTitle>
              <Clock className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-gray-500">
                Requires attention
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: '#d1fae5' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Acknowledged Policies</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-gray-500">
                +3% from last week
              </p>
            </CardContent>
          </Card>
        </div>

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
  }

  // Fundraising-specific content
  if (module === 'fundraising') {
    return (
      <div className="space-y-6">
        {/* Header with Title and Quick Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h1 className="text-xl font-medium text-gray-900">
            {getModuleName(module || '')} Dashboard
          </h1>
          
          {/* Quick Actions as Components - Responsive Grid */}
          <div className="grid grid-cols-2 lg:flex lg:items-center gap-2 lg:gap-4">
            <NewDonorDialog 
              triggerButton={
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add New Donor</span>
                  <span className="sm:hidden">Add Donor</span>
                </button>
              }
            />
            <button 
              onClick={() => setShowAddOpportunityDialog(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create New Opportunity</span>
              <span className="sm:hidden">New Opportunity</span>
            </button>
            <button 
              onClick={() => setShowCreateProposalDialog(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Create Proposal</span>
              <span className="sm:hidden">Create Proposal</span>
            </button>
            <button 
              onClick={handleGenerateReports}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <BarChart className="h-4 w-4" />
              <span className="hidden sm:inline">Generate Reports</span>
              <span className="sm:hidden">Reports</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards - Fundraising specific */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: '#efe8fd' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">
                +2 this month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: '#dce3ef' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-muted-foreground">
                +5% from last quarter
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: '#fce3f0' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Opportunities</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                +3 new this week
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: '#fef3cd' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Funds Raised this Quarter</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2.3M</div>
              <p className="text-xs text-muted-foreground">
                +15% from last quarter
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar and Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CalendarCard />
          </div>
          <div>
            <DeadlinesCard />
          </div>
        </div>

        {/* Dialogs */}
        <AddOpportunityDialog
          isOpen={showAddOpportunityDialog}
          onClose={() => setShowAddOpportunityDialog(false)}
          onAddOpportunity={handleAddOpportunity}
          donors={mockDonors}
        />

        <CreateProposalDialog
          open={showCreateProposalDialog}
          onOpenChange={setShowCreateProposalDialog}
        />
      </div>
    );
  }

  // Default content for other modules
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {getModuleName(module || '')} Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Overview and key metrics for {getModuleName(module || '').toLowerCase()}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 new this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              +4 since last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground">
              +2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Activity item {item}</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for this module</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm">Create New Record</div>
                <div className="text-xs text-gray-500">Add a new entry to the system</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm">Generate Report</div>
                <div className="text-xs text-gray-500">Create a detailed report</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm">View Analytics</div>
                <div className="text-xs text-gray-500">Check performance metrics</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
