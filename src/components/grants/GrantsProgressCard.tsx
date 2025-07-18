
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

export const GrantsProgressCard = () => {
  // Data for progress bars
  const progressData = [
    { value: 81, color: "bg-violet-600", width: "81%" },
    { value: 75, color: "bg-violet-400", width: "75%" },
  ];

  // Data for checkboxes
  const checkboxItems = [
    { id: "disbursement", label: "Disbursement", color: "#7C3AED" },
    { id: "spending", label: "Spending", color: "#AD8AF5" },
  ];

  return (
    <Card className="border border-violet-200 rounded-lg h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Portfolio Progress</CardTitle>
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

          {/* Checkbox section */}
          <div className="flex gap-8 pt-2">
            {checkboxItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <Checkbox
                  id={item.id}
                  className="w-5 h-5 border-2"
                  style={{ borderColor: item.color }}
                  defaultChecked
                />
                <label
                  htmlFor={item.id}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
