import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LifecycleTrackerProps {
  currentStatus: 'Application' | 'Approved' | 'Active' | 'Closed';
}

export const LifecycleTracker: React.FC<LifecycleTrackerProps> = ({ currentStatus }) => {
  const stages = ['Application', 'Approved', 'Active', 'Closed'];
  const currentIndex = stages.indexOf(currentStatus);

  const getStageStyle = (index: number) => {
    if (index < currentIndex) {
      // Past stages
      return 'bg-violet-100 text-violet-600 border-violet-200';
    } else if (index === currentIndex) {
      // Current stage
      return 'bg-violet-600 text-white border-violet-600';
    } else {
      // Future stages
      return 'bg-gray-100 text-gray-400 border-gray-200';
    }
  };

  const getProgressWidth = () => {
    return `${(currentIndex / (stages.length - 1)) * 100}%`;
  };

  return (
    <Card className="rounded-sm mb-6">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-lg font-semibold text-black">
          Lifecycle tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-2">
        <div className="relative">
          {/* Progress bar background */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
          
          {/* Progress bar fill */}
          <div 
            className="absolute top-6 left-0 h-1 bg-violet-600 rounded-full transition-all duration-300"
            style={{ width: getProgressWidth() }}
          ></div>

          {/* Stage badges */}
          <div className="flex justify-between relative z-10">
            {stages.map((stage, index) => (
              <Badge
                key={stage}
                variant="outline"
                className={`px-4 py-2 rounded-full border-2 font-medium ${getStageStyle(index)}`}
              >
                {stage}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};