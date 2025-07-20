import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LifecycleTrackerProps {
  currentStatus: string;
}

export const LifecycleTracker: React.FC<LifecycleTrackerProps> = ({ currentStatus }) => {
  const stages = [
    { name: "Application", key: "Pending" },
    { name: "Approved", key: "Approved" },
    { name: "Active", key: "Active" },
    { name: "Closed", key: "Closed" }
  ];

  const getCurrentStageIndex = () => {
    const index = stages.findIndex(stage => stage.key === currentStatus);
    return index !== -1 ? index : 0;
  };

  const currentIndex = getCurrentStageIndex();

  const getStageStyle = (index: number) => {
    if (index < currentIndex) {
      // Past stages - completed
      return "bg-purple-600 text-white border-purple-600";
    } else if (index === currentIndex) {
      // Current stage - active
      return "bg-purple-600 text-white border-purple-600";
    } else {
      // Future stages - pending
      return "bg-white text-gray-400 border-gray-300";
    }
  };

  const getConnectorStyle = (index: number) => {
    if (index < currentIndex) {
      return "bg-purple-600";
    } else {
      return "bg-gray-300";
    }
  };

  return (
    <Card className="rounded-sm mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-black">
          Lifecycle tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="flex items-center justify-between relative">
          {stages.map((stage, index) => (
            <React.Fragment key={stage.key}>
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${getStageStyle(index)}`}
                >
                  {stage.name}
                </div>
              </div>
              {index < stages.length - 1 && (
                <div 
                  className={`flex-1 h-1 mx-4 transition-colors ${getConnectorStyle(index)}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};