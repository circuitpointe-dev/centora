import React, { useState } from "react";
import { Link } from "react-router-dom";
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

const givingHistoryData = {
  2024: [
    { month: "Jan", amount: 15000, height: "h-[60px]", color: "bg-[#9f9ff8]" },
    { month: "Feb", amount: 25000, height: "h-[100px]", color: "bg-[#96e2d6]" },
    { month: "Mar", amount: 35000, height: "h-[140px]", color: "bg-black" },
    { month: "Apr", amount: 20000, height: "h-[80px]", color: "bg-[#92bfff]" },
    { month: "May", amount: 45000, height: "h-[180px]", color: "bg-[#aec7ed]" },
    { month: "Jun", amount: 30000, height: "h-[120px]", color: "bg-[#94e9b8]" },
    { month: "Jul", amount: 50000, height: "h-[200px]", color: "bg-[#9f9ff8]" },
    { month: "Aug", amount: 40000, height: "h-[160px]", color: "bg-[#96e2d6]" },
    { month: "Sep", amount: 60000, height: "h-[220px]", color: "bg-black" },
    { month: "Oct", amount: 35000, height: "h-[140px]", color: "bg-[#92bfff]" },
    { month: "Nov", amount: 25000, height: "h-[100px]", color: "bg-[#aec7ed]" },
    { month: "Dec", amount: 55000, height: "h-[210px]", color: "bg-[#94e9b8]" },
  ],
  2023: [
    { month: "Jan", amount: 12000, height: "h-[48px]", color: "bg-[#9f9ff8]" },
    { month: "Feb", amount: 22000, height: "h-[88px]", color: "bg-[#96e2d6]" },
    { month: "Mar", amount: 28000, height: "h-[112px]", color: "bg-black" },
    { month: "Apr", amount: 18000, height: "h-[72px]", color: "bg-[#92bfff]" },
    { month: "May", amount: 35000, height: "h-[140px]", color: "bg-[#aec7ed]" },
    { month: "Jun", amount: 25000, height: "h-[100px]", color: "bg-[#94e9b8]" },
    { month: "Jul", amount: 40000, height: "h-[160px]", color: "bg-[#9f9ff8]" },
    { month: "Aug", amount: 32000, height: "h-[128px]", color: "bg-[#96e2d6]" },
    { month: "Sep", amount: 48000, height: "h-[192px]", color: "bg-black" },
    { month: "Oct", amount: 30000, height: "h-[120px]", color: "bg-[#92bfff]" },
    { month: "Nov", amount: 20000, height: "h-[80px]", color: "bg-[#aec7ed]" },
    { month: "Dec", amount: 45000, height: "h-[180px]", color: "bg-[#94e9b8]" },
  ],
  2022: [
    { month: "Jan", amount: 8000, height: "h-[32px]", color: "bg-[#9f9ff8]" },
    { month: "Feb", amount: 18000, height: "h-[72px]", color: "bg-[#96e2d6]" },
    { month: "Mar", amount: 24000, height: "h-[96px]", color: "bg-black" },
    { month: "Apr", amount: 15000, height: "h-[60px]", color: "bg-[#92bfff]" },
    { month: "May", amount: 28000, height: "h-[112px]", color: "bg-[#aec7ed]" },
    { month: "Jun", amount: 20000, height: "h-[80px]", color: "bg-[#94e9b8]" },
    { month: "Jul", amount: 32000, height: "h-[128px]", color: "bg-[#9f9ff8]" },
    { month: "Aug", amount: 26000, height: "h-[104px]", color: "bg-[#96e2d6]" },
    { month: "Sep", amount: 38000, height: "h-[152px]", color: "bg-black" },
    { month: "Oct", amount: 22000, height: "h-[88px]", color: "bg-[#92bfff]" },
    { month: "Nov", amount: 16000, height: "h-[64px]", color: "bg-[#aec7ed]" },
    { month: "Dec", amount: 35000, height: "h-[140px]", color: "bg-[#94e9b8]" },
  ],
};

export const GivingHistorySection = (): JSX.Element => {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get data for selected year
  const chartData = givingHistoryData[selectedYear as keyof typeof givingHistoryData] || [];

  // Y-axis labels
  const yAxisLabels = ["60k", "45k", "30k", "15k", "0"];

  return (
    <>
      <div className="flex flex-col items-start gap-6 w-full px-6 pb-6">
        <div className="flex items-center justify-between w-full">
          <h2 className="font-medium text-[#383839] text-base">
            Giving History
          </h2>

          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-[113px] border-violet-600 text-violet-600">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
                        className={`${item.height} ${item.color} w-full rounded-[8px] min-w-[20px]`}
                      />
                      <span className="text-[#00000066] text-xs text-center w-full">
                        {item.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

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
      />
    </>
  );
};
