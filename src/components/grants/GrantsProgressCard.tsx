
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

export const GrantsProgressCard = () => {
  // Data for progress bars with labels and amounts
  const progressData = [
    { 
      label: "Disbursed Funds", 
      value: 75, 
      color: "bg-blue-500", 
      width: "75%", 
      amount: "$7,500,000",
      description: "Released over allocated"
    },
    { 
      label: "Spent Funds", 
      value: 93, 
      color: "bg-red-500", 
      width: "93%", 
      amount: "$7,000,000",
      description: "Expended over released"
    },
  ];

  return (
    <Card className="border border-violet-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Portfolio Progress</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="space-y-6">
          {/* Disbursed Funds Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600">{progressData[0].label} - {progressData[0].amount}</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100">
              <div
                className={`${progressData[0].color} h-2 rounded-full transition-all duration-500`}
                style={{ width: progressData[0].width }}
              />
            </div>
          </div>

          {/* Spent Funds Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600">{progressData[1].label} - {progressData[1].amount}</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100">
              <div
                className={`${progressData[1].color} h-2 rounded-full transition-all duration-500`}
                style={{ width: progressData[1].width }}
              />
            </div>
          </div>

          {/* Total burn rate display */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Total burn rate (%)</span>
              <span className="text-lg font-bold text-gray-900">93%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
