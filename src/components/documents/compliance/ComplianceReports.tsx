import React, { useState } from "react";
import { User, Check, Clock, X, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CustomReportPage } from "./CustomReportPage";
import { usePolicyStats } from '@/hooks/usePolicyDocuments';

export const ComplianceReports = () => {
  const [showCustomReport, setShowCustomReport] = useState(false);
  
  // Fetch real compliance statistics from backend
  const { data: stats, isLoading, error } = usePolicyStats();

  if (showCustomReport) {
    return <CustomReportPage onBack={() => setShowCustomReport(false)} />;
  }

  const statCards = [
    {
      title: "Total Policies Assigned",
      value: stats?.totalEmployees?.toString() || "0",
      icon: User,
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      shadowColor: "shadow-blue-100/40",
    },
    {
      title: "Total Acknowledges",
      value: stats?.acknowledged?.toString() || "0",
      icon: Check,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
      shadowColor: "shadow-green-100/40",
    },
    {
      title: "Acknowledgement Rate",
      value: stats ? `${Math.round((stats.acknowledged / Math.max(stats.totalEmployees, 1)) * 100)}%` : "0%",
      icon: Clock,
      iconBgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      shadowColor: "shadow-yellow-100/40",
    },
    {
      title: "Policies Expired",
      value: stats?.exempt?.toString() || "0",
      icon: X,
      iconBgColor: "bg-red-100",
      iconColor: "text-red-600",
      shadowColor: "shadow-red-100/40",
    },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load compliance statistics</p>
          <p className="text-gray-500 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          {/* Enhanced Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card
              key={index}
              className={`
                bg-white h-40 
                shadow-md ${card.shadowColor} 
                transition-all duration-300 ease-in-out 
                hover:shadow-lg hover:${card.shadowColor.replace("/40", "/60")} 
                hover:-translate-y-1
                border-0
              `}
            >
              <CardContent className="p-6 h-full">
                <div className="flex flex-col items-center justify-center text-center h-full space-y-3">
                  <div
                    className={`p-3 rounded-full ${card.iconBgColor} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">
                    {card.value}
                  </p>
                  <p className="text-sm text-gray-600">{card.title}</p>
                </div>
              </CardContent>
            </Card>
          );
            })}
          </div>

          {/* Empty State */}
      <div className="bg-transparent p-12 rounded-lg">
        <div className="text-center">
          {/* Document with magnifying glass icon */}
          <div className="mx-auto mb-6 w-16 h-16 rounded-lg flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
              <circle
                cx="18"
                cy="18"
                r="3"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="m20.2 20.2 1.8 1.8"
              />
            </svg>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Custom Report Generated Yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Use filters to generate tailored compliance reports by policy, or
            timeframe. Perfect for audits, performance tracking, and internal
            reviews.
          </p>

          <Button 
            className="bg-violet-600 hover:bg-violet-700 text-white"
            onClick={() => setShowCustomReport(true)}
          >
            Generate Custom Report
          </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
