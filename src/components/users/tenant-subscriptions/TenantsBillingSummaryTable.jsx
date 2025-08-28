// src/components/users/tenants-subscriptions/TenantsBillingSummaryTable.jsx
import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye } from "lucide-react";
import { BILLING_ROWS } from "../tenant-subscriptions/mock/billings";

const STATUS_COLORS = {
  Active: "bg-green-100 text-green-700",
  "Pending Upgrade": "bg-amber-100 text-amber-700",
  Suspended: "bg-red-100 text-red-700",
  Trial: "bg-blue-100 text-blue-700",
};

function StatusPill({ value }) {
  const cls = STATUS_COLORS[value] ?? "bg-gray-100 text-gray-700";
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}>{value}</span>;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export function TenantsBillingSummaryTable() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [plan, setPlan] = useState("All");
  const [type, setType] = useState("All");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = BILLING_ROWS;
    if (q.trim()) {
      const t = q.trim().toLowerCase();
      rows = rows.filter((r) => r.tenant.toLowerCase().includes(t));
    }
    if (status !== "All") rows = rows.filter((r) => r.status === status);
    if (plan !== "All") rows = rows.filter((r) => r.plan === plan);
    if (type !== "All") rows = rows.filter((r) => r.type === type);
    return rows;
  }, [q, status, plan, type]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const pageRows = filtered.slice(start, end);

  const uniquePlans = useMemo(() => ["All", ...Array.from(new Set(BILLING_ROWS.map((r) => r.plan)))], []);
  const uniqueTypes = useMemo(() => ["All", ...Array.from(new Set(BILLING_ROWS.map((r) => r.type)))], []);
  const uniqueStatuses = useMemo(() => ["All", ...Array.from(new Set(BILLING_ROWS.map((r) => r.status)))], []);

  const reset = () => {
    setQ("");
    setStatus("All");
    setPlan("All");
    setType("All");
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Billing Summary</span>
          <Input
            placeholder="Search Tenant…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            className="w-[240px] h-8 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
            <SelectTrigger className="w-[150px] h-8">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {uniqueTypes.map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
            </SelectContent>
          </Select>

          <Select value={plan} onValueChange={(v) => { setPlan(v); setPage(1); }}>
            <SelectTrigger className="w-[150px] h-8">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              {uniquePlans.map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-[170px] h-8">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {uniqueStatuses.map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={reset} className="h-8 border-purple-600 text-purple-600 hover:bg-purple-50">
            Reset
          </Button>
        </div>
      </div>

      {/* Earlier 8-column layout, fixed widths to avoid horizontal scrollbars */}
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] table-fixed">
          <colgroup>
            <col className="w-[260px]" /> {/* Tenant */}
            <col className="w-[110px]" /> {/* Type */}
            <col className="w-[120px]" /> {/* Plan */}
            <col className="w-[110px]" /> {/* Users */}
            <col className="w-[130px]" /> {/* Storage */}
            <col className="w-[130px]" /> {/* API */}
            <col className="w-[120px]" /> {/* Status */}
            <col className="w-[90px]" />  {/* Action */}
          </colgroup>
          <thead>
            <tr className="border-b bg-muted/40 text-[12px] text-muted-foreground">
              <th className="text-left font-medium px-2 py-2">Tenant</th>
              <th className="text-left font-medium px-2 py-2">Type</th>
              <th className="text-left font-medium px-2 py-2">Plan</th>
              <th className="text-left font-medium px-2 py-2">Users</th>
              <th className="text-left font-medium px-2 py-2">Storage</th>
              <th className="text-left font-medium px-2 py-2">API</th>
              <th className="text-left font-medium px-2 py-2">Status</th>
              <th className="text-left font-medium px-2 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="px-2 py-1.5">
                  <span className="block truncate" title={r.tenant}>{r.tenant}</span>
                </td>
                <td className="px-2 py-1.5 whitespace-nowrap">{r.type}</td>
                <td className="px-2 py-1.5 whitespace-nowrap">{r.plan}</td>
                <td className="px-2 py-1.5 whitespace-nowrap">{r.users.current} / {r.users.max}</td>
                <td className="px-2 py-1.5 whitespace-nowrap">{r.storage.current} / {r.storage.max}</td>
                <td className="px-2 py-1.5 whitespace-nowrap">
                  {Intl.NumberFormat().format(r.api.current)} / {Intl.NumberFormat().format(r.api.max)}
                </td>
                <td className="px-2 py-1.5"><StatusPill value={r.status} /></td>
                <td className="px-2 py-1.5">
                  <Button variant="ghost" size="sm" className="h-8 px-2 gap-1 text-purple-600 hover:text-purple-700">
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">View</span>
                  </Button>
                </td>
              </tr>
            ))}

            {pageRows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-muted-foreground">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-[12px] text-muted-foreground">
          Showing <span className="font-medium">{total === 0 ? 0 : start + 1}</span> to{" "}
          <span className="font-medium">{end}</span> of{" "}
          <span className="font-medium">{total}</span> tenants
        </div>

        <div className="flex items-center gap-2">
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
            <SelectTrigger className="w-[110px] h-8">
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((n) => (
                <SelectItem key={n} value={String(n)}>{n} / page</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-8 border-purple-600 text-purple-600 hover:bg-purple-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="text-[12px]">
              Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{pageCount}</span>
            </div>
            <Button
              variant="outline"
              className="h-8 border-purple-600 text-purple-600 hover:bg-purple-50"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={currentPage === pageCount}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
