import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, FileText, Download, AlertCircle } from "lucide-react";
import type { ReportSubmissionData } from "./data/reportSubmissionData";

interface ReportDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: ReportSubmissionData | null;
}

export const ReportDetailsDialog = ({ open, onOpenChange, report }: ReportDetailsDialogProps) => {
  if (!report) return null;

  // Extended submission stages including Resubmitted and Final Approval
  const submissionStages = [
    {
      icon: FileText,
      label: "Initial Submission",
      date: "Nov 15, 2024",
      completed: true,
    },
    {
      icon: Clock,
      label: "Under Review",
      date: "Nov 16, 2024",
      completed: true,
    },
    {
      icon: AlertCircle,
      label: "Feedback Provided",
      date: "Nov 20, 2024",
      completed: report.status === "Approved" || report.status === "Awaiting reviewer feedback",
    },
    {
      icon: FileText,
      label: "Resubmitted",
      date: "Nov 25, 2024",
      completed: report.status === "Approved",
      conditional: report.status === "Approved" || report.action === "Resubmit",
    },
    {
      icon: CheckCircle,
      label: "Final Approval",
      date: report.status === "Approved" ? "Dec 1, 2024" : "",
      completed: report.status === "Approved",
    },
  ];

  const uploadedDocuments = [
    {
      name: `${report.reportType}_Report_v1.pdf`,
      uploadDate: "Nov 15, 2024",
      notes: "Initial submission",
    },
    {
      name: `${report.reportType}_Report_v2.pdf`,
      uploadDate: "Nov 25, 2024",
      notes: "Revised version addressing feedback",
      conditional: report.status === "Approved",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800";
      case "Pending Review": return "bg-yellow-100 text-yellow-800";
      case "Resubmitted": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-black text-lg font-semibold">
            Report Details - {report.reportType}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-black">
          {/* Submission Tracker */}
          <div>
            <h3 className="font-semibold mb-4">Submission Tracker</h3>
            <div className="space-y-4">
              {submissionStages
                .filter(stage => !stage.conditional || stage.conditional)
                .map((stage, index) => {
                const Icon = stage.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${stage.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Icon className={`h-4 w-4 ${stage.completed ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <div className="flex-1">
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
                  <p className="text-gray-700">{report.reportType}</p>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <Badge className={`ml-2 ${getStatusColor(report.status)}`}>
                    {report.status}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Due Date:</span>
                  <p className="text-gray-700">Nov 30, 2024</p>
                </div>
                <div>
                  <span className="font-medium">Submission Date:</span>
                  <p className="text-gray-700">Nov 15, 2024</p>
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Documents */}
          <div>
            <h3 className="font-semibold mb-2">Uploaded Documents</h3>
            <div className="space-y-2">
              {uploadedDocuments
                .filter(doc => !doc.conditional || doc.conditional)
                .map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-gray-500">Uploaded on {doc.uploadDate}</p>
                      {doc.notes && (
                        <p className="text-xs text-gray-600 mt-1">{doc.notes}</p>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="text-black border-gray-300 hover:bg-gray-100">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div>
            <h3 className="font-semibold mb-2">Feedback</h3>
            <div className="space-y-3">
              {report.status !== "Pending review" && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-blue-800">Reviewer Comment</span>
                    <span className="text-xs text-blue-600">Nov 20, 2024</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    {report.status === "Approved" 
                      ? "Report has been reviewed and approved. Well documented with clear metrics and outcomes."
                      : "Please provide additional details on budget allocation and include quarterly breakdown charts."
                    }
                  </p>
                </div>
              )}
              
              {report.status === "Approved" && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-green-800">Final Approval</span>
                    <span className="text-xs text-green-600">Dec 1, 2024</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Report has been thoroughly reviewed and meets all requirements. Thank you for the comprehensive submission.
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