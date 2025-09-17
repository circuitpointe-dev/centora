import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, FileCheck, DollarSign } from 'lucide-react';
import { useGrantStatistics } from '@/hooks/grants/useGrantStatistics';
import { useNGOReportStatistics } from '@/hooks/grants/useNGOReportStatistics';
import { Skeleton } from '@/components/ui/skeleton';

export const NGOStatisticsCards = () => {
  const { statistics, loading: statsLoading } = useGrantStatistics();
  const { reportsData, loading: reportsLoading } = useNGOReportStatistics();
  
  const loading = statsLoading || reportsLoading;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: amount >= 1000000 ? 'compact' : 'standard',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-32" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="hover:shadow-xl transition-all duration-300 shadow-lg border border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Grants</CardTitle>
          <Award className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{statistics.active_grants}</div>
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
          <div className="text-2xl font-bold text-orange-600">{reportsData.totalDue}</div>
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
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(statistics.total_value)}</div>
          <p className="text-xs text-muted-foreground">
            This year
          </p>
        </CardContent>
      </Card>
    </div>
  );
};