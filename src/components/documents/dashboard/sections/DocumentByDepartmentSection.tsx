
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

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

  // Heights
  const cardHeight = 412; // px
  const chartHeight = 268; // px for bars space

  const barHeight = 40; // Each bar's height
  const yAxisBottomPadding = 28; // px for space below last bar before x-axis labels
  const availableHeight = chartHeight - yAxisBottomPadding;
  const totalYAxisLabels = departmentData.length;
  // Recalculate gap to avoid bottom overlap: gap only in-between bars
  const barVerticalGap = totalYAxisLabels > 1
    ? (availableHeight - (totalYAxisLabels * barHeight)) / (totalYAxisLabels - 1)
    : 0;

  return (
    <Card className="border border-gray-200 shadow-sm rounded-sm h-[412px] min-h-[412px] flex flex-col">
      <CardHeader className="pb-4 pt-[33px] px-8">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Documents by Department
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col overflow-hidden px-8 pb-8 pt-0">
        <div className="flex-grow flex flex-col justify-center relative">
          <div className="relative" style={{ height: `${chartHeight + yAxisBottomPadding}px` }}>
            {/* Chart container */}
            <div className="flex" style={{ minHeight: `${chartHeight}px`, position: "relative", marginLeft: "68px" }}>
              {/* Y-axis labels */}
              <div className="flex flex-col w-[63px] items-end gap-2 absolute -left-[68px] top-0">
                {departmentData.map((dept, index) => (
                  <div
                    key={`dept-${index}`}
                    className="self-stretch font-normal text-[#383839bf] text-xs text-right"
                    style={{
                      height: `${barHeight}px`,
                      display: "flex",
                      alignItems: "center",
                      marginBottom: index !== departmentData.length - 1 ? `${barVerticalGap}px` : 0,
                    }}
                  >
                    {dept.name}
                  </div>
                ))}
              </div>

              {/* Chart grid and bars */}
              <div className="relative w-full" style={{ height: `${chartHeight}px` }}>
                {/* Vertical grid line */}
                <img
                  className="w-px h-full top-0 left-[7px] absolute"
                  alt="Vertical line"
                  src="https://c.animaapp.com/TW9FeRSW/img/line-41.svg"
                />

                {/* Horizontal grid line at bottom */}
                <img
                  className="w-[509px] h-px top-[calc(100%-11px)] left-[7px] absolute"
                  alt="Horizontal line"
                  src="https://c.animaapp.com/TW9FeRSW/img/line-42.svg"
                />

                {/* Horizontal tick marks */}
                {[chartHeight - 42, chartHeight - 102, chartHeight - 162, chartHeight - 222, chartHeight - 282].map(
                  (top, index) => (
                    <img
                      key={`tick-${index}`}
                      className="w-2 h-px absolute left-0"
                      style={{ top: `${top}px` }}
                      alt="Tick mark"
                      src="https://c.animaapp.com/TW9FeRSW/img/line-47.svg"
                    />
                  )
                )}

                {/* Chart bars, each with tooltip */}
                <TooltipProvider>
                  {departmentData.map((dept, index) => {
                    const maxValue = Math.max(...departmentData.map((d) => d.value));
                    const maxWidth = 400; // px, adjust as needed for your chart
                    const width = (dept.value / maxValue) * maxWidth;
                    // Calculate top position with new padding gap logic
                    const top = index * (barHeight + barVerticalGap);

                    return (
                      <Tooltip key={`tooltip-bar-${index}`}>
                        <TooltipTrigger asChild>
                          <div
                            className="absolute h-10 left-2 bg-[#4d7dfd] rounded-sm cursor-pointer"
                            style={{
                              width: `${width}px`,
                              height: `${barHeight}px`,
                              top: `${top}px`,
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
            </div>

            {/* X-axis labels INSIDE the box below the bars */}
            <div
              className="flex items-center gap-[41px] absolute left-[75px]"
              style={{
                bottom: 0,
                height: `${yAxisBottomPadding}px`,
                width: "100%",
                background: "transparent",
              }}
            >
              {xAxisLabels.map((label, index) => (
                <div
                  key={`x-label-${index}`}
                  className="font-normal text-[#383839bf] text-[11px] whitespace-nowrap"
                  style={{ minWidth: "32px" }}
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
