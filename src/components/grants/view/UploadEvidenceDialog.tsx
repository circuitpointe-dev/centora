import React, { useState } from "react";
import { Upload, File, X, CheckCircle, Circle, Clock, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUploadComplianceFile } from "@/hooks/grants/useGrantComplianceFiles";
import { GrantCompliance } from "@/types/grants";

interface UploadEvidenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requirement: GrantCompliance;
  onUpload: () => void;
}

export const UploadEvidenceDialog: React.FC<UploadEvidenceDialogProps> = ({
  open,
  onOpenChange,
  requirement,
  onUpload,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const uploadFile = useUploadComplianceFile();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    try {
      await uploadFile.mutateAsync({
        file: selectedFile,
        complianceId: requirement.id,
        grantId: requirement.grant_id
      });
      
      onUpload();
      setSelectedFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    onOpenChange(false);
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
      completed: requirement?.status === 'completed'
    },
    {
      icon: Clock,
      label: "Reviewer assigned",
      date: "Jun 1, 2025",
      completed: requirement?.status === 'completed'
    },
    {
      icon: MessageSquare,
      label: "Feedback provided",
      date: "Jun 1, 2025",
      completed: requirement?.status === 'completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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
            Submit Compliance Requirement
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

          {/* Upload Document */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Upload Document</h3>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-sm p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Drag and drop your document here, or
              </p>
              <span className="text-green-600 hover:text-green-700 underline cursor-pointer">
                browse files
              </span>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-sm text-gray-500 mt-2">
                Accepts PDF, DOC, DOCX files up to 10MB
              </p>
            </div>

            {selectedFile && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-sm border mt-3">
                <File className="h-5 w-5 text-gray-500" />
                <span className="flex-1 text-sm text-gray-700 truncate">
                  {selectedFile.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {uploadFile.isPending && (
              <div className="space-y-2 mt-3">
                <Progress value={100} className="w-full animate-pulse" />
                <p className="text-sm text-gray-600 text-center">
                  Uploading document...
                </p>
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

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={uploadFile.isPending}
              className="border-gray-300 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedFile || uploadFile.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {uploadFile.isPending ? 'Uploading...' : 'Submit Requirement'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};