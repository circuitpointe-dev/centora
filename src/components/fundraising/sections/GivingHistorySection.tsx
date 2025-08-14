import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ManageGivingRecordsDialog } from "../ManageGivingRecordsDialog";
import { useDonorGivingRecords } from "@/hooks/useDonorGivingRecords";
import { getMonthName, MONTH_NAMES } from "@/utils/monthConversion";

interface GivingHistorySectionProps {
  donorId: string;
}

export const GivingHistorySection: React.FC<GivingHistorySectionProps> = ({ donorId }) => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch giving records for the donor
  const { data: records = [], isLoading, error } = useDonorGivingRecords(donorId, selectedYear);

  // Get available years from all records
  const { data: allRecords = [] } = useDonorGivingRecords(donorId);
  
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(allRecords.map(record => record.year)));
    return years.sort((a, b) => b - a); // Sort descending
  }, [allRecords]);

  // Set default year to the most recent year with data
  React.useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  // Chart colors for each month
  const colors = [
    "#9f9ff8", "#96e2d6", "black", "#92bfff", "#aec7ed", "#94e9b8",
    "#9f9ff8", "#96e2d6", "black", "#92bfff", "#aec7ed", "#94e9b8"
  ];

  // Transform database records into chart data
  const chartData = useMemo(() => {
    const maxAmount = Math.max(...records.map(r => Number(r.amount)), 60000);
    
    return MONTH_NAMES.map((month, index) => {
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
  }, [records]);

  // Y-axis labels based on max amount
  const yAxisLabels = useMemo(() => {
    const maxAmount = Math.max(...records.map(r => Number(r.amount)), 60000);
    const step = Math.ceil(maxAmount / 4 / 1000) * 1000;
    return [
      `${step * 4 / 1000}k`,
      `${step * 3 / 1000}k`,
      `${step * 2 / 1000}k`,
      `${step / 1000}k`,
      "0"
    ];
  }, [records]);

  const hasData = records.length > 0;

  return (
    <>
      <div className="flex flex-col items-start gap-6 w-full px-6 pb-6">
        <div className="flex items-center justify-between w-full">
          <h2 className="font-medium text-[#383839] text-base">
            Giving History
          </h2>

          <Select 
            value={selectedYear.toString()} 
            onValueChange={(value) => setSelectedYear(parseInt(value))}
            disabled={availableYears.length === 0}
          >
            <SelectTrigger className="w-[113px] border-violet-600 text-violet-600">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
              {availableYears.length === 0 && (
                <SelectItem value={selectedYear.toString()}>{selectedYear}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <Card className="w-full">
          <CardContent className="pt-8 pb-8 px-6">
            <div className="flex flex-col items-center w-full">
              {isLoading ? (
                <div className="h-[235px] flex items-center justify-center">
                  <div className="text-gray-500">Loading giving history...</div>
                </div>
              ) : hasData ? (
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
                  <div className="text-lg font-medium mb-2">No giving history found</div>
                  <div className="text-sm text-center">
                    This donor has no giving records for {selectedYear}.
                    <br />
                    Start by adding some records.
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                className="text-violet-600 border-violet-600"
                onClick={() => setIsDialogOpen(true)}
              >
                Manage Giving Records
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ManageGivingRecordsDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        donorId={donorId}
      />
    </>
  );
};
