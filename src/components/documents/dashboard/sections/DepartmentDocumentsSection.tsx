import {
  FileTextIcon,
  PenSquareIcon,
  ShieldIcon,
  TimerIcon,
} from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

// Data for document statistics cards
const documentStats = [
  {
    icon: <FileTextIcon className="w-5 h-5 text-blue-600" />,
    iconBg: "bg-[#e7eefc]",
    count: "100",
    label: "Total Documents Uploaded",
  },
  {
    icon: <PenSquareIcon className="w-5 h-5 text-orange-500" />,
    iconBg: "bg-[#fdf5e6]",
    count: "43",
    label: "Signature Request Overdue",
  },
  {
    icon: <TimerIcon className="w-[18px] h-[18px] text-red-500" />,
    iconBg: "bg-[#fbe9e9]",
    count: "15",
    label: "Documents Expiring in 30 Days",
  },
  {
    icon: <ShieldIcon className="w-6 h-6 text-green-500" />,
    iconBg: "bg-[#e7fcf5]",
    count: "30",
    label: "Unacknowledged Policies",
  },
];

export const DepartmentDocumentsSection = (): JSX.Element => {
  return (
    <div className="flex items-center gap-8">
      {documentStats.map((stat, index) => (
        <Card
          key={index}
          className="w-60 h-[152px] shadow-[0px_4px_16px_#eae2fd] rounded-[10px]"
        >
          <CardContent className="flex flex-col items-center gap-4 p-4">
            <div
              className={`flex w-12 h-12 items-center justify-center rounded-[42px] ${stat.iconBg}`}
            >
              {stat.icon}
            </div>

            <div className="flex flex-col items-center justify-center gap-1">
              <div className="font-semibold text-[#373839] text-xl leading-[25px] mt-[-1.00px] [font-family:'Inter',Helvetica] tracking-[0] whitespace-nowrap">
                {stat.count}
              </div>

              <div className="[font-family:'Inter',Helvetica] font-normal text-gray-500 text-xs tracking-[0] leading-[15px] whitespace-nowrap">
                {stat.label}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
