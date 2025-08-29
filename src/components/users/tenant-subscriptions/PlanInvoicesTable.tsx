// src/components/users/tenants-subscriptions/PlanInvoicesTable.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { getInvoicesForPlan } from "./mock/plans";
import { InvoiceStatus } from "./types";

function StatusPill({ value }: { value: InvoiceStatus }) {
  const map: Record<InvoiceStatus, string> = {
    Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Failed: "bg-rose-50 text-rose-700 border-rose-200",
    Overdue: "bg-orange-50 text-orange-700 border-orange-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${map[value]}`}>
      {value}
    </span>
  );
}

export function PlanInvoicesTable({ planId }: { planId: string }) {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const PAGE_SIZE = 8;

  const all = React.useMemo(() => getInvoicesForPlan(planId), [planId]);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return all.filter(
      (r) =>
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.tenant.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    );
  }, [all, search]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const clamped = Math.min(page, totalPages);
  const start = (clamped - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  React.useEffect(() => setPage(1), [search, planId]);

  const fmtMoney = (cents: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(cents / 100);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Invoices</h4>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search invoices…"
          className="h-9 w-[220px] rounded-md border px-3 text-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[880px] text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr className="text-left">
              <th className="px-3 py-2 font-medium">Invoice ID</th>
              <th className="px-3 py-2 font-medium">Tenant</th>
              <th className="px-3 py-2 font-medium">Amount</th>
              <th className="px-3 py-2 font-medium">Issued Date</th>
              <th className="px-3 py-2 font-medium">Due Date</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2 font-medium">{r.id}</td>
                <td className="px-3 py-2">{r.tenant}</td>
                <td className="px-3 py-2 whitespace-nowrap">{fmtMoney(r.amount)}</td>
                <td className="px-3 py-2 whitespace-nowrap">{fmtDate(r.issuedAt)}</td>
                <td className="px-3 py-2 whitespace-nowrap">{fmtDate(r.dueAt)}</td>
                <td className="px-3 py-2">
                  <StatusPill value={r.status} />
                </td>
                <td className="px-3 py-2">
                  <Button
                    variant="outline"
                    className="h-8 border-purple-600 text-purple-600 hover:bg-purple-50 active:bg-purple-100"
                    onClick={() => console.log("View invoice", r.id)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="px-3 py-10 text-center text-slate-500" colSpan={7}>
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs md:text-sm text-slate-600">
        <div>
          {total === 0
            ? "Showing 0"
            : `Showing ${start + 1} to ${Math.min(start + PAGE_SIZE, total)} of ${total} invoices`}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8"
            disabled={clamped <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            className="h-8"
            disabled={clamped >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
