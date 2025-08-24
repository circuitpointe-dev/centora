// src/components/users/super-admin/SuperAdminStatsCards.tsx
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserX, UserPlus2 } from "lucide-react";

export interface SuperAdminStats {
  active: number;
  suspended: number;
  pending: number;
}

const StatCard: React.FC<{ icon: React.ReactNode; value: number | string; label: string; bg: string }> = ({
  icon,
  value,
  label,
  bg,
}) => (
  <Card className="border rounded-lg">
    <CardContent className="p-5 flex flex-col items-center gap-3">
      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${bg}`}>{icon}</div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </CardContent>
  </Card>
);

export const SuperAdminStatsCards: React.FC<{ stats: SuperAdminStats }> = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <StatCard icon={<Users className="h-5 w-5 text-purple-600" />} value={stats.active} label="Active Super Admin Users" bg="bg-purple-50" />
    <StatCard icon={<UserX className="h-5 w-5 text-red-600" />} value={stats.suspended} label="Suspended Super Admin Users" bg="bg-red-50" />
    <StatCard icon={<UserPlus2 className="h-5 w-5 text-yellow-600" />} value={stats.pending} label="Pending Invitations" bg="bg-yellow-50" />
  </div>
);
