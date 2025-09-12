
import {
  FileTextIcon,
  PenSquareIcon,
  ShieldIcon,
  TimerIcon,
} from "lucide-react";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Loader2 } from "lucide-react";

export const StatisticsCardSection = (): JSX.Element => {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-20">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const documentStats = [
    {
      icon: <FileTextIcon className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-50",
      count: stats?.totalDocuments?.toString() || "0",
      label: "Total Documents Uploaded",
    },
    {
      icon: <PenSquareIcon className="w-5 h-5 text-orange-500" />,
      iconBg: "bg-orange-50", 
      count: stats?.signatureRequestsOverdue?.toString() || "0",
      label: "Signature Request Overdue",
    },
    {
      icon: <TimerIcon className="w-5 h-5 text-red-500" />,
      iconBg: "bg-red-50",
      count: stats?.documentsExpiringSoon?.toString() || "0", 
      label: "Documents Expiring in 30 Days",
    },
    {
      icon: <ShieldIcon className="w-5 h-5 text-green-500" />,
      iconBg: "bg-green-50",
      count: stats?.unacknowledgedPolicies?.toString() || "0",
      label: "Unacknowledged Policies",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {documentStats.map((stat, index) => (
        <Card
          key={index}
          className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-lg"
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div
                className={`flex w-12 h-12 items-center justify-center rounded-lg ${stat.iconBg}`}
              >
                {stat.icon}
              </div>

              <div className="space-y-1">
                <div className="text-2xl font-semibold text-gray-900">
                  {stat.count}
                </div>
                <div className="text-sm text-gray-500 leading-tight">
                  {stat.label}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
