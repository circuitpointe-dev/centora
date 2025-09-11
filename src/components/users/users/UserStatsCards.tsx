// src/components/users/UserStatsCards.tsx
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserX, UserMinus, UserPlus2 } from "lucide-react";
import { useUserStats } from "@/hooks/useUserStats";

const StatCard: React.FC<{
  icon: React.ReactNode;
  value: number | string;
  label: string;
  bg?: string;
}> = ({ icon, value, label, bg }) => (
  <Card className="border rounded-lg">
    <CardContent className="p-5 flex flex-col items-center gap-3">
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${bg || "bg-gray-100"}`}>
        {icon}
      </div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </CardContent>
  </Card>
);

export const UserStatsCards: React.FC = () => {
  const { data: stats, isLoading } = useUserStats();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border rounded-lg">
            <CardContent className="p-5 flex flex-col items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-100 animate-pulse" />
              <div className="h-6 w-8 bg-gray-100 animate-pulse rounded" />
              <div className="h-4 w-20 bg-gray-100 animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const active = Number(stats?.active_users) || 0;
  const inactive = Number(stats?.inactive_users) || 0;
  const deactivated = Number(stats?.deactivated_users) || 0;
  const pending = Number(stats?.pending_invitations) || 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        icon={<Users className="h-5 w-5 text-green-600" />}
        value={active}
        label="Active Users"
        bg="bg-green-50"
      />
      <StatCard
        icon={<UserX className="h-5 w-5 text-orange-600" />}
        value={inactive}
        label="Inactive Users"
        bg="bg-orange-50"
      />
      <StatCard
        icon={<UserMinus className="h-5 w-5 text-red-600" />}
        value={deactivated}
        label="Deactivated Users"
        bg="bg-red-50"
      />
      <StatCard
        icon={<UserPlus2 className="h-5 w-5 text-blue-600" />}
        value={pending}
        label="Pending Invitations"
        bg="bg-blue-50"
      />
    </div>
  );
};
