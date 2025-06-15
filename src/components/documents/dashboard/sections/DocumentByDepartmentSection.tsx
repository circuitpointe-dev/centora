import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export const DocumentByDepartmentSection = (): JSX.Element => {
  // Chart data
  const departmentData = [
    { name: "Finance", value: 165 },
    { name: "Operations", value: 346 },
    { name: "HR", value: 442 },
    { name: "Legal", value: 61 },
    { name: "IT", value: 284 },
  ];

  // X-axis labels
  const xAxisLabels = [0, 50, 100, 150, 200, 250, 300, 350, 400];

  return (
    <Card className="border border-gray-200 shadow-sm rounded-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Documents by Department
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-full">
        <div className="p-8 pt-[33px]">
          <div className="relative h-[328px]">
            {/* Chart container */}
            <div className="flex h-[309px] ml-[68px] relative">
              {/* Y-axis labels */}
              <div className="flex flex-col w-[63px] items-end gap-[45px] absolute -left-[68px] top-5">
                {departmentData.map((dept, index) => (
                  <div
                    key={`dept-${index}`}
                    className="self-stretch font-normal text-[#383839bf] text-xs text-right"
                  >
                    {dept.name}
                  </div>
                ))}
              </div>

              {/* Chart grid and bars */}
              <div className="relative w-full h-[309px]">
                {/* Vertical grid line */}
                <img
                  className="w-px h-[309px] top-0 left-[7px] absolute"
                  alt="Vertical line"
                  src="https://c.animaapp.com/TW9FeRSW/img/line-41.svg"
                />

                {/* Horizontal grid line at bottom */}
                <img
                  className="w-[509px] h-px top-[298px] left-[7px] absolute"
                  alt="Horizontal line"
                  src="https://c.animaapp.com/TW9FeRSW/img/line-42.svg"
                />

                {/* Horizontal tick marks */}
                {[267, 207, 147, 87, 27].map((top, index) => (
                  <img
                    key={`tick-${index}`}
                    className="w-2 h-px absolute left-0"
                    style={{ top: `${top}px` }}
                    alt="Tick mark"
                    src="https://c.animaapp.com/TW9FeRSW/img/line-47.svg"
                  />
                ))}

                {/* Chart bars */}
                {departmentData.map((dept, index) => {
                  // Calculate the width based on the maximum value
                  const maxValue = Math.max(
                    ...departmentData.map((d) => d.value)
                  );
                  const maxWidth = 400; // px, adjust as needed for your chart
                  const width = (dept.value / maxValue) * maxWidth;

                  return (
                    <div
                      key={`bar-${index}`}
                      className="absolute h-10 left-2 bg-[#4d7dfd]"
                      style={{
                        width: `${width}px`,
                        top: index * 60 + 2,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* X-axis labels */}
            <div className="flex items-center gap-[41px] absolute bottom-0 left-[75px]">
              {xAxisLabels.map((label, index) => (
                <div
                  key={`x-label-${index}`}
                  className="font-normal text-[#383839bf] text-[11px] whitespace-nowrap"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
