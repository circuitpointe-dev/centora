
import React from "react";
import { CheckCircle, Clock, Circle, User } from "lucide-react";

const submissionStages = [
  { id: 1, name: "Draft", date: "Apr 26, 2024", status: "completed" },
  { id: 2, name: "Under Review", date: "Apr 26, 2024", status: "current" },
  { id: 3, name: "Submitted", date: "Pending", status: "pending" },
  { id: 4, name: "Reviewed", date: "Pending", status: "pending" },
  { id: 5, name: "Final Decision", date: "Pending", status: "pending" },
];

const submissionRequirements = [
  { name: "Basic Information", status: "complete", progress: 100 },
  { name: "Document Upload", status: "complete", progress: 100 },
  { name: "Review Form", status: "pending", progress: 0 },
  { name: "Signatures", status: "pending", progress: 0 },
  { name: "Terms Acceptance", status: "pending", progress: 0 },
];

const SubmissionTrackerDialog: React.FC = () => {
  const overallProgress = Math.round(
    (submissionRequirements.filter(req => req.status === "complete").length / submissionRequirements.length) * 100
  );

  const getStageIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "current":
        return <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white" />
        </div>;
      default:
        return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  const getRequirementIcon = (status: string) => {
    return status === "complete" ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <Circle className="w-4 h-4 text-gray-300" />;
  };

  return (
    <div className="grid grid-cols-2 gap-6 p-4">
      {/* Left side - Submission Progress */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Submission Progress</h3>
        <div className="space-y-4">
          {submissionStages.map((stage, index) => (
            <div key={stage.id} className="flex items-center gap-3">
              {getStageIcon(stage.status)}
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  stage.status === "current" ? "text-blue-600" : 
                  stage.status === "completed" ? "text-green-600" : "text-gray-500"
                }`}>
                  {stage.name}
                </p>
                <p className="text-xs text-gray-500">{stage.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Requirements */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Submission Requirements</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span className="font-medium">{overallProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            {submissionRequirements.map((req, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getRequirementIcon(req.status)}
                  <span className="text-sm">{req.name}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  req.status === "complete" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {req.status === "complete" ? "Complete" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Current Status</h4>
          <div className="flex items-center gap-2 text-blue-700 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-sm font-medium">Under Review</span>
          </div>
          <div className="flex items-center gap-2 text-blue-600 text-xs">
            <Clock className="w-3 h-3" />
            <span>Updated 2 hours ago</span>
          </div>
          <div className="flex items-center gap-2 text-blue-600 text-xs mt-1">
            <User className="w-3 h-3" />
            <span>Assigned to John Doe</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionTrackerDialog;
