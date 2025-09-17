import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Plus, 
  Download,
  Eye,
  Calendar,
  FileText,
  TrendingUp,
  DollarSign,
  Filter
} from 'lucide-react';
import { useFinanceReports, useGenerateReport } from '@/hooks/finance/useFinanceReports';
import { Skeleton } from '@/components/ui/skeleton';
import { GenerateReportDialog } from './GenerateReportDialog';

const FinanceReportingPage = () => {
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  
  const { data: reports, isLoading } = useFinanceReports();
  const generateReport = useGenerateReport();

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      generated: 'bg-green-100 text-green-800',
      approved: 'bg-blue-100 text-blue-800',
      archived: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'income_statement':
        return <TrendingUp className="h-4 w-4" />;
      case 'balance_sheet':
        return <BarChart3 className="h-4 w-4" />;
      case 'cash_flow':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatReportType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleQuickReport = (reportType: string) => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    generateReport.mutate({
      reportType: reportType as any,
      startDate: firstDayOfMonth.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-medium text-gray-900">
            Financial Reporting
          </h1>
          <p className="text-muted-foreground">
            Generate and manage financial reports and analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter Reports
          </Button>
          <Button size="sm" onClick={() => setShowGenerateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Quick Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Report Generation</CardTitle>
          <CardDescription>
            Generate common financial reports for the current month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => handleQuickReport('income_statement')}
              disabled={generateReport.isPending}
            >
              <TrendingUp className="h-6 w-6 text-green-600" />
              <div className="text-center">
                <div className="font-medium">Income Statement</div>
                <div className="text-xs text-muted-foreground">Revenue & Expenses</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => handleQuickReport('balance_sheet')}
              disabled={generateReport.isPending}
            >
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <div className="text-center">
                <div className="font-medium">Balance Sheet</div>
                <div className="text-xs text-muted-foreground">Assets & Liabilities</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => handleQuickReport('cash_flow')}
              disabled={generateReport.isPending}
            >
              <DollarSign className="h-6 w-6 text-purple-600" />
              <div className="text-center">
                <div className="font-medium">Cash Flow</div>
                <div className="text-xs text-muted-foreground">Cash Movement</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => handleQuickReport('budget_variance')}
              disabled={generateReport.isPending}
            >
              <FileText className="h-6 w-6 text-orange-600" />
              <div className="text-center">
                <div className="font-medium">Budget Variance</div>
                <div className="text-xs text-muted-foreground">Budget vs Actual</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Generated Reports
          </CardTitle>
          <CardDescription>
            View and download previously generated financial reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-8 w-8" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : reports && reports.length > 0 ? (
            <div className="space-y-1">
              <div className="grid grid-cols-12 gap-4 py-3 px-2 text-sm font-medium text-gray-500 border-b">
                <div className="col-span-4">Report Name</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-3">Period</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Actions</div>
              </div>
              
              {reports.map((report) => (
                <div key={report.id} className="grid grid-cols-12 gap-4 py-4 px-2 hover:bg-gray-50 rounded-lg">
                  <div className="col-span-4">
                    <div className="flex items-center space-x-3">
                      {getReportTypeIcon(report.report_type)}
                      <div>
                        <div className="font-medium">{report.report_name}</div>
                        <p className="text-xs text-gray-500">
                          Generated {new Date(report.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm">{formatReportType(report.report_type)}</span>
                  </div>
                  <div className="col-span-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      {report.report_period_start} to {report.report_period_end}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </div>
                  <div className="col-span-1">
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" title="View Report">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Download Report">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports generated yet</h3>
              <p className="text-gray-500 mb-6">
                Generate your first financial report to get started with reporting and analytics.
              </p>
              <Button onClick={() => setShowGenerateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Generate Your First Report
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Report Dialog */}
      <GenerateReportDialog 
        open={showGenerateDialog} 
        onOpenChange={setShowGenerateDialog} 
      />
    </div>
  );
};

export default FinanceReportingPage;