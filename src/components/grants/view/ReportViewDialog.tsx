import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText } from "lucide-react";
import { GrantReport } from "@/types/grants";
import { useDownloadGrantReportFile } from "@/hooks/grants/useGrantReportFiles";

interface ReportViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: GrantReport | null;
}

export const ReportViewDialog: React.FC<ReportViewDialogProps> = ({
  open,
  onOpenChange,
  report,
}) => {
  const downloadFile = useDownloadGrantReportFile();

  const handleDownload = () => {
    if (report?.file_path && report?.file_name) {
      downloadFile.mutate({ 
        filePath: report.file_path, 
        fileName: report.file_name 
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-gray-200 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-xl">
            Report Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Report Information */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-500">Report Type:</span>
                  <p className="text-gray-900 font-medium">{report.report_type}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Due Date:</span>
                  <p className="text-gray-900">{new Date(report.due_date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <div className="mt-1">
                    <Badge className={getStatusColor(report.status)}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                {report.submitted_date && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Submission Date:</span>
                    <p className="text-gray-900">{new Date(report.submitted_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Uploaded Documents */}
          {report.file_name && report.file_path && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900">Uploaded Documents</h3>
              
              <div className="border border-gray-200 rounded-lg">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">{report.file_name}</p>
                        <p className="text-sm text-gray-500">
                          Uploaded on {report.submitted_date ? new Date(report.submitted_date).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        disabled={downloadFile.isPending}
                        className="border-gray-300"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {downloadFile.isPending ? 'Downloading...' : 'Download'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Section */}
          {report.submitted && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900">Feedback</h3>
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">Report Submitted</span>
                  <span className="text-sm text-green-600">
                    {report.submitted_date ? new Date(report.submitted_date).toLocaleDateString() : ''}
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  Report has been successfully submitted and is awaiting review.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 text-gray-700"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};