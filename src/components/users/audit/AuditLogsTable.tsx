// src/components/users/audit/AuditLogsTable.tsx

import React, { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AuditFilterBar } from "./AuditFilterBar";
import type { AuditFilterState, AuditLog } from "./types";

type Props = {
  logs: AuditLog[];
};

const PAGE_SIZE = 10;

export const AuditLogsTable: React.FC<Props> = ({ logs }) => {
  const [filter, setFilter] = useState<AuditFilterState>({
    q: "",
    category: "All",
    users: [],
    organizations: [],
    actions: [],
  });

  const [page, setPage] = useState(1);

  const usersUniverse = useMemo(
    () => Array.from(new Set(logs.map((l) => l.user.name))).sort(),
    [logs]
  );
  const orgUniverse = useMemo(
    () => Array.from(new Set(logs.map((l) => l.organization))).sort(),
    [logs]
  );
  const actionsUniverse = useMemo(
    () => Array.from(new Set(logs.map((l) => l.event))).sort(),
    [logs]
  );

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      if (filter.category !== "All" && l.category !== filter.category) return false;

      if (filter.q) {
        const q = filter.q.toLowerCase();
        const hay = `${new Date(l.timestamp).toLocaleString()} ${l.user.name} ${l.organization} ${l.event} ${l.ip ?? ""} ${l.module ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      if (filter.users.length && !filter.users.includes(l.user.name)) return false;
      if (filter.organizations.length && !filter.organizations.includes(l.organization)) return false;
      if (filter.actions.length && !filter.actions.includes(l.event)) return false;

      if (filter.dateFrom && new Date(l.timestamp) < new Date(filter.dateFrom)) return false;
      if (filter.dateTo) {
        const to = new Date(filter.dateTo);
        to.setHours(23, 59, 59, 999);
        if (new Date(l.timestamp) > to) return false;
      }

      return true;
    });
  }, [logs, filter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const slice = filtered.slice(start, start + PAGE_SIZE);

  // Reset to first page when filter changes
  React.useEffect(() => setPage(1), [filter.q, filter.category, filter.users, filter.organizations, filter.actions, filter.dateFrom, filter.dateTo]);

  const onExport = () => {
    // simple CSV stub for now
    const header = ["Timestamp", "User", "Organization", "Event", "Module", "IP"];
    const rows = filtered.map((l) => [
      new Date(l.timestamp).toLocaleString(),
      l.user.name,
      l.organization,
      l.event,
      l.module ?? "",
      l.ip ?? "",
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit_logs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <AuditFilterBar
        filter={filter}
        setFilter={(fn) => setFilter((f) => fn(f))}
        onExport={onExport}
        actionsUniverse={actionsUniverse}
        usersUniverse={usersUniverse}
        orgUniverse={orgUniverse}
      />

      <div className="overflow-x-auto">
        <Table className="min-w-[1100px]">
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slice.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="whitespace-nowrap">{new Date(l.timestamp).toLocaleString()}</TableCell>
                <TableCell>
                  <div className="font-medium">{l.user.name}</div>
                  {l.user.role && <div className="text-xs text-zinc-500">{l.user.role}</div>}
                </TableCell>
                <TableCell>{l.organization}</TableCell>
                <TableCell>{l.event}</TableCell>
                <TableCell>{l.module}</TableCell>
                <TableCell>{l.ip}</TableCell>
              </TableRow>
            ))}
            {!slice.length && (
              <TableRow>
                <TableCell colSpan={6} className="h-28 text-center text-sm text-zinc-500">
                  No logs found for the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-600">
          Showing {total ? start + 1 : 0} to {Math.min(start + PAGE_SIZE, total)} of {total} logs
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
