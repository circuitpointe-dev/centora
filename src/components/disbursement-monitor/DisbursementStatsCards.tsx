import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, TrendingDown, AlertTriangle, Clock } from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

export const DisbursementStatsCards = () => {
  const stats: StatCard[] = [
    {
      title: 'Total Disbursed Year Till Date',
      value: '$2,000,000',
      icon: <DollarSign className="h-5 w-5" />,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Funds Remaining To Disburse',
      value: '$5,200,000',
      icon: <TrendingDown className="h-5 w-5" />,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Delayed Disbursements',
      value: '9',
      icon: <AlertTriangle className="h-5 w-5" />,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'Upcoming Disbursements (Next 14 Days)',
      value: '6',
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