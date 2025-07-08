import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCard {
  title: string;
  value: string;
  icon: string;
  bgColor: string;
  textColor: string;
}

interface AcknowledgedStatCardsProps {
  statistics: StatCard[];
}

export const AcknowledgedStatCards: React.FC<AcknowledgedStatCardsProps> = ({ statistics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statistics.map((stat, index) => (
        <Card key={index} className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-4', stat.bgColor)}>
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};