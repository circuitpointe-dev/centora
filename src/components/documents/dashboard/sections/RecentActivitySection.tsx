
import { DollarSignIcon, FileIcon } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Activity data for mapping
const recentActivities = [
  {
    icon: <FileIcon className="w-4 h-4" />,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600",
    title: "Updated Company Policy",
    description: "Modified section 3.2",
    timeAgo: "2 Hours ago",
  },
  {
    icon: <DollarSignIcon className="w-4 h-4" />,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    title: "Finance Report",
    description: "Signed Q3 finance report",
    timeAgo: "5 Hours ago",
  },
  {
    icon: <FileIcon className="w-4 h-4" />,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    title: "Contract Review",
    description: "Reviewed vendor agreement",
    timeAgo: "1 Day ago",
  },
];

export const RecentActivitySection = (): JSX.Element => {
  return (
    <Card className="border border-gray-200 shadow-sm rounded-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Your Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg ${activity.iconBg} flex-shrink-0`}
              >
                <span className={activity.iconColor}>
                  {activity.icon}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col space-y-1">
                  <div className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {activity.description}
                  </div>
                  <div className="text-xs text-gray-400">
                    {activity.timeAgo}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
