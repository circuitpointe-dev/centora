import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  FolderOpen, 
  Plus, 
  FileText, 
  BarChart3,
  Download,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { useFinanceStats, useRecentFinanceActivity } from '@/hooks/finance/useFinanceStats';
import { useFinancialProjects } from '@/hooks/finance/useFinancialProjects';
import { useGenerateReport } from '@/hooks/finance/useFinanceReports';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateRecordDialog } from './CreateRecordDialog';
import { GenerateReportDialog } from './GenerateReportDialog';

const FinanceDashboard = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  
  const { data: stats, isLoading: statsLoading } = useFinanceStats();
  const { data: recentActivity, isLoading: activityLoading } = useRecentFinanceActivity();
  const { data: projects } = useFinancialProjects();
  const generateReport = useGenerateReport();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleQuickReport = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    generateReport.mutate({
      reportType: 'income_statement',
      startDate: firstDayOfMonth.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
    });
  };

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[120px] mb-2" />
                <Skeleton className="h-3 w-[80px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-medium text-gray-900">
            Finance & Control Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview and key metrics for finance & control
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.revenueChange || 0}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeProjects || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.projectsChange || 0} new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.teamMembers || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.teamChange || 0} since last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats?.growthRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              +2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activityLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                </div>
              ))
            ) : (
              recentActivity?.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                      {activity.amount && (
                        <span className="ml-2 font-medium">
                          {formatCurrency(activity.amount)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for this module</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => setShowCreateDialog(true)} 
              className="w-full justify-start"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Record
              <span className="ml-auto text-xs text-muted-foreground">
                Add a new entry to the system
              </span>
            </Button>

            <Button 
              onClick={handleQuickReport} 
              className="w-full justify-start"
              variant="outline"
              disabled={generateReport.isPending}
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
              <span className="ml-auto text-xs text-muted-foreground">
                Create a detailed report
              </span>
            </Button>

            <Button 
              onClick={() => setShowReportDialog(true)} 
              className="w-full justify-start"
              variant="outline"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
              <span className="ml-auto text-xs text-muted-foreground">
                Check performance metrics
              </span>
            </Button>

            <Button 
              onClick={() => {
                const data = {
                  stats,
                  recentActivity,
                  projects: projects?.slice(0, 10),
                  exportDate: new Date().toISOString()
                };
                
                const blob = new Blob([JSON.stringify(data, null, 2)], { 
                  type: 'application/json' 
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `finance-data-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }} 
              className="w-full justify-start"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
              <span className="ml-auto text-xs text-muted-foreground">
                Download current data
              </span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <CreateRecordDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
      
      <GenerateReportDialog 
        open={showReportDialog} 
        onOpenChange={setShowReportDialog} 
      />
    </div>
  );
};

export default FinanceDashboard;