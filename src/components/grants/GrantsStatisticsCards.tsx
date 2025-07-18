
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, CheckCircle, Archive, DollarSign, FileCheck, AlertCircle } from 'lucide-react';
import { GrantsProgressCard } from './GrantsProgressCard';

// Ring Progress Component
const RingProgress = ({ percentage, color, size = 120 }: { percentage: number; color: string; size?: number }) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgb(229 231 235)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>
          {percentage}%
        </span>
      </div>
    </div>
  );
};

export const GrantsStatisticsCards = () => {
  return (
    <div className="space-y-6">
      {/* Top Row - 3 Equal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-shadow duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Grants</CardTitle>
            <Award className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">56</div>
            <p className="text-xs text-blue-600/70 mt-1">
              Across all programs
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-shadow duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Active Grants</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">32</div>
            <p className="text-xs text-green-600/70 mt-1">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-shadow duration-300 border-0 bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Closed Grants</CardTitle>
            <Archive className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">24</div>
            <p className="text-xs text-red-600/70 mt-1">
              Successfully completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Ring Progress Cards and Burn Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Disbursement Rate */}
        <Card className="shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-shadow duration-300 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Disbursement Rate (%)</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center pb-6">
            <RingProgress percentage={85} color="#8B5CF6" size={100} />
          </CardContent>
        </Card>

        {/* Compliance */}
        <Card className="shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-shadow duration-300 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Compliance (%)</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center pb-6">
            <RingProgress percentage={65} color="#3B82F6" size={100} />
          </CardContent>
        </Card>

        {/* Burn Rate */}
        <Card className="shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-shadow duration-300 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Burn Rate</CardTitle>
            <p className="text-xs text-gray-500">(Disbursed vs Spent)</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600">Disbursed Funds - $7,500,000</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600">Spent Funds - $7,000,000</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-red-500 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-gray-600">Total burn rate (%)</span>
              <span className="text-lg font-bold text-gray-800">93%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Third Row - Portfolio Progress */}
      <div className="grid grid-cols-1">
        <GrantsProgressCard />
      </div>
    </div>
  );
};
