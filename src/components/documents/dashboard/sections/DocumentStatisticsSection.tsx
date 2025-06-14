import { DollarSignIcon, FileIcon } from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";

// Activity data for mapping
const recentActivities = [
  {
    icon: "file",
    iconBg: "bg-[#fef8e6]",
    title: "Updated Company Policy",
    description: "Modified section 3.2",
    timeAgo: "2 Hours ago",
  },
  {
    icon: "dollar",
    iconBg: "bg-[#eaf9f0]",
    title: "Finance Report",
    description: "Signed Q3 finance report",
    timeAgo: "5 Hours ago",
  },
  {
    icon: "file",
    iconBg: "bg-[#fef8e6]",
    title: "Updated Company Policy",
    description: "Modified section 3.2",
    timeAgo: "2 Hours ago",
  },
];

export const DocumentStatisticsSection = (): JSX.Element => {
  return (
    <Card className="w-full shadow-[0px_4px_16px_#eae2fd] rounded-[10px]">
      <CardHeader className="pb-0 pt-[33px] px-6">
        <CardTitle className="text-lg font-medium text-[#383839] font-['Inter',Helvetica]">
          Your Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 px-6 pb-10 pt-4">
        {recentActivities.map((activity, index) => (
          <div key={index} className="flex items-start gap-2.5">
            <div
              className={`flex items-center justify-center p-2.5 ${activity.iconBg} rounded-[42px] w-8 h-8`}
            >
              {activity.icon === "file" ? (
                <FileIcon className="w-3.5 h-3.5" />
              ) : (
                <DollarSignIcon className="w-3.5 h-3.5" />
              )}
            </div>

            <div className="flex flex-col items-start gap-2">
              <div className="flex flex-col items-start gap-1 w-full">
                <div className="font-medium text-[#383839] text-base font-['Inter',Helvetica]">
                  {activity.title}
                </div>
                <div className="font-normal text-[#383839a6] text-sm font-['Inter',Helvetica]">
                  {activity.description}
                </div>
              </div>
              <div className="font-normal text-[#38383980] text-xs font-['Inter',Helvetica]">
                {activity.timeAgo}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
