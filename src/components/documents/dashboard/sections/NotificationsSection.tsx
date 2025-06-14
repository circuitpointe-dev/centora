import {
  FileTextIcon,
  FolderIcon,
  SettingsIcon,
  ShieldIcon,
  UploadIcon,
} from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

export const NotificationsSection = (): JSX.Element => {
  // Document types data for the chart and legend
  const documentTypes = [
    { name: "Policies", percentage: "16%", color: "#4d7dfd" },
    { name: "Contracts", percentage: "28%", color: "#ff9090" },
    { name: "Finance", percentage: "24%", color: "#a66ffe" },
    { name: "Reports", percentage: "32%", color: "#2af12a" },
  ];

  // Quick links data
  const quickLinks = [
    {
      icon: <UploadIcon className="h-3.5 w-3.5" />,
      text: "UploadIcon Document",
      bgColor: "bg-[#e7eefc]",
    },
    {
      icon: <FileTextIcon className="h-3.5 w-3.5" />,
      text: "Go to Document Repository",
      bgColor: "bg-[#e7fcf5]",
    },
    {
      icon: <FolderIcon className="h-3.5 w-3.5" />,
      text: "Access Templates & Library",
      bgColor: "bg-[#f2e7fc]",
    },
    {
      icon: <ShieldIcon className="h-3.5 w-3.5" />,
      text: "View Compliance Summary",
      bgColor: "bg-[#fdeee6]",
    },
    {
      icon: <SettingsIcon className="h-3.5 w-3.5" />,
      text: "Open Settings",
      bgColor: "bg-[#f2f2f2]",
    },
  ];

  return (
    <div className="flex items-center gap-8">
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

      {/* Quick Links Card */}
      <Card className="w-[382px] shadow-[0px_4px_16px_#eae2fd] rounded-[10px]">
        <CardContent className="flex flex-col items-start gap-4 pl-6 pr-0 pt-[33px] pb-6">
          <h3 className="font-medium text-[#383839] text-lg font-['Inter',Helvetica]">
            Quick Links
          </h3>

          <div className="flex flex-col items-start gap-[18px]">
            {quickLinks.map((link, index) => (
              <button
                key={index}
                className="flex items-center gap-2.5 hover:opacity-80 cursor-pointer"
              >
                <div
                  className={`flex w-8 h-8 items-center justify-center rounded-[42px] ${link.bgColor}`}
                >
                  {link.icon}
                </div>
                <span className="font-medium text-[#383839] text-sm font-['Inter',Helvetica]">
                  {link.text}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
