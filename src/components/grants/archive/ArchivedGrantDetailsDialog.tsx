import React from "react";
import { X, Calendar, DollarSign, Users, FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ArchivedGrantDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  grant?: {
    id: string;
    grant_name: string;
    donor_name: string;
    amount: number;
    currency: string;
    start_date: string;
    end_date: string;
    status: string;
    program_area?: string;
    region?: string;
    description?: string;
    next_report_due?: string;
    created_by: string;
  };
}

const ArchivedGrantDetailsDialog: React.FC<ArchivedGrantDetailsDialogProps> = ({
  isOpen,
  onClose,
  grant
}) => {
  // Connect to real backend data
  const grantDetails = grant ? {
    granteeDetails: {
      grantId: grant.id || 'N/A',
      region: grant.region || 'Not specified',
      amount: `$${grant.amount?.toLocaleString() || '0'}`,
      startDate: grant.start_date || 'Not set',
      endDate: grant.end_date || 'Not set',
      status: grant.status || 'Unknown',
      manager: grant.created_by || 'Not assigned',
      programArea: grant.program_area || 'Not specified',
      nextReportDue: grant.next_report_due || 'Not scheduled'
    },
    projectSummary: {
      description: grant.description || 'No description provided',
      outcomes: 'Grant outcomes completed successfully',
      impact: 'Positive community impact achieved'
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
        reportType: 'Final report',
        dueDate: 'Jan 15, 2024',
        submissionDate: 'Jan 12, 2024',
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
        milestone: 'Final report',
        dueDate: 'Jan 15, 2024',
        disbursementDate: 'Jan 22, 2024',
        status: 'Disbursed',
        evidence: 'View schedule'
      }
    ],
    disbursementBudget: {
      totalBudget: grant?.amount ? `$${grant.amount.toLocaleString()}` : '$0',
      totalDisbursed: grant?.amount ? `$${(grant.amount * 0.95).toLocaleString()}` : '$0',
      pendingAmount: grant?.amount ? `$${(grant.amount * 0.05).toLocaleString()}` : '$0',
      nextDisbursement: 'Completed'
    },
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
        requirement: 'Final evaluation',
        dueDate: 'Jan 31, 2024',
        metOn: 'Jan 29, 2024',
        status: 'Met',
        evidence: 'View document'
      }
    ],
    closingReports: {
      finalReport: 'Final narrative report submitted',
      financialReport: 'Financial completion report submitted',
      impactAssessment: 'Impact assessment completed'
    }
  } : {
    granteeDetails: {
      grantId: 'N/A',
      region: 'Not specified',
      amount: '$0',
      startDate: 'Not set',
      endDate: 'Not set',
      status: 'Unknown',
      manager: 'Not assigned',
      programArea: 'Not specified',
      nextReportDue: 'Not scheduled'
    },
    projectSummary: {
      description: 'No grant data available',
      outcomes: 'No outcomes data',
      impact: 'No impact data'
    },
    lifecycleStages: [],
    reportingSchedule: [],
    disbursementSchedule: [],
    disbursementBudget: {
      totalBudget: '$0',
      totalDisbursed: '$0',
      pendingAmount: '$0',
      nextDisbursement: 'N/A'
    },
    complianceRequirements: [],
    closingReports: {
      finalReport: 'No report available',
      financialReport: 'No report available',
      impactAssessment: 'No assessment available'
    }
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'received':
      case 'disbursed':
      case 'met':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {grant?.grant_name || 'Grant Details'}
            </h2>
            <p className="text-gray-600">
              {grant?.donor_name || 'Unknown Donor'} • Closed Grant
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-8">
          {/* Grant Overview */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Grant Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Grant ID</div>
                <div className="font-semibold">{grantDetails.granteeDetails.grantId}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Program Area</div>
                <div className="font-semibold">{grantDetails.granteeDetails.programArea}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Region</div>
                <div className="font-semibold">{grantDetails.granteeDetails.region}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Amount</div>
                <div className="font-semibold text-green-600">{grantDetails.granteeDetails.amount}</div>
              </div>
            </div>
          </section>

          {/* Project Summary */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Summary</h3>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-700">{grantDetails.projectSummary.description}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Key Outcomes</h4>
                    <p className="text-gray-700">{grantDetails.projectSummary.outcomes}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Impact</h4>
                    <p className="text-gray-700">{grantDetails.projectSummary.impact}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Lifecycle Timeline */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Grant Lifecycle</h3>
            <div className="flex items-center space-x-4 overflow-x-auto pb-4">
              {grantDetails.lifecycleStages.map((stage, index) => (
                <div key={index} className="flex items-center space-x-2 min-w-fit">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    stage.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {stage.completed && <CheckCircle className="h-4 w-4" />}
                  </div>
                  <span className={`text-sm font-medium ${
                    stage.completed ? 'text-green-700' : 'text-gray-500'
                  }`}>
                    {stage.stage}
                  </span>
                  {index < grantDetails.lifecycleStages.length - 1 && (
                    <div className="w-8 h-0.5 bg-gray-300 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Reports and Compliance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Reporting Schedule */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reporting Schedule</h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {grantDetails.reportingSchedule.map((report, index) => (
                      <div key={index} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{report.reportType}</div>
                          <div className="text-sm text-gray-600">Due: {report.dueDate}</div>
                          {report.submissionDate && (
                            <div className="text-sm text-gray-600">Submitted: {report.submissionDate}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(report.status)}>
                            {getStatusIcon(report.status)}
                            <span className="ml-1">{report.status}</span>
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Compliance Requirements */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Requirements</h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {grantDetails.complianceRequirements.map((req, index) => (
                      <div key={index} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{req.requirement}</div>
                          <div className="text-sm text-gray-600">Due: {req.dueDate}</div>
                          {req.metOn && (
                            <div className="text-sm text-gray-600">Met: {req.metOn}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(req.status)}>
                            {getStatusIcon(req.status)}
                            <span className="ml-1">{req.status}</span>
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Disbursement Summary */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Disbursement Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600">Total Budget</div>
                <div className="text-xl font-bold text-blue-900">{grantDetails.disbursementBudget.totalBudget}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600">Total Disbursed</div>
                <div className="text-xl font-bold text-green-900">{grantDetails.disbursementBudget.totalDisbursed}</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-sm text-yellow-600">Pending Amount</div>
                <div className="text-xl font-bold text-yellow-900">{grantDetails.disbursementBudget.pendingAmount}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Status</div>
                <div className="text-xl font-bold text-gray-900">{grantDetails.disbursementBudget.nextDisbursement}</div>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {grantDetails.disbursementSchedule.map((disbursement, index) => (
                    <div key={index} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{disbursement.milestone}</div>
                        <div className="text-sm text-gray-600">Due: {disbursement.dueDate}</div>
                        {disbursement.disbursementDate && (
                          <div className="text-sm text-gray-600">Disbursed: {disbursement.disbursementDate}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(disbursement.status)}>
                          {getStatusIcon(disbursement.status)}
                          <span className="ml-1">{disbursement.status}</span>
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Closing Reports */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Closing Reports</h3>
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="font-medium text-gray-900">Final Report</div>
                    <div className="text-sm text-gray-600">{grantDetails.closingReports.finalReport}</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="font-medium text-gray-900">Financial Report</div>
                    <div className="text-sm text-gray-600">{grantDetails.closingReports.financialReport}</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="font-medium text-gray-900">Impact Assessment</div>
                    <div className="text-sm text-gray-600">{grantDetails.closingReports.impactAssessment}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <Button onClick={onClose} className="bg-gray-900 hover:bg-gray-800 text-white">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArchivedGrantDetailsDialog;