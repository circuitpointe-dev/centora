import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, FileText, Download, Calendar, DollarSign, AlertTriangle } from 'lucide-react';

interface ArchivedGrantDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  grant: {
    id: number;
    name: string;
    organization: string;
    status: string;
    compliance: number;
    disbursementRate: number;
    reportingStatus: string;
    programArea: string;
  };
}

const ArchivedGrantDetailsDialog: React.FC<ArchivedGrantDetailsDialogProps> = ({
  isOpen,
  onClose,
  grant
}) => {
    // Sample data for the grant details - this would come from backend
    const grantDetails = {
    granteeDetails: {
      grantId: 'GR-2024-001',
      region: 'East Africa',
      amount: '$2,500,000',
      startDate: '2022-01-15',
      endDate: '2024-01-15',
      status: 'Closed',
      manager: 'John Smith'
    },
    lifecycleStages: [
      { stage: 'Application', completed: true },
      { stage: 'Review', completed: true },
      { stage: 'Approval', completed: true },
      { stage: 'Active', completed: true },
      { stage: 'Closed', completed: true }
    ],
    reportingSchedule: [
      {
        reportType: 'Annual financial report',
        dueDate: 'Apr 15, 2023',
        submissionDate: 'Apr 10, 2023',
        status: 'Received',
        evidence: 'View report'
      },
      {
        reportType: 'Mid-year evaluation',
        dueDate: 'Jun 30, 2023',
        submissionDate: 'Jun 28, 2023',
        status: 'Received',
        evidence: 'View report'
      },
      {
        reportType: 'Final evaluation',
        dueDate: 'Jan 30, 2024',
        submissionDate: 'Jan 25, 2024',
        status: 'Received',
        evidence: 'View report'
      }
    ],
    disbursementSchedule: [
      {
        milestone: 'Quarterly report',
        dueDate: 'Apr 15, 2023',
        disbursementDate: 'Apr 18, 2023',
        status: 'Disbursed',
        evidence: 'View schedule'
      },
      {
        milestone: 'Quarterly report',
        dueDate: 'Jul 15, 2023',
        disbursementDate: 'Jul 20, 2023',
        status: 'Disbursed',
        evidence: 'View schedule'
      },
      {
        milestone: 'Quarterly report',
        dueDate: 'Oct 15, 2023',
        disbursementDate: 'Oct 18, 2023',
        status: 'Disbursed',
        evidence: 'View schedule'
      },
      {
        milestone: 'Final report',
        dueDate: 'Jan 15, 2024',
        disbursementDate: 'Jan 22, 2024',
        status: 'Disbursed',
        evidence: 'View schedule'
      }
    ],
    complianceRequirements: [
      {
        requirement: 'Annual financial report',
        dueDate: 'Apr 15, 2023',
        metOn: 'Apr 10, 2023',
        status: 'Met',
        evidence: 'View document'
      },
      {
        requirement: 'Impact assessment',
        dueDate: 'Dec 31, 2023',
        metOn: 'Dec 28, 2023',
        status: 'Met',
        evidence: 'View document'
      },
      {
        requirement: 'Final audit',
        dueDate: 'Jan 31, 2024',
        metOn: 'Jan 29, 2024',
        status: 'Met',
        evidence: 'View document'
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'received':
      case 'disbursed':
      case 'met':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">Grant Record View</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Top Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{grant.disbursementRate}%</p>
                  <p className="text-sm text-gray-600">Disbursement Rate (%)</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-2 rounded-lg bg-green-50">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{grant.compliance}%</p>
                  <p className="text-sm text-gray-600">Compliance (%)</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-2 rounded-lg bg-purple-50">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">Closed</p>
                  <p className="text-sm text-gray-600">Grant Status</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lifecycle Tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lifecycle Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                {grantDetails.lifecycleStages.map((stage, index) => (
                  <div key={stage.stage} className="flex flex-col items-center space-y-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      stage.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {stage.completed && <CheckCircle className="h-4 w-4 text-white" />}
                    </div>
                    <span className="text-sm font-medium">{stage.stage}</span>
                  </div>
                ))}
              </div>
              <Progress value={100} className="h-2" />
            </CardContent>
          </Card>

          {/* Overview Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Grantee Details</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Grant ID</p>
                      <p className="font-medium">{grantDetails.granteeDetails.grantId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Region</p>
                      <p className="font-medium">{grantDetails.granteeDetails.region}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="font-medium">{grantDetails.granteeDetails.startDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">End Date</p>
                      <p className="font-medium">{grantDetails.granteeDetails.endDate}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Grant Details</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-medium">{grantDetails.granteeDetails.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                        {grantDetails.granteeDetails.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Grant Manager</p>
                      <p className="font-medium">{grantDetails.granteeDetails.manager}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Program Area</p>
                      <p className="font-medium">{grant.programArea}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reporting Schedule Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reporting Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Evidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grantDetails.reportingSchedule.map((report, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{report.reportType}</TableCell>
                      <TableCell>{report.dueDate}</TableCell>
                      <TableCell>{report.submissionDate}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="link" size="sm" className="p-0 h-auto">
                          <Download className="h-3 w-3 mr-1" />
                          {report.evidence}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Disbursement Schedule Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Disbursement Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Milestone</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Disbursement Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Evidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grantDetails.disbursementSchedule.map((disbursement, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{disbursement.milestone}</TableCell>
                      <TableCell>{disbursement.dueDate}</TableCell>
                      <TableCell>{disbursement.disbursementDate}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(disbursement.status)}>
                          {disbursement.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="link" size="sm" className="p-0 h-auto">
                          <Download className="h-3 w-3 mr-1" />
                          {disbursement.evidence}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Compliance Requirements Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Compliance Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requirement</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Met On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Evidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grantDetails.complianceRequirements.map((requirement, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{requirement.requirement}</TableCell>
                      <TableCell>{requirement.dueDate}</TableCell>
                      <TableCell>{requirement.metOn}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(requirement.status)}>
                          {requirement.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="link" size="sm" className="p-0 h-auto">
                          <Download className="h-3 w-3 mr-1" />
                          {requirement.evidence}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArchivedGrantDetailsDialog;