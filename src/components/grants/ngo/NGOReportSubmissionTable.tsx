import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Upload } from 'lucide-react';
import { useGrantReports } from '@/hooks/grants/useGrantReports';

interface NGOReportSubmissionTableProps {
  grantId: string;
}

export const NGOReportSubmissionTable = ({ grantId }: NGOReportSubmissionTableProps) => {
  const { reports, loading } = useGrantReports(grantId);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Report Submissions</h3>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }

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
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.report_type}</TableCell>
                <TableCell>{new Date(report.due_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {report.submitted_date 
                    ? new Date(report.submitted_date).toLocaleDateString() 
                    : '-'
                  }
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(report.status)}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {report.file_name ? (
                    <Badge className="bg-blue-100 text-blue-800">
                      Submitted
                    </Badge>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {report.submitted ? (
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