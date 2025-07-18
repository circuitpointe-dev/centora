
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const GrantsProgressCard = () => {
  // Data for progress bars
  const progressData = [
    { value: 81, color: "bg-violet-600", width: "81%" },
    { value: 75, color: "bg-violet-400", width: "75%" },
  ];

  return (
    <Card className="shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-shadow duration-300 border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-700">Portfolio Progress</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="space-y-6">
          {/* First progress bar */}
          <div className="space-y-2">
            <div className="h-3.5 rounded-full bg-gray-100">
              <div
                className={`${progressData[0].color} h-3.5 rounded-full transition-all duration-500`}
                style={{ width: progressData[0].width }}
              />
            </div>
          </div>

          {/* Second progress bar */}
          <div className="space-y-2">
            <div className="h-3.5 rounded-full bg-gray-100">
              <div
                className={`${progressData[1].color} h-3.5 rounded-full transition-all duration-500`}
                style={{ width: progressData[1].width }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
