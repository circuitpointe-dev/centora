// src/components/users/super-admin/AuditLogsModal.tsx
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, ListFilter } from "lucide-react";
import type { AuditAction, AuditLog, SuperAdminUser } from "./types";
import { AuditActionMultiSelect, makeActionOptions } from "./AuditActionMultiSelect";

const BRAND_PURPLE = "bg-purple-600 hover:bg-purple-700 active:bg-purple-800";

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
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleString();
}

function LogRow({ log }: { log: AuditLog }) {
  return (
    <div className="py-3">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          {ACTION_LABEL[log.action]}
        </Badge>
        <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {formatAgo(log.at)}
        </div>
      </div>

      <div className="mt-1 text-sm">
        <span className="font-medium">{log.actorName}</span>{" "}
        <span className="text-muted-foreground">({log.actorEmail})</span>
        {log.targetUserName && (
          <>
            {" "}
            → <span className="font-medium">{log.targetUserName}</span>{" "}
            <span className="text-muted-foreground">({log.targetUserEmail})</span>
          </>
        )}
        {log.ip ? <span className="text-muted-foreground"> · {log.ip}</span> : null}
      </div>

      {log.metadata ? (
        <div className="mt-1 text-xs text-muted-foreground">
          {"from" in log.metadata && "to" in log.metadata && (
            <div>
              Changed From <b>{(log.metadata as any).from}</b> To{" "}
              <b>{(log.metadata as any).to}</b>
            </div>
          )}
          {Array.isArray((log.metadata as any).fields) && (
            <div>Updated Fields: {(log.metadata as any).fields.join(", ")}</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function AuditLogsModal({
  open,
  onOpenChange,
  logs,
  focusUser,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  logs: AuditLog[];
  focusUser?: SuperAdminUser | null;
}) {
  const [query, setQuery] = React.useState("");
  const [actions, setActions] = React.useState<AuditAction[]>([]);
  const [onlyThisUser, setOnlyThisUser] = React.useState(!!focusUser);

  React.useEffect(() => {
    setOnlyThisUser(!!focusUser);
  }, [focusUser, open]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return logs.filter((l) => {
      const inActions = actions.length ? actions.includes(l.action) : true;
      const text = [l.actorName, l.actorEmail, l.targetUserName, l.targetUserEmail, ACTION_LABEL[l.action], l.ip]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesQuery = !q || text.includes(q);
      const matchesUser =
        !onlyThisUser ||
        (focusUser ? l.targetUserId === focusUser.id || l.actorEmail === focusUser.email : true);
      return inActions && matchesQuery && matchesUser;
    });
  }, [logs, actions, query, onlyThisUser, focusUser]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] w-full p-0">
        <div className="p-6 border-b">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Audit Logs</span>
              <Badge variant="secondary">{filtered.length}</Badge>
            </DialogTitle>
            <DialogDescription>Search And Filter Activities Across Super Admin Users.</DialogDescription>
          </DialogHeader>
        </div>

        {/* Two-column layout, centered modal */}
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Filters */}
          <div className="md:col-span-4 p-6 border-r space-y-4">
            <div className="relative">
              <ListFilter className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search Actor, Target, IP, Action..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {focusUser && (
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={onlyThisUser}
                  onCheckedChange={(v) => setOnlyThisUser(Boolean(v))}
                />
                Only This User
              </label>
            )}

            {/* NEW: Dropdown multi-select for actions */}
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Actions
              </div>
              <AuditActionMultiSelect
                value={actions}
                onChange={setActions}
                options={makeActionOptions()}
                placeholder="Filter By Actions"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setActions([]);
                  setQuery("");
                  setOnlyThisUser(!!focusUser);
                }}
              >
                Clear
              </Button>
              <Button type="button" className={BRAND_PURPLE}>
                Export CSV
              </Button>
            </div>
          </div>

          {/* Logs list */}
          <div className="md:col-span-8">
            <ScrollArea className="h-[70vh]">
              <div className="p-6">
                {filtered.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No Logs Found.</div>
                ) : (
                  filtered
                    .sort((a, b) => +new Date(b.at) - +new Date(a.at))
                    .map((log) => (
                      <React.Fragment key={log.id}>
                        <LogRow log={log} />
                        <Separator />
                      </React.Fragment>
                    ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
