import React from "react";
import { CheckCircle, Circle, Clock, MessageSquare, Download, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GrantCompliance } from "@/types/grants";
import { useDownloadComplianceFile } from "@/hooks/grants/useGrantComplianceFiles";

interface ComplianceViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requirement: GrantCompliance | null;
}

export const ComplianceViewDialog = ({ open, onOpenChange, requirement }: ComplianceViewDialogProps) => {
  const downloadFile = useDownloadComplianceFile();
  
  if (!requirement) return null;

  const handleDownload = () => {
    if (requirement.evidence_document) {
      const fileName = requirement.evidence_document.split('/').pop() || 'evidence_document';
      downloadFile.mutate({
        filePath: requirement.evidence_document,
        fileName: fileName
      });
    }
  };

  const submissionStages = [
    {
      icon: Circle,
      label: "Draft created",
      date: "Jun 1, 2025",
      completed: true
    },
    {
      icon: CheckCircle,
      label: "Submitted",
      date: "Jun 4, 2025",
      completed: true
    },
    {
      icon: Clock,
      label: "Reviewer assigned",
      date: "Jun 1, 2025",
      completed: true
    },
    {
      icon: MessageSquare,
      label: "Feedback provided",
      date: "Jun 1, 2025",
      completed: requirement.status === 'completed'
    }
  ];

  // Check if evidence document exists
  const hasEvidenceDocument = requirement.evidence_document;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-gray-200 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            Compliance Requirement Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Submission Tracker */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Submission Tracker</h3>
            <div className="flex justify-between items-center">
              {submissionStages.map((stage, index) => {
                const IconComponent = stage.icon;
                return (
                  <div key={index} className="flex flex-col items-center text-center">
                    <IconComponent 
                      className={`h-8 w-8 mb-2 ${
                        stage.completed 
                          ? 'text-green-600' 
                          : 'text-gray-300'
                      }`}
                    />
                    <p className="text-xs font-medium text-gray-700 mb-1">
                      {stage.label}
                    </p>
                    <p className="text-xs text-gray-500">
                      {stage.date}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submission Details */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Submission Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Requirement</span>
                <span className="text-gray-900 font-medium">{requirement.requirement}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Due date</span>
                <span className="text-gray-900 font-medium">
                  {new Date(requirement.due_date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <Badge className={getStatusColor(requirement.status)}>
                  {requirement.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Uploaded Documents */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Uploaded documents</h3>
            {hasEvidenceDocument ? (
              <div className="border border-gray-200 rounded-lg">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {requirement.evidence_document?.split('/').pop() || 'Evidence Document'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Uploaded on {requirement.updated_at ? new Date(requirement.updated_at).toLocaleDateString() : 'N/A'}
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
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No evidence document uploaded yet</p>
              </div>
            )}
          </div>

          {/* Feedback */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Feedback</h3>
            <div className="bg-gray-50 p-4 rounded-sm border">
              <h4 className="font-medium text-gray-900 mb-2">Reviewer comments</h4>
              <p className="text-sm text-gray-700">
                The executive summary should provide more detail on the outcomes achieved
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};