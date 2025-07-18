import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Building, FileText } from 'lucide-react';
import { reportsData } from './data/reportsData';
import { grantsData } from './data/grantsData';

const UpcomingReportingDeadlines = () => {
  // Get current date for comparison
  const currentDate = new Date();
  
  // Function to calculate days until due
  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const diffTime = due.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Function to get color and urgency based on days until due
  const getUrgencyInfo = (days: number) => {
    if (days <= 3) {
      return {
        color: 'red',
        dotColor: 'bg-red-500',
        textColor: 'text-red-600',
        urgencyText: `Due in ${days} days`,
        priority: 1
      };
    } else if (days <= 7) {
      return {
        color: 'orange',
        dotColor: 'bg-orange-500',
        textColor: 'text-orange-600',
        urgencyText: `Due in ${days} days`,
        priority: 2
      };
    } else if (days <= 15) {
      return {
        color: 'green',
        dotColor: 'bg-green-500',
        textColor: 'text-green-600',
        urgencyText: `Due in ${days} days`,
        priority: 3
      };
    }
    return null;
  };

  // Filter and process reports for upcoming deadlines (within 15 days)
  const upcomingReports = reportsData
    .filter(report => !report.submitted && report.status !== 'Overdue')
    .map(report => {
      const days = getDaysUntilDue(report.dueDate);
      const urgencyInfo = getUrgencyInfo(days);
      if (!urgencyInfo) return null;

      const grant = grantsData.find(g => g.id === report.grantId);
      
      return {
        ...report,
        grant,
        days,
        urgencyInfo
      };
    })
    .filter(Boolean)
    .sort((a, b) => a!.urgencyInfo.priority - b!.urgencyInfo.priority)
    .slice(0, 3); // Show only top 3 most urgent

  const reportCount = upcomingReports.length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Upcoming Reporting Deadlines</h2>
        <Badge variant="outline" className="text-xs">
          COUNT: {reportCount}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {upcomingReports.map((report) => (
          <Card key={report!.id} className="border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full ${report!.urgencyInfo.dotColor} mt-1.5 flex-shrink-0`} />
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-sm font-medium text-gray-900 truncate">
                    {report!.grant?.grantName || 'Unknown Grant'}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Building className="w-3 h-3" />
                <span className="truncate">{report!.grant?.organization || 'Unknown Organization'}</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <FileText className="w-3 h-3" />
                <span className="truncate">{report!.reportType}</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar className="w-3 h-3" />
                <span>Report due: {new Date(report!.dueDate).toLocaleDateString()}</span>
              </div>
              
              <div className={`text-xs font-medium ${report!.urgencyInfo.textColor}`}>
                {report!.urgencyInfo.urgencyText}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Fill empty slots if less than 3 reports */}
        {Array.from({ length: Math.max(0, 3 - reportCount) }, (_, index) => (
          <Card key={`empty-${index}`} className="border border-gray-100 rounded-sm shadow-sm opacity-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">
                No upcoming reports
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="text-xs text-gray-400">
                All reports are up to date
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UpcomingReportingDeadlines;