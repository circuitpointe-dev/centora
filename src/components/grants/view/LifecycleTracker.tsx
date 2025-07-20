import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface LifecycleTrackerProps {
  currentStatus: string;
}

export const LifecycleTracker: React.FC<LifecycleTrackerProps> = ({ currentStatus }) => {
  const stages = [
    { id: 1, name: "Application", key: "Pending", isActive: false },
    { id: 2, name: "Approved", key: "Approved", isActive: false },
    { id: 3, name: "Active", key: "Active", isActive: false },
    { id: 4, name: "Closed", key: "Closed", isActive: false }
  ];

  const getCurrentStageIndex = () => {
    const index = stages.findIndex(stage => stage.key === currentStatus);
    return index !== -1 ? index : 0;
  };

  const currentIndex = getCurrentStageIndex();
  
  // Update stages with active status
  const updatedStages = stages.map((stage, index) => ({
    ...stage,
    isActive: index <= currentIndex
  }));

  const progressPercentage = ((currentIndex + 1) / stages.length) * 100;

  return (
    <Card className="rounded-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-200">
      <CardContent className="flex flex-col h-[145px] items-center gap-8 px-[13px] py-6 bg-white">
        <div className="flex flex-col items-start gap-6 relative self-stretch w-full">
          <div className="flex flex-col items-start gap-4 relative self-stretch w-full">
            <div className="flex items-center justify-start relative self-stretch w-full">
              <h3 className="font-normal text-[#383838] text-[19px] [font-family:'Inter-Regular',Helvetica]">
                Lifecycle Tracker
              </h3>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 relative self-stretch w-full">
            <div className="flex items-end justify-between px-[78px] py-0 relative self-stretch w-full">
              {updatedStages.map((stage) => (
                <Badge
                  key={stage.id}
                  variant="outline"
                  className={`w-[77px] h-auto px-3 py-1.5 rounded-2xl flex items-center justify-center ${
                    stage.isActive
                      ? "bg-violet-600 text-white border-violet-600"
                      : "bg-transparent text-violet-600 border-violet-600"
                  }`}
                >
                  <span className="text-[10px] font-normal [font-family:'Inter-Regular',Helvetica] text-center">
                    {stage.name}
                  </span>
                </Badge>
              ))}
            </div>

            <Progress
              value={progressPercentage}
              className="h-2.5 w-full bg-[#f0f1f4] rounded-[27px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};