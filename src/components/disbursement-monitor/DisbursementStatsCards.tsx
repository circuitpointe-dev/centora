import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, TrendingDown, AlertTriangle, Clock, Loader2 } from 'lucide-react';
import { useGrantDisbursements } from '@/hooks/grants/useGrantDisbursements';

interface StatCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

export const DisbursementStatsCards = () => {
  const { disbursements, loading } = useGrantDisbursements();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="p-6">
            <CardContent className="p-0 flex items-center justify-center h-20">
              <Loader2 className="h-6 w-6 animate-spin" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate stats from real data
  const currentDate = new Date();
  const fourteenDaysFromNow = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000);

  const totalDisbursed = disbursements
    .filter(d => d.status === 'released')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalGrantValue = disbursements.reduce((sum, d) => sum + (d.amount || 0), 0);
  const fundsRemaining = totalGrantValue - totalDisbursed;

  const delayedDisbursements = disbursements.filter(d => 
    d.status === 'pending' && new Date(d.due_date) < currentDate
  ).length;

  const upcomingDisbursements = disbursements.filter(d => 
    d.status === 'pending' && 
    new Date(d.due_date) >= currentDate && 
    new Date(d.due_date) <= fourteenDaysFromNow
  ).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: amount >= 1000000 ? 'compact' : 'standard',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats: StatCard[] = [
    {
      title: 'Total Disbursed Year Till Date',
      value: formatCurrency(totalDisbursed),
      icon: <DollarSign className="h-5 w-5" />,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Funds Remaining To Disburse',
      value: formatCurrency(fundsRemaining),
      icon: <TrendingDown className="h-5 w-5" />,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Delayed Disbursements',
      value: delayedDisbursements.toString(),
      icon: <AlertTriangle className="h-5 w-5" />,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'Upcoming Disbursements (Next 14 Days)',
      value: upcomingDisbursements.toString(),
      icon: <Clock className="h-5 w-5" />,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <CardContent className="p-0">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <div className={stat.iconColor}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};