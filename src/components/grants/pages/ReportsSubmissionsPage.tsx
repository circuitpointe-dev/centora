import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload, Eye, FileText, Edit } from 'lucide-react';
import { useGrantReports } from '@/hooks/grants/useGrantReports';
import { ReportDialog } from '@/components/grants/view/ReportDialog';
import { GrantReport } from '@/types/grants';

export const ReportsSubmissionsPage = () => {
  const { reports, loading, createReport, updateReport } = useGrantReports();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<GrantReport | null>(null);

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

  const handleCreateReport = async () => {
    setEditingReport(null);
    setDialogOpen(true);
  };

  const handleEditReport = (report: GrantReport) => {
    setEditingReport(report);
    setDialogOpen(true);
  };

  const handleSaveReport = async (reportData: any) => {
    try {
      if (editingReport) {
        await updateReport(editingReport.id, reportData);
      } else {
        // For now, create with a default grant_id - in real app this would be passed from context
        await createReport({
          ...reportData,
          grant_id: 'default-grant-id' // This should be passed from the current grant context
        });
      }
      setDialogOpen(false);
      setEditingReport(null);
    } catch (error) {
      console.error('Error saving report:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Report Submissions</h1>
          <p className="text-muted-foreground">
            Track and manage grant reporting requirements and submissions
          </p>
        </div>
        <Button onClick={handleCreateReport}>
          <Plus className="h-4 w-4 mr-2" />
          New Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {reports.filter(r => r.submitted).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <FileText className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {reports.filter(r => r.status === 'overdue').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {reports.filter(r => r.status === 'upcoming').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Reports Found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first report submission
              </p>
              <Button onClick={handleCreateReport}>
                <Plus className="h-4 w-4 mr-2" />
                Create Report
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.report_type}</TableCell>
                      <TableCell>{new Date(report.due_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {report.submitted_date 
                          ? new Date(report.submitted_date).toLocaleDateString() 
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditReport(report)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
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
          )}
        </CardContent>
      </Card>

      {/* Add Report Dialog */}
      <ReportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        report={editingReport}
        onSave={handleSaveReport}
      />
    </div>
  );
};