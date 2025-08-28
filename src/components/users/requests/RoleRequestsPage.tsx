// src/components/users/requests/RoleRequestsPage.tsx

import * as React from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronsLeft, ChevronsRight, Eye, Filter, Plus, Search, Trash2 } from "lucide-react";
import { CreateRoleRequestDialog } from "../roles/CreateRoleRequestDialog";
import { modules as roleModules } from "../roles/mock/roles-permission-data";
import { roleRequests as mockRequests, RoleRequest } from "../requests/mock/role-requests-data";

type StatusFilter = "all" | "pending" | "approved" | "declined";

const statusBadgeClass = (status: RoleRequest["status"]) =>
  status === "approved"
    ? "bg-emerald-100 text-emerald-900"
    : status === "declined"
    ? "bg-rose-100 text-rose-900"
    : "bg-amber-100 text-amber-900";

const moduleNameById = (id: string) => roleModules.find((m) => m.id === id)?.name ?? id;

export const RoleRequestPage: React.FC = () => {
  const [requests, setRequests] = useState<RoleRequest[]>(mockRequests);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [openCreate, setOpenCreate] = useState(false);

  // details dialog
  const [openDetails, setOpenDetails] = useState(false);
  const [active, setActive] = useState<RoleRequest | null>(null);

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return requests
      .filter((r) => (status === "all" ? true : r.status === status))
      .filter((r) => {
        if (!q) return true;
        const hay = [
          r.requested_role_name,
          r.full_name,
          r.email,
          r.message,
          ...r.requested_modules.map(moduleNameById),
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [requests, status, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const start = (pageSafe - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  const handleOpenDetails = (r: RoleRequest) => {
    setActive(r);
    setOpenDetails(true);
  };

  const handleDelete = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    if (active?.id === id) setOpenDetails(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Role Requests</h1>
          <p className="text-sm text-gray-500">
            Track requests to create new roles for your organization. These are reviewed by Centora.
          </p>
        </div>
        <Button
          onClick={() => setOpenCreate(true)}
          className="bg-brand-purple text-brand-purple-foreground hover:bg-brand-purple/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Role Request
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by role, user, email, module…"
              className="pl-8 w-72"
            />
          </div>

          <div className="hidden md:flex items-center gap-1 ml-2">
            <span className="text-sm text-gray-500">Status:</span>
            <div className="flex rounded-lg border overflow-hidden">
              {(["all", "pending", "approved", "declined"] as StatusFilter[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setStatus(s);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 text-sm border-l first:border-l-0 hover:bg-brand-purple/5 ${
                    status === s ? "bg-brand-purple/5 text-brand-purple" : "text-gray-700"
                  }`}
                >
                  {s[0].toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value, 10));
              setPage(1);
            }}
            className="h-9 rounded-md border px-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
          >
            {[8, 12, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} per page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="rounded-xl border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left font-medium px-4 py-3">Requested Role</th>
              <th className="text-left font-medium px-4 py-3">Modules</th>
              <th className="text-left font-medium px-4 py-3">Requester</th>
              <th className="text-left font-medium px-4 py-3">Submitted</th>
              <th className="text-left font-medium px-4 py-3">Status</th>
              <th className="text-right font-medium px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                  No requests found. Try adjusting filters or submit a new request.
                </td>
              </tr>
            ) : (
              pageRows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{r.requested_role_name}</div>
                    {r.message && (
                      <div className="text-xs text-gray-500 line-clamp-1">{r.message}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {r.requested_modules.length === 0 ? (
                      <span className="text-gray-400">None</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {r.requested_modules.slice(0, 4).map((id) => (
                          <span
                            key={id}
                            className="px-2 py-0.5 rounded-md text-[11px] border border-brand-purple/30 bg-brand-purple/5"
                          >
                            {moduleNameById(id)}
                          </span>
                        ))}
                        {r.requested_modules.length > 4 && (
                          <span className="text-xs text-gray-500">
                            +{r.requested_modules.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.full_name}</div>
                    <div className="text-xs text-gray-500">{r.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={statusBadgeClass(r.status)}>{r.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        className="h-8 px-2 hover:bg-brand-purple/5 hover:border-brand-purple"
                        onClick={() => handleOpenDetails(r)}
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 px-2 hover:bg-rose-50 hover:border-rose-300"
                        onClick={() => handleDelete(r.id)}
                        title="Delete (UI only)"
                      >
                        <Trash2 className="h-4 w-4 text-rose-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-600">
          Showing <span className="font-medium">{start + 1}</span>–
          <span className="font-medium">{Math.min(start + pageSize, filtered.length)}</span> of{" "}
          <span className="font-medium">{filtered.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            className="h-8 px-2"
            onClick={() => setPage(1)}
            disabled={pageSafe === 1}
            title="First"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 px-3"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pageSafe === 1}
          >
            Prev
          </Button>
          <div className="px-2">
            Page <span className="font-medium">{pageSafe}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </div>
          <Button
            variant="outline"
            className="h-8 px-3"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={pageSafe === totalPages}
          >
            Next
          </Button>
          <Button
            variant="outline"
            className="h-8 px-2"
            onClick={() => setPage(totalPages)}
            disabled={pageSafe === totalPages}
            title="Last"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Request details</DialogTitle>
            <DialogDescription className="text-gray-600">
              This request will be reviewed by Centora. No changes are made until it’s approved.
            </DialogDescription>
          </DialogHeader>

          {active && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">{active.requested_role_name}</div>
                    <Badge className={statusBadgeClass(active.status)}>{active.status}</Badge>
                  </div>
                  <div className="text-gray-700">
                    Submitted: {new Date(active.createdAt).toLocaleString()}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="text-gray-500">Requester</div>
                      <div className="font-medium">{active.full_name}</div>
                      <div className="text-xs text-gray-500">{active.email}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Modules</div>
                      {active.requested_modules.length === 0 ? (
                        <div className="text-gray-400">None</div>
                      ) : (
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {active.requested_modules.map((id) => (
                            <span
                              key={id}
                              className="px-2 py-0.5 rounded-md text-[11px] border border-brand-purple/30 bg-brand-purple/5"
                            >
                              {moduleNameById(id)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {active.message && (
                      <div className="md:col-span-2">
                        <div className="text-gray-500">Message</div>
                        <p className="mt-1 whitespace-pre-wrap">{active.message}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  className="hover:bg-rose-50 hover:border-rose-300"
                  onClick={() => handleDelete(active.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2 text-rose-600" />
                  Delete (UI only)
                </Button>
                <Button onClick={() => setOpenDetails(false)} className="bg-brand-purple text-brand-purple-foreground hover:bg-brand-purple/90">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create dialog (reuses your existing component) */}
      <CreateRoleRequestDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onSuccess={(payload) => {
          const id = crypto?.randomUUID?.() ?? String(Math.random()).slice(2);
          setRequests((prev) => [
            ...prev,
            {
              id,
              status: "pending",
              createdAt: new Date().toISOString(),
              ...payload,
            },
          ]);
          setOpenCreate(false);
        }}
      />
    </div>
  );
};
