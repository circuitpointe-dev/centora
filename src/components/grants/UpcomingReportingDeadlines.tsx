import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarClock, FileText, AlertTriangle, Eye, Check } from 'lucide-react';
import { useGrantReports } from '@/hooks/grants/useGrantReports';
import { useGrants } from '@/hooks/grants/useGrants';
import { Skeleton } from '@/components/ui/skeleton';
import { ReportViewDialog } from './view/ReportViewDialog';
import { toast } from 'sonner';

// Helper function to calculate days until due date
const getDaysUntilDue = (dueDate: string): number => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Helper function to get urgency color and info based on days
const getUrgencyInfo = (days: number) => {
  if (days < 0) {
    return {
      color: '#DC2626', // red-600
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      text: 'Overdue',
      priority: 0
    };
  } else if (days <= 3) {
    return {
      color: '#EF4444', // red-500
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      text: 'Critical',
      priority: 1
    };
  } else if (days <= 7) {
    return {
      color: '#F97316', // orange-500
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
      text: 'Urgent',
      priority: 2
    };
  } else {
    return {
      color: '#10B981', // green-500
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      text: 'Normal',
      priority: 3
    };
  }
};

const UpcomingReportingDeadlines = () => {
  const { reports, loading: reportsLoading, updateReport } = useGrantReports();
  const { grants, loading: grantsLoading } = useGrants();
  const [selectedReport, setSelectedReport] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  const loading = reportsLoading || grantsLoading;

  const handleViewReport = (report) => {
    console.log('View button clicked, report:', report);
    console.log('Report grant info:', report.grant);
    setSelectedReport(report);
    setShowViewDialog(true);
  };

  const handleMarkAsDone = async (report) => {
    try {
      await updateReport(report.id, {
        status: 'submitted',
        submitted: true,
        submitted_date: new Date().toISOString().split('T')[0]
      });
      toast.success('Report marked as submitted');
    } catch (error) {
      toast.error('Failed to update report status');
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-blue-600" />
            Upcoming & Overdue Reporting Deadlines
            <Skeleton className="h-5 w-8 rounded-full" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-4 w-20" />
            </Card>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Filter for upcoming and overdue reports that are not submitted
  const upcomingReports = reports
    .filter(report => !report.submitted && (report.status === 'upcoming' || report.status === 'overdue' || report.status === 'in_progress'))
    .map(report => {
      const days = getDaysUntilDue(report.due_date);
      const urgency = getUrgencyInfo(days);
      const grant = grants.find(g => g.id === report.grant_id);
      
      console.log('Processing report:', report.id, 'days:', days, 'grant:', grant);
      
      return {
        ...report,
        days,
        urgency,
        grant
      };
    })
    .sort((a, b) => a.urgency.priority - b.urgency.priority);
  
  console.log('Total reports:', reports.length, 'Upcoming/Overdue reports:', upcomingReports.length);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-blue-600" />
          Upcoming & Overdue Reporting Deadlines
          {upcomingReports.length > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {upcomingReports.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingReports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No upcoming reporting deadlines</p>
          </div>
        ) : (
          upcomingReports.map((report) => (
            <Card key={report.id} className="border-l-4 hover:shadow-md transition-shadow" 
                  style={{ borderLeftColor: report.urgency.color }}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-foreground">
                      {report.grant?.grant_name || 'Unknown Grant'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {report.grant?.donor_name || 'Unknown Donor'}
                    </p>
                  </div>
                  <Badge className={`${report.urgency.bgColor} ${report.urgency.textColor} border-0`}>
                    {report.urgency.text}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>{report.report_type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarClock className="h-4 w-4" />
                    <span className={report.days < 0 ? 'text-red-600 font-medium' : ''}>
                      {report.days < 0 
                        ? `Overdue by ${Math.abs(report.days)} day${Math.abs(report.days) !== 1 ? 's' : ''}` 
                        : `Due in ${report.days} day${report.days !== 1 ? 's' : ''}`}
                      {' '}({new Date(report.due_date).toLocaleDateString()})
                    </span>
                  </div>
                  {(report.days <= 3 && report.days >= 0) && (
                    <div className="flex items-center gap-1 text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">Urgent</span>
                    </div>
                  )}
                  {report.days < 0 && (
                    <div className="flex items-center gap-1 text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">Overdue</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewReport(report)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkAsDone(report)}
                    className="flex items-center gap-1 text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <Check className="h-4 w-4" />
                    Done
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
      
      {showViewDialog && selectedReport && (
        <ReportViewDialog
          report={selectedReport}
          open={showViewDialog}
          onOpenChange={setShowViewDialog}
        />
      )}
    </Card>
  );
};

export default UpcomingReportingDeadlines;