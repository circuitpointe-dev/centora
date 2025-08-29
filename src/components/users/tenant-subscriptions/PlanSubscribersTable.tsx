// src/components/users/tenants-subscriptions/PlanSubscribersTable.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { getSubscribersForPlan } from "./mock/plans";

export function PlanSubscribersTable({ planId }: { planId: string }) {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);

  const all = React.useMemo(() => getSubscribersForPlan(planId), [planId]);
  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return all.filter(
      (r) =>
        !q ||
        r.tenant.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    );
  }, [all, search]);

  const PAGE_SIZE = 8;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  React.useEffect(() => setPage(1), [search, planId]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Current Subscribers</h4>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tenants…"
          className="h-9 w-[220px] rounded-md border px-3 text-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr className="text-left">
              <th className="px-3 py-2 font-medium">Tenant</th>
              <th className="px-3 py-2 font-medium">Users</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">{r.tenant}</td>
                <td className="px-3 py-2">{r.users}</td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${
                      r.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : r.status === "Pending"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <Button
                    variant="outline"
                    className="h-8 border-purple-600 text-purple-600 hover:bg-purple-50 active:bg-purple-100"
                    onClick={() => console.log("View subscriber", r.id)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </td>
              </tr>
            ))}

            {pageRows.length === 0 && (
              <tr>
                <td className="px-3 py-10 text-center text-slate-500" colSpan={4}>
                  No subscribers found.
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
            : `Showing ${start + 1} to ${Math.min(start + PAGE_SIZE, total)} of ${total} subscribers`}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            className="h-8"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
