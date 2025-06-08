
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { GivingRecord } from './ManageGivingRecordsDialog';

interface GivingRecordsChartProps {
  records: GivingRecord[];
}

export const GivingRecordsChart: React.FC<GivingRecordsChartProps> = ({ records }) => {
  const yAxisLabels = ["60k", "45k", "30k", "15k", "0"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const colors = [
    "#9f9ff8", "#96e2d6", "black", "#92bfff", "#aec7ed", "#94e9b8",
    "#9f9ff8", "#96e2d6", "black", "#92bfff", "#aec7ed", "#94e9b8"
  ];

  // Create chart data with records
  const chartData = months.map((month, index) => {
    const record = records.find(r => r.month === month);
    const amount = record?.amount || 0;
    const height = Math.max(amount / 1000, 0); // Convert to height scale
    
    return {
      month,
      amount,
      height: `${Math.min(height * 4, 200)}px`, // Scale for display
      color: colors[index]
    };
  });

  return (
    <Card className="w-full">
      <CardContent className="pt-8 pb-8 px-6">
        <div className="flex flex-col items-center w-full">
          <div className="relative w-full h-[235px] mb-8">
            {/* Y-axis labels */}
            <div className="flex flex-col w-[22px] items-center gap-8 absolute top-1.5 left-0">
              {yAxisLabels.map((label, index) => (
                <span
                  key={index}
                  className="text-[#00000066] text-xs text-center w-full"
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Chart bars */}
            <div className="flex items-end justify-between gap-2 absolute top-0 left-[35px] right-4 h-full">
              {chartData.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col flex-1 max-w-[40px] items-center gap-2"
                >
                  <div
                    className="w-full rounded-[8px] min-w-[20px]"
                    style={{
                      height: item.height,
                      backgroundColor: item.color
                    }}
                  />
                  <span className="text-[#00000066] text-xs text-center w-full">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
