import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Send, CheckCircle, AlertCircle } from 'lucide-react';

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

export const ReportingStatsCards = () => {
  const stats: StatCard[] = [
    {
      title: 'Total reports',
      value: 38,
      icon: <FileText className="h-5 w-5" />,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Reports submitted',
      value: 5,
      icon: <Send className="h-5 w-5" />,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Reports reviewed',
      value: 3,
      icon: <CheckCircle className="h-5 w-5" />,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'Reports due',
      value: 6,
      icon: <AlertCircle className="h-5 w-5" />,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <div className={stat.iconColor}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};