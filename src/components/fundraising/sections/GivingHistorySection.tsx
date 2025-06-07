
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
import { givingHistoryData } from "@/data/givingHistoryData";

export const GivingHistorySection = (): JSX.Element => {
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  // Get data for selected year
  const currentYearData = givingHistoryData.find(data => data.year === selectedYear);
  const chartData = currentYearData?.monthlyData || [];

  // Y-axis labels
  const yAxisLabels = ["40k", "30k", "20k", "10k", "0"];

  return (
    <div className="flex flex-col items-start gap-6 w-full">
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
            <div className="relative w-full max-w-[700px] h-[235px] mb-8">
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
              <div className="flex items-end gap-4 absolute top-0 left-[35px] right-0 overflow-x-auto">
                {chartData.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col min-w-[25px] items-center gap-2"
                  >
                    <div
                      className={`${item.height} ${item.color} w-full rounded-[8px] min-w-[25px]`}
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
              asChild
            >
              <Link to="/giving-history">Manage Giving Records</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
