// src/components/users/super-admin/UserStatusPill.tsx
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import type { SuperAdminUser } from "./types";

export const UserStatusPill: React.FC<{ status: SuperAdminUser["status"] }> = ({ status }) => {
  if (status === "active")
    return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Active</Badge>;
  if (status === "suspended")
    return <Badge className="bg-red-100 text-red-600 hover:bg-red-100">Suspended</Badge>;
  return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending</Badge>;
};
