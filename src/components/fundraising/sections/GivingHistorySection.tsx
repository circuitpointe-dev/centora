
import React from "react";
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

export const GivingHistorySection = (): JSX.Element => {
  // Chart data
  const chartData = [
    { month: "Jan", height: "h-[107px]", color: "bg-[#9f9ff8]" },
    { month: "Feb", height: "h-[189px]", color: "bg-[#96e2d6]" },
    { month: "Mar", height: "h-[123px]", color: "bg-black" },
    { month: "Apr", height: "h-[209px]", color: "bg-[#92bfff]" },
    { month: "May", height: "h-[77px]", color: "bg-[#aec7ed]" },
    { month: "Jun", height: "h-[156px]", color: "bg-[#94e9b8]" },
    { month: "Jul", height: "h-[107px]", color: "bg-[#9f9ff8]" },
    { month: "Aug", height: "h-[189px]", color: "bg-[#96e2d6]" },
    { month: "Sep", height: "h-[123px]", color: "bg-black" },
    { month: "Oct", height: "h-[209px]", color: "bg-[#92bfff]" },
    { month: "Nov", height: "h-[77px]", color: "bg-[#aec7ed]" },
    { month: "Dec", height: "h-[156px]", color: "bg-[#94e9b8]" },
  ];

  // Y-axis labels
  const yAxisLabels = ["40k", "30k", "20k", "10k", "0"];

  return (
    <div className="flex flex-col items-start gap-6 w-full">
      <div className="flex items-center justify-between w-full">
        <h2 className="font-medium text-[#383839] text-base">
          Giving History
        </h2>

        <Select defaultValue="2024">
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
        <CardContent className="pt-10 pb-10 px-7">
          <div className="flex flex-col items-center w-full">
            <div className="relative w-full h-[235px] mb-10">
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
              <div className="inline-flex items-end gap-[53px] absolute top-0 left-[55px]">
                {chartData.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col w-[30px] items-center gap-[11px]"
                  >
                    <div
                      className={`${item.height} ${item.color} w-full rounded-[10px]`}
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
