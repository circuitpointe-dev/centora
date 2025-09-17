import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Clock, FileText, Download, AlertCircle } from "lucide-react";
import { GrantReport } from '@/types/grants';

interface ReportDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: GrantReport | null;
}

export const ReportDetailsDialog = ({ open, onOpenChange, report }: ReportDetailsDialogProps) => {
  if (!report) return null;

  // Extended submission stages for real backend data
  const submissionStages = [
    {
      icon: FileText,
      label: "Report Created",
      date: new Date(report.created_at).toLocaleDateString(),
      completed: true,
    },
    {
      icon: Clock,
      label: "In Progress",
      date: report.status === 'in_progress' ? 'Current' : '',
      completed: report.status === 'submitted' || report.submitted,
    },
    {
      icon: CheckCircle,
      label: "Submitted",
      date: report.submitted_date ? new Date(report.submitted_date).toLocaleDateString() : '',
      completed: report.submitted,
    },
  ];

  const uploadedDocuments = [
    {
      name: report.file_name || `${report.report_type}_Report.pdf`,
      uploadDate: report.submitted_date ? new Date(report.submitted_date).toLocaleDateString() : 'Not uploaded',
      notes: report.submitted ? "Report submitted" : "Awaiting submission",
    },
  ].filter(doc => report.file_name);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "submitted": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-black text-lg font-semibold">
            Report Details - {report.report_type}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-black">
          {/* Submission Tracker */}
          <div>
            <h3 className="font-semibold mb-4">Submission Tracker</h3>
            <div className="flex items-center justify-between relative">
              {/* Progress line */}
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 z-0">
                <div 
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ 
                    width: `${(submissionStages.filter(stage => stage.completed).length - 1) / (submissionStages.length - 1) * 100}%` 
                  }}
                />
              </div>
              
              {submissionStages.map((stage, index) => {
                const Icon = stage.icon;
                return (
                  <div key={index} className="flex flex-col items-center space-y-2 relative z-10">
                    <div className={`p-3 rounded-full border-2 bg-white ${stage.completed ? 'border-green-500 text-green-600' : 'border-gray-300 text-gray-400'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-medium ${stage.completed ? 'text-black' : 'text-gray-500'}`}>
                        {stage.label}
                      </p>
                      {stage.date && (
                        <p className="text-xs text-gray-500">{stage.date}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submission Details */}
          <div>
            <h3 className="font-semibold mb-2">Submission Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Report Type:</span>
                  <p className="text-gray-700 capitalize">{report.report_type}</p>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <Badge className={`ml-2 ${getStatusColor(report.status)}`}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Due Date:</span>
                  <p className="text-gray-700">{new Date(report.due_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="font-medium">Submission Date:</span>
                  <p className="text-gray-700">
                    {report.submitted_date 
                      ? new Date(report.submitted_date).toLocaleDateString()
                      : 'Not submitted'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Documents */}
          <div>
            <h3 className="font-semibold mb-2">Uploaded Documents</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File name</TableHead>
                  <TableHead>Uploaded on</TableHead>
                  <TableHead>Notes by grantee</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadedDocuments.map((doc, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>{doc.uploadDate}</TableCell>
                    <TableCell>{doc.notes}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="text-black border-gray-300 hover:bg-gray-100">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Feedback */}
          <div>
            <h3 className="font-semibold mb-2">Feedback</h3>
            <div className="space-y-3">
              {report.status === 'submitted' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-green-800">Report Submitted</span>
                    <span className="text-xs text-green-600">
                      {report.submitted_date ? new Date(report.submitted_date).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                  <p className="text-sm text-green-700">
                    Report has been successfully submitted and is awaiting review.
                  </p>
                </div>
              )}
              
              {report.status === 'overdue' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-red-800">Report Overdue</span>
                    <span className="text-xs text-red-600">
                      Due: {new Date(report.due_date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-red-700">
                    This report is past its due date. Please submit as soon as possible.
                  </p>
                </div>
              )}

              {report.status === 'upcoming' && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-blue-800">Upcoming Report</span>
                    <span className="text-xs text-blue-600">
                      Due: {new Date(report.due_date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-blue-700">
                    This report is coming due soon. Please prepare for submission.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={() => onOpenChange(false)}
            className="bg-black text-white hover:bg-gray-800"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};