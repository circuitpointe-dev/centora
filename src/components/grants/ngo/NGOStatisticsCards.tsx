import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, FileCheck, DollarSign } from 'lucide-react';

export const NGOStatisticsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="hover:shadow-xl transition-all duration-300 shadow-lg border border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Grants</CardTitle>
          <Award className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">8</div>
          <p className="text-xs text-muted-foreground">
            Currently running
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-xl transition-all duration-300 shadow-lg border border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reports Due</CardTitle>
          <FileCheck className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">5</div>
          <p className="text-xs text-muted-foreground">
            Due this month
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-xl transition-all duration-300 shadow-lg border border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Funds Received</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">$1.2M</div>
          <p className="text-xs text-muted-foreground">
            This year
          </p>
        </CardContent>
      </Card>
    </div>
  );
};