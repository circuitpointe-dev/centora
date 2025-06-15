import { Card, CardContent } from "../../../../components/ui/card";

export const DocumentByDepartmentSection = (): JSX.Element => {
  // Chart data
  const departmentData = [
    { name: "Finance", value: 165, width: "165px" },
    { name: "Operations", value: 346, width: "346px" },
    { name: "Finance", value: 442, width: "442px" },
    { name: "Legal", value: 61, width: "61px" },
    { name: "IT", value: 284, width: "284px" },
  ];

  // X-axis labels
  const xAxisLabels = [0, 50, 100, 150, 200, 250, 300, 350, 400];

  return (
    <div>
      {/* Documents by Department Chart */}
      <Card className="w-[640px] h-[448px] shadow-[0px_4px_16px_#eae2fd]">
        <CardContent className="p-0 h-full">
          <div className="p-8 pt-[33px]">
            <h3 className="font-medium text-[#383839] text-lg mb-6">
              Documents by Department
            </h3>

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
                  {departmentData.map((dept, index) => (
                    <div
                      key={`bar-${index}`}
                      className="absolute h-10 left-2 bg-[#4d7dfd]"
                      style={{
                        width: dept.width,
                        top: index * 60 + 2,
                      }}
                    />
                  ))}
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
    </div>
  );
};
