// src/components/users/super-admin/SuperAdminUserPage.tsx
import * as React from "react";
import { Plus, Trash2, Search, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { SuperAdminUser, SuperAdminRole } from "./types";
import { SUPER_ADMIN_USERS } from "./mock/superAdminUsers";
import { SUPER_ADMIN_ROLES } from "./mock/roles";
import { AUDIT_LOGS } from "./mock/auditLogs";

import { SuperAdminStatsCards } from "./SuperAdminStatsCards";
import { SuperAdminTable } from "./SuperAdminTable";
import { SuperAdminFilter, type SuperAdminFilters } from "./SuperAdminFilter";
import { NewSuperAdminDialog } from "./NewSuperAdminDialog";
import { ResetPasswordDialog } from "./ResetPasswordDialog";
import { SuperAdminDetailsSheet } from "./SuperAdminDetailsSheet";
import { AuditLogsModal } from "./AuditLogsModal";

const BRAND_PURPLE = "bg-purple-600 hover:bg-purple-700 active:bg-purple-800";
const BRAND_PURPLE_OUTLINE =
  "border border-purple-600 text-purple-600 hover:bg-purple-50 active:bg-purple-100";

const PAGE_SIZE = 8;

const rangeText = (page: number, total: number, pageSize: number) => {
  if (total === 0) return "Showing 0 to 0 of 0 users";
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return `Showing ${start} to ${end} of ${total} users`;
};

export const SuperAdminUserPage: React.FC = () => {
  // data & selection
  const [users, setUsers] = React.useState<SuperAdminUser[]>(SUPER_ADMIN_USERS);
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});

  // search & filter
  const [query, setQuery] = React.useState("");
  const [filters, setFilters] = React.useState<SuperAdminFilters>({
    statuses: [],
    roles: [],
  });

  // pagination
  const [page, setPage] = React.useState(1);

  // details & dialogs
  const [detailsUser, setDetailsUser] = React.useState<SuperAdminUser | null>(
    null
  );
  const [detailsMode, setDetailsMode] = React.useState<"view" | "edit">("view");
  const [resetting, setResetting] = React.useState<SuperAdminUser | null>(null);

  // delete confirm
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  // centralized audit modal
  const [logsOpen, setLogsOpen] = React.useState(false);
  const [logsFocusUser, setLogsFocusUser] =
    React.useState<SuperAdminUser | null>(null);

  // derived: filter -> paginate
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const matchesQ =
        !q ||
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q);
      const matchesStatus =
        filters.statuses.length ? filters.statuses.includes(u.status) : true;
      const matchesRole =
        filters.roles.length ? filters.roles.includes(u.role) : true;
      return matchesQ && matchesStatus && matchesRole;
    });
  }, [users, query, filters]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // stats (UI-only)
  const stats = React.useMemo(
    () => ({
      active: users.filter((u) => u.status === "active").length,
      suspended: users.filter((u) => u.status === "suspended").length,
      pending: users.filter((u) => u.status === "pending").length,
    }),
    [users]
  );

  // selection helpers
  const selectedIds = React.useMemo(
    () => Object.entries(selected).filter(([, v]) => v).map(([k]) => k),
    [selected]
  );
  const hasSelection = selectedIds.length > 0;

  // handlers
  const toggleAllOnPage = (checked: boolean) => {
    const next = { ...selected };
    paged.forEach((u) => (next[u.id] = checked));
    setSelected(next);
  };

  const toggleRow = (id: string, checked: boolean) =>
    setSelected((s) => ({ ...s, [id]: checked }));

  const handleConfirmDelete = () => {
    if (!hasSelection) return;
    setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
    setSelected((prev) => {
      const copy = { ...prev };
      selectedIds.forEach((id) => delete copy[id]);
      return copy;
    });
    setDeleteOpen(false);
  };

  const handleSuspend = (id: string) =>
    setUsers((list) =>
      list.map((u) => (u.id === id ? { ...u, status: "suspended" } : u))
    );

  const handleActivate = (id: string) =>
    setUsers((list) =>
      list.map((u) => (u.id === id ? { ...u, status: "active" } : u))
    );

  const handleCreate = (data: Omit<SuperAdminUser, "id" | "lastLoginAt">) => {
    const newUser: SuperAdminUser = {
      id: `u_${Math.random().toString(36).slice(2, 8)}`,
      lastLoginAt: new Date().toISOString(),
      ...data,
    };
    setUsers((prev) => [newUser, ...prev]);
  };

  const openView = (u: SuperAdminUser) => {
    setDetailsUser(u);
    setDetailsMode("view");
  };

  const openEdit = (u: SuperAdminUser) => {
    setDetailsUser(u);
    setDetailsMode("edit");
  };

  const handleSaveDetails = (updated: SuperAdminUser) => {
    setUsers((list) => list.map((u) => (u.id === updated.id ? updated : u)));
  };

  const clearFilters = () => setFilters({ statuses: [], roles: [] });

  // feed recent logs for the details sheet
  const getUserLogs = React.useCallback(
    (u: SuperAdminUser | null) =>
      !u
        ? []
        : AUDIT_LOGS.filter(
            (l) => l.targetUserId === u.id || l.actorEmail === u.email
          ).sort((a, b) => +new Date(b.at) - +new Date(a.at)),
    []
  );

  // reset pagination when inputs change
  React.useEffect(() => {
    setPage(1);
  }, [query, filters]);

  return (
    <div className="space-y-6">
      {/* Title (per your spec) */}
      <h1 className="text-lg font-semibold tracking-tight">Super Admin Users</h1>

      {/* Stat Cards */}
      <SuperAdminStatsCards stats={stats} />

      {/* Toolbar */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-base font-medium">Super Admin Users</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 w-72"
              placeholder="Search Users, Department..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Centralized Audit Logs */}
          <Button
            variant="outline"
            className={BRAND_PURPLE_OUTLINE}
            onClick={() => {
              setLogsFocusUser(null);
              setLogsOpen(true);
            }}
          >
            <ScrollText className="mr-2 h-4 w-4" />
            Audit Logs
          </Button>

          {/* Filter */}
          <SuperAdminFilter
            roles={SUPER_ADMIN_ROLES as SuperAdminRole[]}
            value={filters}
            onChange={setFilters}
            onApply={() => {}}
            onClear={clearFilters}
          />

          {/* Add New Super Admin */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className={BRAND_PURPLE}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Super Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl">Add New Super Admin</DialogTitle>
              </DialogHeader>
              <NewSuperAdminDialog
                roles={SUPER_ADMIN_ROLES as SuperAdminRole[]}
                onCreate={handleCreate}
              />
            </DialogContent>
          </Dialog>

          {/* Delete with confirmation */}
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 active:bg-red-800"
            disabled={!hasSelection}
            onClick={() => setDeleteOpen(true)}
            title={!hasSelection ? "Select At Least One User" : "Delete Selected Users"}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Table */}
      <SuperAdminTable
        users={paged}
        selected={selected}
        onToggleRow={toggleRow}
        onToggleAllOnPage={toggleAllOnPage}
        onEdit={openEdit}
        onSuspend={handleSuspend}
        onActivate={handleActivate}
        onView={openView}
        onResetPassword={(u) => setResetting(u)}
        onViewLogs={(u) => {
          setLogsFocusUser(u);
          setLogsOpen(true);
        }}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between border rounded-xl bg-white p-4 text-sm">
        <div>{rangeText(page, total, PAGE_SIZE)}</div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={page === pageCount}
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>

      {/* View/Edit Sheet with Recent Activity */}
      <SuperAdminDetailsSheet
        user={detailsUser}
        roles={SUPER_ADMIN_ROLES as SuperAdminRole[]}
        mode={detailsMode}
        open={!!detailsUser}
        onOpenChange={(v) => !v && setDetailsUser(null)}
        onSave={handleSaveDetails}
        userLogs={getUserLogs(detailsUser)}
        onOpenFullLogs={(u) => {
          setLogsFocusUser(u);
          setLogsOpen(true);
        }}
      />

      {/* Reset Password Dialog */}
      <ResetPasswordDialog
        user={resetting}
        open={!!resetting}
        onOpenChange={(v) => !v && setResetting(null)}
      />

      {/* Strict Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Permanently Delete Selected Super Admins?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This Action Cannot Be Undone. It Will Permanently Remove{" "}
              <b>{selectedIds.length}</b> Super Admin{" "}
              {selectedIds.length === 1 ? "User" : "Users"} And Revoke Their
              Access To The Centora Portal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 active:bg-red-800"
              onClick={handleConfirmDelete}
            >
              Permanently Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Centralized Audit Logs Modal */}
      <AuditLogsModal
        open={logsOpen}
        onOpenChange={setLogsOpen}
        logs={AUDIT_LOGS}
        focusUser={logsFocusUser}
      />
    </div>
  );
};

export default SuperAdminUserPage;
