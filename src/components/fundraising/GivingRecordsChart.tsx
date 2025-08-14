
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DonorGivingRecord } from '@/hooks/useDonorGivingRecords';
import { getMonthName, MONTH_NAMES } from '@/utils/monthConversion';

interface GivingRecordsChartProps {
  records: DonorGivingRecord[];
}

export const GivingRecordsChart: React.FC<GivingRecordsChartProps> = ({ records }) => {
  const colors = [
    "#9f9ff8", "#96e2d6", "black", "#92bfff", "#aec7ed", "#94e9b8",
    "#9f9ff8", "#96e2d6", "black", "#92bfff", "#aec7ed", "#94e9b8"
  ];

  // Calculate max amount for scaling
  const maxAmount = Math.max(...records.map(r => Number(r.amount)), 60000);
  
  // Create chart data with records
  const chartData = MONTH_NAMES.map((month, index) => {
    const record = records.find(r => getMonthName(r.month) === month);
    const amount = record ? Number(record.amount) : 0;
    const height = amount > 0 ? Math.max((amount / maxAmount) * 200, 8) : 0;
    
    return {
      month,
      amount,
      height: `${height}px`,
      color: colors[index]
    };
  });

  // Generate Y-axis labels based on data
  const yAxisLabels = React.useMemo(() => {
    const step = Math.ceil(maxAmount / 4 / 1000) * 1000;
    return [
      `${step * 4 / 1000}k`,
      `${step * 3 / 1000}k`,
      `${step * 2 / 1000}k`,
      `${step / 1000}k`,
      "0"
    ];
  }, [maxAmount]);

  const hasData = records.length > 0;

  return (
    <Card className="w-full">
      <CardContent className="pt-8 pb-8 px-6">
        <div className="flex flex-col items-center w-full">
          {hasData ? (
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
          ) : (
            <div className="h-[235px] flex flex-col items-center justify-center text-gray-500">
              <div className="text-lg font-medium mb-2">No giving records found</div>
              <div className="text-sm text-center">
                No giving history available for the selected year.
                <br />
                Add some records to see the chart.
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
