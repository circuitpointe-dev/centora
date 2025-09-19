import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, Clock, FileCheck, Loader2 } from 'lucide-react';
import { useGrantCompliance } from '@/hooks/grants/useGrantCompliance';

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

export const ComplianceStatsCards = () => {
  const { compliance, loading } = useGrantCompliance();

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
  const totalCompliance = compliance.length;
  
  // Group compliance by grant to calculate grant-level stats
  const grantCompliance = compliance.reduce((acc, item) => {
    if (!acc[item.grant_id]) {
      acc[item.grant_id] = { completed: 0, in_progress: 0, overdue: 0, total: 0 };
    }
    acc[item.grant_id].total++;
    acc[item.grant_id][item.status]++;
    return acc;
  }, {} as Record<string, { completed: number; in_progress: number; overdue: number; total: number }>);

  const grantsWithAllCompliance = Object.values(grantCompliance).filter(g => g.completed === g.total).length;
  const grantsWithPending = Object.values(grantCompliance).filter(g => g.in_progress > 0).length;
  const grantsWithOverdue = Object.values(grantCompliance).filter(g => g.overdue > 0).length;

  const stats: StatCard[] = [
    {
      title: 'Total Compliance Checklists',
      value: totalCompliance,
      icon: <FileCheck className="h-5 w-5" />,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Grants With All Compliance Met',
      value: grantsWithAllCompliance,
      icon: <CheckCircle className="h-5 w-5" />,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Grants With Pending Items',
      value: grantsWithPending,
      icon: <Clock className="h-5 w-5" />,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'Grants With Overdue Items',
      value: grantsWithOverdue,
      icon: <AlertTriangle className="h-5 w-5" />,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
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