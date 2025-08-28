// src/components/users/tenants-subscriptions/BillingSummaryTable.tsx

import React, { useMemo, useState } from "react";
import { Eye, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BillingTableToolbar } from "./BillingTableToolbar";
import { BillingStatus, OrgType, PlanTier } from "./types";
import { tenants } from "./mock/tenants";

function StatusPill({ value }: { value: BillingStatus }) {
  const map: Record<BillingStatus, string> = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Pending Upgrade": "bg-amber-50 text-amber-700 border-amber-200",
    Suspended: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${map[value]}`}>
      {value}
    </span>
  );
}

const PAGE_SIZE = 8;

export const BillingSummaryTable: React.FC = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BillingStatus | "">("");
  const [plan, setPlan] = useState<PlanTier | "">("");
  const [type, setType] = useState<OrgType | "">("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const out = tenants.filter((t) => {
      const matchesSearch = !s || t.tenant.toLowerCase().includes(s) || t.plan.toLowerCase().includes(s);
      const matchesStatus = !status || t.status === status;
      const matchesPlan = !plan || t.plan === plan;
      const matchesType = !type || t.type === type;
      return matchesSearch && matchesStatus && matchesPlan && matchesType;
    });
    return out;
  }, [search, status, plan, type]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);
  const start = (clampedPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  React.useEffect(() => setPage(1), [search, status, plan, type]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-tight">Tenant Billing Summary</h2>
        <BillingTableToolbar
          search={search}
          onSearch={setSearch}
          status={status}
          onStatus={setStatus}
          plan={plan}
          onPlan={setPlan}
          type={type}
          onType={setType}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Tenant</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Users</th>
              <th className="px-4 py-3 font-medium">Storage</th>
              <th className="px-4 py-3 font-medium">Api</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-5 items-center justify-center rounded border bg-white">
                      <Users className="h-3.5 w-3.5" />
                    </span>
                    <div className="font-medium">{r.tenant}</div>
                  </div>
                </td>
                <td className="px-4 py-3">{r.type}</td>
                <td className="px-4 py-3">{r.plan}</td>
                <td className="px-4 py-3">{`${r.users.used}/${r.users.limit}`}</td>
                <td className="px-4 py-3">{`${r.storage.used}GB/${r.storage.limit}GB`}</td>
                <td className="px-4 py-3">{`${r.api.used.toLocaleString()}/${r.api.limit.toLocaleString()}`}</td>
                <td className="px-4 py-3">
                  <StatusPill value={r.status} />
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="outline"
                    className="border-purple-600 text-purple-600 hover:bg-purple-50 active:bg-purple-100"
                    onClick={() => console.log("View tenant", r.id)}
                  >
                    <Eye className="mr-2 h-4 w-4" /> View
                  </Button>
                </td>
              </tr>
            ))}

            {pageRows.length === 0 && (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={8}>
                  No results match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <div>
          {total === 0
            ? "Showing 0"
            : `Showing ${start + 1} to ${Math.min(start + PAGE_SIZE, total)} of ${total} tenant billing summary`}
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
