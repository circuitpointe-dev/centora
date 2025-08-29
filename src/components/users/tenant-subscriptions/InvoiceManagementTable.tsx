// src/components/users/tenants-subscriptions/InvoiceManagementTable.tsx

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { invoices } from "./mock/invoices";
import { InvoiceStatus } from "./types";
import { InvoiceTableToolbar } from "./InvoiceTableToolbar";

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

const PAGE_SIZE = 8;

export const InvoiceManagementTable: React.FC = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<InvoiceStatus | "">("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return invoices.filter((row) => {
      const matchesSearch =
        !s ||
        row.id.toLowerCase().includes(s) ||
        row.tenant.toLowerCase().includes(s);
      const matchesStatus = !status || row.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);
  const start = (clampedPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  React.useEffect(() => setPage(1), [search, status]);

  const formatMoney = (cents: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(cents / 100);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-tight">Invoice Management</h2>
        <InvoiceTableToolbar
          search={search}
          onSearch={setSearch}
          status={status}
          onStatus={setStatus}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr className="text-left">
              <th className="px-3 py-2 font-medium">Invoice ID</th>
              <th className="px-3 py-2 font-medium">Tenant</th>
              <th className="px-3 py-2 font-medium">Amount</th>
              <th className="px-3 py-2 font-medium">Issued</th>
              <th className="px-3 py-2 font-medium">Due Date</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2 font-medium">{r.id}</td>
                <td className="px-3 py-2">{r.tenant}</td>
                <td className="px-3 py-2 whitespace-nowrap">{formatMoney(r.amount)}</td>
                <td className="px-3 py-2 whitespace-nowrap">{fmtDate(r.issuedAt)}</td>
                <td className="px-3 py-2 whitespace-nowrap">{fmtDate(r.dueAt)}</td>
                <td className="px-3 py-2">
                  <StatusPill value={r.status} />
                </td>
                <td className="px-3 py-2">
                  <Button
                    variant="outline"
                    className="h-8 border-purple-600 text-purple-600 hover:bg-purple-50 active:bg-purple-100"
                    onClick={() => console.log("Download invoice", r.id)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </td>
              </tr>
            ))}

            {pageRows.length === 0 && (
              <tr>
                <td className="px-3 py-10 text-center text-slate-500" colSpan={7}>
                  No invoices match your filters.
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
            disabled={clampedPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            className="h-8"
            disabled={clampedPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
