
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, DollarSign, UserPlus, Plus, FileText, BarChart as BarChartIcon } from 'lucide-react';
import { CalendarCard } from '@/components/fundraising/CalendarCard';
import { DeadlinesCard } from '@/components/fundraising/DeadlinesCard';
import NewDonorDialog from '@/components/fundraising/NewDonorDialog';
import AddOpportunityDialog from '@/components/opportunity-tracking/AddOpportunityDialog';
import CreateProposalDialog from '@/components/proposal-management/CreateProposalDialog';
import { useDonors } from '@/hooks/useDonors';
import { useFundraisingStats } from '@/hooks/useFundraisingStats';
import { useDeadlines } from '@/hooks/useDeadlines';

const FundraisingDashboard = () => {
  const navigate = useNavigate();
  const [showAddOpportunityDialog, setShowAddOpportunityDialog] = useState(false);
  const [showCreateProposalDialog, setShowCreateProposalDialog] = useState(false);
  
  // Fetch real data
  const { data: donors = [] } = useDonors();
  const { data: stats } = useFundraisingStats();
  const { data: deadlines = [] } = useDeadlines();
  
  // Transform donors for opportunity dialog
  const donorsForDialog = donors.map(donor => ({ id: donor.id, name: donor.name }));

  const handleAddOpportunity = (opportunity: any) => {
    console.log('New opportunity:', opportunity);
    setShowAddOpportunityDialog(false);
  };

  const handleGenerateReports = () => {
    navigate('/dashboard/fundraising/fundraising-analytics?tab=generate-report');
  };
  
  const hasStatsData = stats && (stats.totalProposals > 0 || stats.activeOpportunities > 0 || stats.fundsRaised > 0);

  return (
    <div>
      {/* Header with Title and Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-2">
        <h1 className="text-xl font-medium text-gray-900">
          Fundraising
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
            <BarChartIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Generate Reports</span>
            <span className="sm:hidden">Reports</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards - Fundraising specific */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
        <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: '#efe8fd' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProposals || "—"}</div>
            <p className="text-xs text-muted-foreground">
              {hasStatsData ? `${stats?.proposalsInProgress || 0} in progress` : "No proposals yet"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: '#dce3ef' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hasStatsData ? `${Math.round(stats?.conversionRate || 0)}%` : "—"}</div>
            <p className="text-xs text-muted-foreground">
              {hasStatsData ? "Success rate" : "No data yet"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: '#fce3f0' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Opportunities</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeOpportunities || "0"}</div>
            <p className="text-xs text-muted-foreground">
              {hasStatsData ? "Currently active" : "No active opportunities"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: '#fef3cd' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funds Raised this Quarter</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hasStatsData ? `$${(stats?.fundsRaised || 0).toLocaleString()}` : "$0"}
            </div>
            <p className="text-xs text-muted-foreground">
              {hasStatsData ? `Avg: $${(stats?.avgGrantSize || 0).toLocaleString()}` : "No funds recorded yet"}
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
          <DeadlinesCard items={deadlines} />
        </div>
      </div>

      {/* Dialogs */}
      <AddOpportunityDialog
        isOpen={showAddOpportunityDialog}
        onClose={() => setShowAddOpportunityDialog(false)}
        donors={donorsForDialog}
      />

      <CreateProposalDialog
        open={showCreateProposalDialog}
        onOpenChange={setShowCreateProposalDialog}
      />
    </div>
  );
};

export default FundraisingDashboard;
