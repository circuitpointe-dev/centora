// src/components/users/super-admin/SuperAdminTable.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, UserX, CheckCircle2, MoreVertical, ScrollText } from "lucide-react";
import type { SuperAdminUser } from "./types";
import { UserStatusPill } from "./UserStatusPill";

const BRAND_PURPLE_OUTLINE =
  "border border-purple-600 text-purple-600 hover:bg-purple-50 active:bg-purple-100";

const formatLastLogin = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

type Props = {
  users: SuperAdminUser[];
  selected: Record<string, boolean>;
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAllOnPage: (checked: boolean) => void;

  onEdit: (u: SuperAdminUser) => void;
  onSuspend: (id: string) => void;
  onActivate: (id: string) => void;

  onView: (u: SuperAdminUser) => void;
  onResetPassword: (u: SuperAdminUser) => void;
  onViewLogs: (u: SuperAdminUser) => void; // <— NEW

  stickyActions?: boolean;
};

export const SuperAdminTable: React.FC<Props> = ({
  users,
  selected,
  onToggleRow,
  onToggleAllOnPage,
  onEdit,
  onSuspend,
  onActivate,
  onView,
  onResetPassword,
  onViewLogs,
  stickyActions = true,
}) => {
  const allOnPageChecked = users.length > 0 && users.every((u) => selected[u.id]);

  return (
    <div className="rounded-xl border bg-white overflow-x-auto">
      <table className="min-w-[1100px] w-full table-fixed">
        <thead className="bg-muted/40 text-left">
          <tr className="text-sm">
            <th className="p-3 w-10">
              <Checkbox checked={allOnPageChecked} onCheckedChange={(v) => onToggleAllOnPage(Boolean(v))} />
            </th>
            <th className="p-3 w-[180px]">Name</th>
            <th className="p-3 w-[240px]">Email</th>
            <th className="p-3 w-[140px]">Role</th>
            <th className="p-3 w-[160px]">Last Login</th>
            <th className="p-3 w-[110px]">Status</th>
            <th className={`p-3 w-[240px] ${stickyActions ? "sticky right-0 bg-white" : ""}`} style={stickyActions ? { boxShadow: "inset 1px 0 0 rgba(0,0,0,0.06)" } : undefined}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t text-sm">
              <td className="p-3">
                <Checkbox checked={!!selected[u.id]} onCheckedChange={(v) => onToggleRow(u.id, Boolean(v))} />
              </td>
              <td className="p-3 truncate">{u.fullName}</td>
              <td className="p-3 text-muted-foreground truncate">{u.email}</td>
              <td className="p-3"><span className="rounded-md border bg-muted/30 px-2 py-0.5 text-[11px]">{u.role}</span></td>
              <td className="p-3 whitespace-nowrap">{formatLastLogin(u.lastLoginAt)}</td>
              <td className="p-3"><UserStatusPill status={u.status} /></td>
              <td className={`p-3 ${stickyActions ? "sticky right-0 bg-white" : ""}`} style={stickyActions ? { boxShadow: "inset 1px 0 0 rgba(0,0,0,0.06)" } : undefined}>
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" size="sm" className={`${BRAND_PURPLE_OUTLINE} h-8 px-2.5 text-xs`} onClick={() => onEdit(u)}>
                    <Edit className="mr-1 h-4 w-4" /> Edit
                  </Button>

                  {u.status === "active" ? (
                    <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs border border-amber-600 text-amber-700 hover:bg-amber-50" onClick={() => onSuspend(u.id)}>
                      <UserX className="mr-1 h-4 w-4" /> Suspend
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className={`${BRAND_PURPLE_OUTLINE} h-8 px-2.5 text-xs`} onClick={() => onActivate(u.id)}>
                      <CheckCircle2 className="mr-1 h-4 w-4" /> Activate
                    </Button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(u)}>View</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onResetPassword(u)}>Reset Password</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onViewLogs(u)}>
                        <ScrollText className="mr-2 h-4 w-4" />
                        View Logs
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td colSpan={7} className="p-10 text-center text-sm text-muted-foreground">
                No Users Found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
