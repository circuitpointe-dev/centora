// src/components/users/super-admin/SuperAdminDetailsSheet.tsx
import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, User, Clock } from "lucide-react";
import type { SuperAdminRole, SuperAdminUser, AuditLog, AuditAction } from "./types";
import { UserStatusPill } from "./UserStatusPill";

const BRAND_PURPLE = "bg-purple-600 hover:bg-purple-700 active:bg-purple-800";
const BRAND_PURPLE_OUTLINE = "border border-purple-600 text-purple-600 hover:bg-purple-50 active:bg-purple-100";

const ACTION_LABEL: Record<AuditAction, string> = {
  USER_CREATED: "User Created",
  USER_UPDATED: "User Updated",
  USER_SUSPENDED: "User Suspended",
  USER_ACTIVATED: "User Activated",
  PASSWORD_RESET_SENT: "Password Reset Sent",
  INVITE_SENT: "Invitation Sent",
  LOGIN: "Login",
  ROLE_CHANGED: "Role Changed",
  STATUS_CHANGED: "Status Changed",
};

function formatAgo(iso: string) {
  const diff = Math.max(0, Date.now() - +new Date(iso));
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function SuperAdminDetailsSheet({
  user,
  roles,
  mode,
  open,
  onOpenChange,
  onSave,
  userLogs = [],
  onOpenFullLogs,
}: {
  user: SuperAdminUser | null;
  roles: SuperAdminRole[];
  mode: "view" | "edit";
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (updated: SuperAdminUser) => void;
  /** Recent logs for this user (pre-filtered) */
  userLogs?: AuditLog[];
  /** Open the full Audit Logs drawer focused on this user */
  onOpenFullLogs?: (u: SuperAdminUser) => void;
}) {
  const [local, setLocal] = React.useState<SuperAdminUser | null>(user);
  const [editing, setEditing] = React.useState(mode === "edit");
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    setLocal(user);
    setEditing(mode === "edit");
    setSaved(false);
  }, [user, mode, open]);

  const canSave = !!local?.fullName?.trim() && !!local?.email?.trim() && !!local?.role && !!local?.status;

  const commitSave = () => {
    if (!local || !canSave) return;
    onSave(local);
    setSaved(true);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[460px] sm:w-[520px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {editing ? "Edit Super Admin" : "View Super Admin"}
          </SheetTitle>
        </SheetHeader>

        {!user ? (
          <div className="mt-6 text-sm text-muted-foreground">No User Selected.</div>
        ) : saved ? (
          <div className="mt-8 flex flex-col items-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            <div className="mt-3 text-lg font-semibold">Changes Saved</div>
            <div className="mt-1 text-center text-sm text-muted-foreground">
              <b>{local?.fullName}</b> Has Been Updated Successfully.
            </div>
            <Button className={`mt-6 ${BRAND_PURPLE}`} onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        ) : editing ? (
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={local?.fullName ?? ""} onChange={(e) => setLocal((u) => (u ? { ...u, fullName: e.target.value } : u))} placeholder="Enter Full Name" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={local?.email ?? ""} onChange={(e) => setLocal((u) => (u ? { ...u, email: e.target.value } : u))} placeholder="Enter Email" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={local?.role} onValueChange={(v) => setLocal((u) => (u ? { ...u, role: v as SuperAdminRole } : u))}>
                  <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={local?.status} onValueChange={(v) => setLocal((u) => (u ? { ...u, status: v as any } : u))}>
                  <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" className={BRAND_PURPLE_OUTLINE} onClick={() => setEditing(false)}>Cancel</Button>
              <Button className={BRAND_PURPLE} disabled={!canSave} onClick={commitSave}>Save Changes</Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {/* Basics */}
            <div>
              <div className="text-xs uppercase text-muted-foreground">Full Name</div>
              <div className="text-sm">{user.fullName}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">Email</div>
              <div className="text-sm">{user.email}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs uppercase text-muted-foreground">Role</div>
                <div className="text-sm">{user.role}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Status</div>
                <div className="mt-1"><UserStatusPill status={user.status} /></div>
              </div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">Last Login</div>
              <div className="text-sm">{new Date(user.lastLoginAt).toLocaleString()}</div>
            </div>

            <Separator />

            {/* Recent Activity (compact) */}
            <div>
              <div className="mb-2 text-sm font-semibold">Recent Activity</div>
              {userLogs.length === 0 ? (
                <div className="text-xs text-muted-foreground">No Recent Activity.</div>
              ) : (
                <div className="space-y-2">
                  {userLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="text-xs">
                      <span className="font-medium">{ACTION_LABEL[log.action]}</span>
                      <span className="text-muted-foreground"> · </span>
                      <span>{log.actorName}</span>
                      {log.actorEmail ? <span className="text-muted-foreground"> ({log.actorEmail})</span> : null}
                      <span className="text-muted-foreground"> · </span>
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {formatAgo(log.at)}</span>
                    </div>
                  ))}
                </div>
              )}

              {onOpenFullLogs && (
                <div className="mt-3">
                  <Button size="sm" className={BRAND_PURPLE} onClick={() => user && onOpenFullLogs(user)}>
                    View All Logs
                  </Button>
                </div>
              )}
            </div>

            <div className="pt-2">
              <Button className={BRAND_PURPLE} onClick={() => setEditing(true)}>Edit</Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
