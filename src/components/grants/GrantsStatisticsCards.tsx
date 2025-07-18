
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, CheckCircle, Archive, DollarSign, FileCheck, AlertCircle } from 'lucide-react';
import { GrantsProgressCard } from './GrantsProgressCard';

export const GrantsStatisticsCards = () => {
  // Ring chart component for percentages
  const RingChart = ({ percentage, color, title }: { percentage: number; color: string; title: string }) => {
    const circumference = 2 * Math.PI * 40;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={color}
              strokeWidth="8"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold" style={{ color }}>{percentage}%</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">{title}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Row - 4 Equal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-xl transition-all duration-300 shadow-lg border border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Grants</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">45</div>
            <p className="text-xs text-muted-foreground">
              Across all programs
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 shadow-lg border border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Grants</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">18</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 shadow-lg border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Grants</CardTitle>
            <Archive className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">27</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 shadow-lg border border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">$2.4M</div>
            <p className="text-xs text-muted-foreground">
              Total allocated
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Ring Charts and Portfolio Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-xl transition-all duration-300 shadow-lg border border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-center">Disbursement Rate (%)</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <RingChart percentage={85} color="#8B5CF6" title="" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 shadow-lg border border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-center">Compliance (%)</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <RingChart percentage={65} color="#3B82F6" title="" />
          </CardContent>
        </Card>

        {/* Progress Card - Spans 1 column */}
        <div className="lg:col-span-1">
          <GrantsProgressCard />
        </div>
      </div>
    </div>
  );
};
