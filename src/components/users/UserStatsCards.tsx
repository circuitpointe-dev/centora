import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, UserX, UserMinus, UserPlus, Loader2 } from 'lucide-react';
import { useUserStats } from '@/hooks/useUserStats';

export const UserStatsCards: React.FC = () => {
  const { data: stats, isLoading, error } = useUserStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <div className="space-y-1">
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load user statistics</p>
      </div>
    );
  }

  const userStats = [
    {
      icon: <Users className="w-5 h-5 text-green-600" />,
      iconBg: "bg-green-50",
      count: stats?.active_users?.toString() || "0",
      label: "Active Users",
    },
    {
      icon: <UserX className="w-5 h-5 text-orange-500" />,
      iconBg: "bg-orange-50",
      count: stats?.inactive_users?.toString() || "0",
      label: "Inactive Users",
    },
    {
      icon: <UserMinus className="w-5 h-5 text-red-500" />,
      iconBg: "bg-red-50",
      count: stats?.deactivated_users?.toString() || "0",
      label: "Deactivated Users",
    },
    {
      icon: <UserPlus className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-50",
      count: stats?.pending_invitations?.toString() || "0",
      label: "Pending Invitations",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {userStats.map((stat, index) => (
        <Card
          key={index}
          className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-lg"
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div
                className={`flex w-12 h-12 items-center justify-center rounded-lg ${stat.iconBg}`}
              >
                {stat.icon}
              </div>

              <div className="space-y-1">
                <div className="text-2xl font-semibold text-gray-900">
                  {stat.count}
                </div>
                <div className="text-sm text-gray-500 leading-tight">
                  {stat.label}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};