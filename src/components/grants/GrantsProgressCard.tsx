import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';
import { useGrantStatistics } from '@/hooks/grants/useGrantStatistics';
import { Skeleton } from '@/components/ui/skeleton';

export const GrantsProgressCard = () => {
  const { statistics, loading } = useGrantStatistics();

  if (loading) {
    return (
      <Card className="hover:shadow-xl transition-all duration-300 shadow-lg border border-purple-200 h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-center flex items-center justify-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            Portfolio Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-8" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-8" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
          <div className="text-center pt-2">
            <Skeleton className="h-6 w-16 mx-auto mb-1" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: amount >= 1000000 ? 'compact' : 'standard',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 shadow-lg border border-purple-200 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-center flex items-center justify-center gap-2">
          <TrendingUp className="h-4 w-4 text-purple-600" />
          Portfolio Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Disbursed Funds */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Disbursed</span>
            <span className="font-medium">{statistics.disbursement_rate}%</span>
          </div>
          <Progress value={statistics.disbursement_rate} className="h-2" />
          <div className="text-xs text-muted-foreground mt-1">
            {formatCurrency((statistics.total_value * statistics.disbursement_rate) / 100)} disbursed
          </div>
        </div>

        {/* Compliance Rate */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Compliance</span>
            <span className="font-medium">{statistics.compliance_rate}%</span>
          </div>
          <Progress value={statistics.compliance_rate} className="h-2" />
          <div className="text-xs text-muted-foreground mt-1">
            Requirements completed
          </div>
        </div>

        {/* Burn Rate */}
        <div className="text-center pt-2 border-t">
          <div className="text-2xl font-bold text-purple-600">{statistics.burn_rate}%</div>
          <div className="text-xs text-muted-foreground">Burn Rate</div>
        </div>
      </CardContent>
    </Card>
  );
};