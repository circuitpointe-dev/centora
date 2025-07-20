import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { disbursementsData } from "../data/disbursementsData";
import { complianceData } from "../data/complianceData";

interface GrantStatsCardsProps {
  grantId: number;
}

export const GrantStatsCards: React.FC<GrantStatsCardsProps> = ({ grantId }) => {
  // Calculate disbursement rate for this grant
  const grantDisbursements = disbursementsData.filter(d => d.grantId === grantId);
  const totalDisbursements = grantDisbursements.length;
  const releasedDisbursements = grantDisbursements.filter(d => d.status === 'Released').length;
  const disbursementRate = totalDisbursements > 0 ? Math.round((releasedDisbursements / totalDisbursements) * 100) : 0;

  // Calculate compliance rate for this grant
  const grantCompliance = complianceData.filter(c => c.grantId === grantId);
  const totalCompliance = grantCompliance.length;
  const completedCompliance = grantCompliance.filter(c => c.status === 'Completed').length;
  const complianceRate = totalCompliance > 0 ? Math.round((completedCompliance / totalCompliance) * 100) : 0;

  // Portfolio progress data for this grant
  const portfolioData = [
    { 
      label: "Disbursed Funds", 
      value: disbursementRate, 
      color: "bg-blue-500", 
      width: `${disbursementRate}%`, 
      amount: "$750,000",
      description: "Released over allocated"
    },
    { 
      label: "Spent Funds", 
      value: Math.min(disbursementRate + 10, 100), 
      color: "bg-red-500", 
      width: `${Math.min(disbursementRate + 10, 100)}%`, 
      amount: "$700,000",
      description: "Expended over released"
    },
  ];

  const burnRate = Math.min(disbursementRate + 10, 100);

  const stats = [
    {
      title: "Disbursement Rate (%)",
      percentage: disbursementRate,
      color: "text-purple-600"
    },
    {
      title: "Compliance (%)",
      percentage: complianceRate,
      color: "text-blue-600"
    }
  ];

  const CircularProgress = ({ percentage, color }: { percentage: number; color: string }) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="25"
            cy="25"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={color}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-semibold ${color}`}>
            {percentage}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="rounded-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-200 flex-shrink-0">
          <CardContent className="p-4 h-full">
            <div className="flex items-center justify-center gap-4 h-full">
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </h3>
              </div>
              <CircularProgress 
                percentage={stat.percentage} 
                color={stat.color}
              />
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Portfolio Progress Card */}
      <Card className="rounded-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-violet-200 flex-1">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0 mr-4">
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Burn rate {burnRate}%
              </h3>
            </div>
            <div className="flex-1 space-y-2">
              {/* Disbursed Funds Progress */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">{portfolioData[0].label} - {portfolioData[0].amount}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div
                    className={`${portfolioData[0].color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: portfolioData[0].width }}
                  />
                </div>
              </div>

              {/* Spent Funds Progress */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">{portfolioData[1].label} - {portfolioData[1].amount}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div
                    className={`${portfolioData[1].color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: portfolioData[1].width }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};