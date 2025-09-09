import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, FolderKanban, Package, DollarSign, Users, AlertTriangle } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  subText: string;
  icon: React.ReactNode;
  iconBg: string;
  valueColor: string;
}

const StatCard = ({ title, value, change, changeType, subText, icon, iconBg, valueColor }: StatCardProps) => {
  const isPositive = changeType === 'increase';
  
  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-2xl font-bold ${valueColor}`}>{value}</span>
              <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{change}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">{subText}</p>
          </div>
          <div className={`flex w-12 h-12 items-center justify-center rounded-lg ml-4 ${iconBg}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const programmeStats = [
  {
    title: 'Active Projects',
    value: '24',
    change: '+4%',
    changeType: 'increase' as const,
    subText: 'from last month',
    icon: <FolderKanban className="w-5 h-5 text-blue-600" />,
    iconBg: 'bg-blue-50',
    valueColor: 'text-blue-600',
  },
  {
    title: 'Products in Pipeline',
    value: '156',
    change: '+12%',
    changeType: 'increase' as const,
    subText: 'from last month',
    icon: <Package className="w-5 h-5 text-green-600" />,
    iconBg: 'bg-green-50',
    valueColor: 'text-green-600',
  },
  {
    title: 'Total Budget',
    value: '$12.4M',
    change: '+6%',
    changeType: 'increase' as const,
    subText: 'of total budget',
    icon: <DollarSign className="w-5 h-5 text-purple-600" />,
    iconBg: 'bg-purple-50',
    valueColor: 'text-purple-600',
  },
  {
    title: 'Beneficiaries Reached',
    value: '456',
    change: '91%',
    changeType: 'increase' as const,
    subText: 'of target',
    icon: <Users className="w-5 h-5 text-orange-600" />,
    iconBg: 'bg-orange-50',
    valueColor: 'text-orange-600',
  },
  {
    title: 'Risk Summary',
    value: '6',
    change: '-9%',
    changeType: 'decrease' as const,
    subText: 'from last month',
    icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
    iconBg: 'bg-red-50',
    valueColor: 'text-red-600',
  },
];

export const ProgrammeStatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {programmeStats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};