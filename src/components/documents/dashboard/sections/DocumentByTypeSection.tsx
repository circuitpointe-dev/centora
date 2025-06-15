import { Card, CardContent } from "../../../ui/card";

export const DocumentByTypeSection = (): JSX.Element => {
  // Document types data for the chart and legend
  const documentTypes = [
    { name: "Policies", percentage: "16%", color: "#4d7dfd" },
    { name: "Contracts", percentage: "28%", color: "#ff9090" },
    { name: "Finance", percentage: "24%", color: "#a66ffe" },
    { name: "Reports", percentage: "32%", color: "#2af12a" },
  ];

  return (
    <div>
      {/* Documents by Type Card */}
      <Card className="w-[640px] shadow-[0px_4px_16px_#eae2fd] rounded-[10px]">
        <CardContent className="flex flex-col items-start justify-center gap-6 p-10">
          <h3 className="font-medium text-[#383839] text-lg font-['Inter',Helvetica]">
            Documents by Type
          </h3>

          <div className="flex items-center gap-[66px] w-full">
            {/* Chart */}
            <div className="relative w-56 h-56">
              <div className="relative h-56">
                <img
                  className="absolute w-[138px] h-[108px] top-0 left-[86px]"
                  alt="Ellipse"
                  src="https://c.animaapp.com/TW9FeRSW/img/ellipse-1134.svg"
                />
                <img
                  className="absolute w-[91px] h-[126px] top-[5px] left-0"
                  alt="Ellipse"
                  src="https://c.animaapp.com/TW9FeRSW/img/ellipse-1135.svg"
                />
                <img
                  className="absolute w-[155px] h-[97px] top-[127px] left-[3px]"
                  alt="Ellipse"
                  src="https://c.animaapp.com/TW9FeRSW/img/ellipse-1138.svg"
                />
                <img
                  className="absolute w-20 h-[101px] top-[111px] left-36"
                  alt="Ellipse"
                  src="https://c.animaapp.com/TW9FeRSW/img/ellipse-1136.svg"
                />
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col w-36 items-start gap-6">
              {documentTypes.map((type, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-[5px]"
                    style={{ backgroundColor: type.color }}
                  />
                  <div className="font-medium text-[#383839cc] text-sm leading-5 whitespace-nowrap font-['Inter',Helvetica]">
                    {type.name} ({type.percentage})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
