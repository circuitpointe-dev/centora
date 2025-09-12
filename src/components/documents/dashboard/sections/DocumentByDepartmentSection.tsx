import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { useDocumentsByDepartment } from "@/hooks/useDashboardStats";
import { Loader2, BarChart3 } from "lucide-react";

export const DocumentByDepartmentSection = (): JSX.Element => {
  const { data: departmentResponse, isLoading, error } = useDocumentsByDepartment();

  if (isLoading) {
    return (
      <Card className="border border-gray-200 shadow-sm rounded-sm h-[412px] min-h-[412px] flex flex-col">
        <CardHeader className="pb-4 pt-[33px] px-8">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Documents by Department
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col overflow-hidden px-8 pb-8 pt-0">
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !departmentResponse || departmentResponse.length === 0) {
    return (
      <Card className="border border-gray-200 shadow-sm rounded-sm h-[412px] min-h-[412px] flex flex-col">
        <CardHeader className="pb-4 pt-[33px] px-8">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Documents by Department
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col overflow-hidden px-8 pb-8 pt-0">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform the data to match the component structure
  const departmentData = departmentResponse.map(item => ({
    name: item.department,
    value: item.count
  }));

  // Calculate max value and create x-axis labels based on data
  const maxValue = Math.max(...departmentData.map((d) => d.value));
  const step = Math.ceil(maxValue / 9);
  const xAxisLabels = Array.from({ length: 10 }, (_, i) => i * step);

  // Layout constants
  const cardHeight = 412;
  const yAxisLabelWidth = 64;
  const chartHorizontalPadding = 12; // For visual spacing on each side of the chart grid
  const chartWidth = 420;
  const chartHeight = 240; // Space for bars only
  const barHeight = 40;
  const yAxisBottomPadding = 36; // Space below last bar before x-axis
  const availableHeight = chartHeight;
  const totalBars = departmentData.length;
  // Evenly distribute bars/spacing, but keep last bar off the x-axis
  const barVerticalGap =
    totalBars > 1
      ? (availableHeight - totalBars * barHeight) / (totalBars - 1)
      : 0;

  // Determine max value for scaling
  const calculatedMaxValue = Math.max(...departmentData.map((d) => d.value));
  // Chart bar maximum width (not full chart width, leave margin for tooltip, etc)
  const barMaxWidth = chartWidth - 16;

  return (
    <Card className="border border-gray-200 shadow-sm rounded-sm h-[412px] min-h-[412px] flex flex-col">
      <CardHeader className="pb-4 pt-[33px] px-8">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Documents by Department
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col overflow-hidden px-8 pb-8 pt-0">
        <div className="flex-grow flex flex-col justify-center relative">
          {/* Chart + axes container */}
          <div className="relative" style={{ height: cardHeight - 106 }}>
            <div
              className="flex relative"
              style={{
                paddingLeft: yAxisLabelWidth,
                paddingRight: chartHorizontalPadding,
                height: chartHeight + yAxisBottomPadding,
                width: chartWidth + yAxisLabelWidth,
              }}
            >
              {/* Y-axis line */}
              <div
                className="absolute"
                style={{
                  left: yAxisLabelWidth - 1,
                  top: 0,
                  width: "1px",
                  height: chartHeight,
                  background: "#D1D5DB", // Tailwind gray-300
                  zIndex: 1,
                }}
              />

              {/* Y-axis labels, perfectly centered on their bars */}
              <div
                className="absolute flex flex-col left-0"
                style={{
                  width: yAxisLabelWidth - 6,
                  top: 0,
                  height: chartHeight,
                  justifyContent: "flex-start",
                  zIndex: 2,
                }}
              >
                {departmentData.map((dept, idx) => (
                  <div
                    key={dept.name}
                    className="font-normal text-[#383839bf] text-xs text-right flex items-center justify-end"
                    style={{
                      height: `${barHeight}px`,
                      marginBottom: idx === departmentData.length - 1 ? 0 : `${barVerticalGap}px`,
                    }}
                  >
                    {dept.name}
                  </div>
                ))}
              </div>

              {/* Chart bars section (positioned right of y-axis line) */}
              <div
                className="relative"
                style={{
                  width: chartWidth,
                  height: chartHeight,
                  marginLeft: "0px",
                  zIndex: 2,
                  background: "transparent",
                }}
              >
                <TooltipProvider>
                  {departmentData.map((dept, index) => {
                    const width = (dept.value / calculatedMaxValue) * barMaxWidth;
                    const top = index * (barHeight + barVerticalGap);

                    return (
                      <Tooltip key={`bar-${index}`}>
                        <TooltipTrigger asChild>
                          <div
                            className="absolute bg-[#4d7dfd] rounded-sm cursor-pointer"
                            style={{
                              width: `${width}px`,
                              height: `${barHeight}px`,
                              left: "0px",
                              top: `${top}px`,
                              display: "flex",
                              alignItems: "center",
                              zIndex: 3,
                            }}
                            aria-label={`${dept.name}: ${dept.value} documents`}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-black text-white rounded-sm px-3 py-2">
                          <div className="font-semibold">{dept.name}</div>
                          <div>{dept.value} documents</div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </TooltipProvider>
              </div>

              {/* X-axis line: full-width, directly under the bars */}
              <div
                className="absolute"
                style={{
                  left: yAxisLabelWidth - 1,
                  top: chartHeight - 1,
                  width: chartWidth,
                  height: "2px",
                  background: "#D1D5DB", // Tailwind gray-300
                  zIndex: 1,
                }}
              />
            </div>

            {/* X-axis labels: below the x-axis line */}
            <div
              className="flex absolute left-0"
              style={{
                top: chartHeight + 6,
                width: yAxisLabelWidth + chartWidth,
                minHeight: `${yAxisBottomPadding - 5}px`,
                zIndex: 2,
                pointerEvents: "none",
                paddingLeft: yAxisLabelWidth - 1,
              }}
            >
              {/* Stretch labels under bars */}
              <div className="flex w-full items-center gap-0">
                {xAxisLabels.map((label, idx) => (
                  <div
                    key={`x-label-${idx}`}
                    className="font-normal text-[#383839bf] text-[11px] whitespace-nowrap text-center"
                    style={{
                      width:
                        idx === 0
                          ? `${(barMaxWidth / (xAxisLabels.length - 1)) / 1.7}px`
                          : idx === xAxisLabels.length - 1
                          ? `${(barMaxWidth / (xAxisLabels.length - 1)) / 1.3}px`
                          : `${barMaxWidth / (xAxisLabels.length - 1)}px`,
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
