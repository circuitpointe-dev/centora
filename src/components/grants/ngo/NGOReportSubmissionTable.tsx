import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Upload } from 'lucide-react';

interface NGOReportSubmissionTableProps {
  grantId: number;
}

interface ReportSubmission {
  id: number;
  reportType: string;
  dueDate: string;
  submissionDate?: string;
  status: 'Submitted' | 'Pending' | 'Overdue';
  feedbackStatus?: string;
}

export const NGOReportSubmissionTable = ({ grantId }: NGOReportSubmissionTableProps) => {
  // Mock data - in real app, this would be fetched based on grantId
  const reportSubmissions: ReportSubmission[] = [
    {
      id: 1,
      reportType: "Quarterly Progress Report - Q1",
      dueDate: "2025-03-31",
      submissionDate: "2025-03-28",
      status: "Submitted",
      feedbackStatus: "Approved"
    },
    {
      id: 2,
      reportType: "Financial Report - Q1",
      dueDate: "2025-04-15",
      submissionDate: "2025-04-10",
      status: "Submitted",
      feedbackStatus: "Under Review"
    },
    {
      id: 3,
      reportType: "Quarterly Progress Report - Q2",
      dueDate: "2025-06-30",
      status: "Pending"
    },
    {
      id: 4,
      reportType: "Annual Impact Report",
      dueDate: "2025-01-31",
      status: "Overdue"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFeedbackColor = (feedback: string) => {
    switch (feedback.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'under review':
        return 'bg-blue-100 text-blue-800';
      case 'revision required':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Report Submissions</h3>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Type</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportSubmissions.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.reportType}</TableCell>
                <TableCell>{new Date(report.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  {report.submissionDate 
                    ? new Date(report.submissionDate).toLocaleDateString() 
                    : '-'
                  }
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {report.feedbackStatus ? (
                    <Badge className={getFeedbackColor(report.feedbackStatus)}>
                      {report.feedbackStatus}
                    </Badge>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {report.status === 'Submitted' ? (
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        <Upload className="h-3 w-3 mr-1" />
                        Submit
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};