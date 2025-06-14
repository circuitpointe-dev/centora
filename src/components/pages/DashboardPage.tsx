import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, DollarSign, UserPlus, Plus, FileText, BarChart } from 'lucide-react';
import { CalendarCard } from '@/components/fundraising/CalendarCard';
import { DeadlinesCard } from '@/components/fundraising/DeadlinesCard';
import NewDonorDialog from '@/components/fundraising/NewDonorDialog';
import AddOpportunityDialog from '@/components/opportunity-tracking/AddOpportunityDialog';
import CreateProposalDialog from '@/components/proposal-management/CreateProposalDialog';

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
