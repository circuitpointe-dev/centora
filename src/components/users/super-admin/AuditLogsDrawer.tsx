// src/components/users/super-admin/AuditLogsDrawer.tsx
import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Clock, ListFilter } from "lucide-react";
import type { AuditAction, AuditLog, SuperAdminUser } from "./types";

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

const ALL_ACTIONS = Object.keys(ACTION_LABEL) as AuditAction[];

function formatAgo(iso: string) {
  const d = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - d);
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleString();
}

function LogRow({ log }: { log: AuditLog }) {
  return (
    <div className="py-3">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          {ACTION_LABEL[log.action]}
        </Badge>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {formatAgo(log.at)}
        </div>
      </div>

      <div className="mt-1 text-sm">
        <span className="font-medium">{log.actorName}</span>{" "}
        <span className="text-muted-foreground">({log.actorEmail})</span>
        {log.targetUserName && (
          <>
            {" "}
            → <span className="font-medium">{log.targetUserName}</span>{" "}
            <span className="text-muted-foreground">
              ({log.targetUserEmail})
            </span>
          </>
        )}
        {log.ip ? (
          <span className="text-muted-foreground"> · {log.ip}</span>
        ) : null}
      </div>

      {log.metadata ? (
        <div className="mt-1 text-xs text-muted-foreground">
          {log.metadata.from && log.metadata.to && (
            <div>
              Changed From <b>{log.metadata.from}</b> To{" "}
              <b>{log.metadata.to}</b>
            </div>
          )}
          {Array.isArray(log.metadata.fields) && (
            <div>Updated Fields: {log.metadata.fields.join(", ")}</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function AuditLogsDrawer({
  open,
  onOpenChange,
  logs,
  focusUser,
  size = "lg",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  logs: AuditLog[];
  focusUser?: SuperAdminUser | null;
  /** "md" | "lg" | "xl" — default "lg" */
  size?: "md" | "lg" | "xl";
}) {
  const width =
    size === "xl"
      ? "w-[1000px] sm:w-[1120px]"
      : size === "lg"
      ? "w-[840px] sm:w-[960px]"
      : "w-[560px] sm:w-[600px]";

  const [query, setQuery] = React.useState("");
  const [actions, setActions] = React.useState<AuditAction[]>([]);
  const [onlyThisUser, setOnlyThisUser] = React.useState(!!focusUser);

  React.useEffect(() => {
    setOnlyThisUser(!!focusUser);
  }, [focusUser, open]);

  const toggleAction = (a: AuditAction, checked: boolean) => {
    const next = new Set(actions);
    checked ? next.add(a) : next.delete(a);
    setActions(Array.from(next) as AuditAction[]);
  };

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return logs.filter((l) => {
      const inActions = actions.length ? actions.includes(l.action) : true;
      const text = [
        l.actorName,
        l.actorEmail,
        l.targetUserName,
        l.targetUserEmail,
        ACTION_LABEL[l.action],
        l.ip,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesQuery = !q || text.includes(q);
      const matchesUser =
        !onlyThisUser ||
        (focusUser
          ? l.targetUserId === focusUser.id || l.actorEmail === focusUser.email
          : true);
      return inActions && matchesQuery && matchesUser;
    });
  }, [logs, actions, query, onlyThisUser, focusUser]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={`p-0 ${width}`}>
        {/* Header & Filters */}
        <div className="p-6 border-b">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <span>Audit Logs</span>
              <Badge variant="secondary">{filtered.length}</Badge>
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[260px]">
              <ListFilter className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9 w-full"
                placeholder="Search Logs (Actor, Target, IP, Action)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {focusUser && (
              <label className="ml-auto flex items-center gap-2 text-sm">
                <Checkbox
                  checked={onlyThisUser}
                  onCheckedChange={(v) => setOnlyThisUser(Boolean(v))}
                />
                Only This User
              </label>
            )}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2">
  {ALL_ACTIONS.map((a) => (
    <label
      key={a}
      className="flex w-full items-center gap-2 rounded border px-3 py-2 text-sm"
    >
      <Checkbox
        checked={actions.includes(a)}
        onCheckedChange={(v) => toggleAction(a, Boolean(v))}
      />
      <span>{ACTION_LABEL[a]}</span>
    </label>
  ))}
</div>

          <div className="mt-3 flex items-center justify-end gap-2">
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

        {/* List */}
        <ScrollArea className="h-[calc(100vh-240px)]">
          <div className="p-6">
            {filtered.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No Logs Found.
              </div>
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
      </SheetContent>
    </Sheet>
  );
}
