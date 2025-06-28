
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, CheckCircle, Archive, DollarSign, FileCheck, AlertCircle } from 'lucide-react';
import { GrantsProgressCard } from './GrantsProgressCard';

export const GrantsStatisticsCards = () => {
  return (
    <div className="space-y-6">
      {/* Top Row - 4 Equal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow border border-orange-200">
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

        <Card className="hover:shadow-lg transition-shadow border border-green-200">
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

        <Card className="hover:shadow-lg transition-shadow border border-gray-200">
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

        <Card className="hover:shadow-lg transition-shadow border border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disbursement</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">$2.4M</div>
            <p className="text-xs text-muted-foreground">
              Total disbursed amount
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - 3 Cards (one spanning 2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow border border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Due</CardTitle>
            <FileCheck className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">12</div>
            <p className="text-xs text-muted-foreground">
              Pending submissions
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
            <AlertCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">94%</div>
            <p className="text-xs text-muted-foreground">
              Portfolio average
            </p>
          </CardContent>
        </Card>

        {/* Progress Card - Spans 2 columns equivalent space */}
        <div className="lg:col-span-1">
          <GrantsProgressCard />
        </div>
      </div>
    </div>
  );
};
