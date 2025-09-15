import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';
import { useGrantStatistics } from '@/hooks/grants/useGrantStatistics';
import { Skeleton } from '@/components/ui/skeleton';

export const ActiveGrantsStatCards = () => {
  const { statistics, loading } = useGrantStatistics();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </Card>
        ))}
      </div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card className="hover:shadow-xl transition-all duration-300 shadow-lg border border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Grants</CardTitle>
          <CheckCircle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{statistics.active_grants}</div>
          <p className="text-xs text-muted-foreground">Currently running</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-xl transition-all duration-300 shadow-lg border border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(statistics.total_value)}</div>
          <p className="text-xs text-muted-foreground">Total allocated</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-xl transition-all duration-300 shadow-lg border border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Disbursement Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{statistics.disbursement_rate}%</div>
          <p className="text-xs text-muted-foreground">Funds released</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-xl transition-all duration-300 shadow-lg border border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
          <Award className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{statistics.compliance_rate}%</div>
          <p className="text-xs text-muted-foreground">Requirements met</p>
        </CardContent>
      </Card>
    </div>
  );
};