// src/components/users/super-admin/SuperAdminUserPage.tsx
import * as React from "react";
import { Plus, Trash2, Search, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

// --- Import backend hooks ---
import { 
  useSuperAdminUsers, 
  useSuperAdminStats,
  useUpdateUserStatus,
  useUpdateUser,
  useCreateUserInvitation,
  useDeleteUser
} from '@/hooks/useSuperAdminUsers';
import { useSuperAdminAuditLogs } from '@/hooks/useSuperAdminAuditLogs';
import { useSuperAdminRoles } from '@/hooks/useSuperAdminRoles';
import type { SuperAdminUser, SuperAdminRole } from "./types";

// --- Import components ---
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

const getPaginationText = (page: number, pageSize: number, total: number): string => {
  if (total === 0) return "Showing 0 to 0 of 0 users";
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return `Showing ${start} to ${end} of ${total} users`;
};

export const SuperAdminUserPage: React.FC = () => {
  // Backend data hooks
  const [query, setQuery] = React.useState("");
  const { data: users = [], isLoading: usersLoading, refetch } = useSuperAdminUsers(query);
  const { data: stats } = useSuperAdminStats();
  const { data: auditLogs = [] } = useSuperAdminAuditLogs();
  const { data: roles = [] } = useSuperAdminRoles();
  
  // Mutations
  const updateUserStatusMutation = useUpdateUserStatus();
  const updateUserMutation = useUpdateUser();
  const createUserInvitationMutation = useCreateUserInvitation();
  const deleteUserMutation = useDeleteUser();
  
  // Local state & selection
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});

  // search & filter
  const [filters, setFilters] = React.useState<SuperAdminFilters>({
    roles: [],
    statuses: [],
  });

  // pagination
  const [currentPage, setCurrentPage] = React.useState(1);

  // dialogs & sheets & modals
  const [showCreate, setShowCreate] = React.useState(false);
  const [resetUser, setResetUser] = React.useState<SuperAdminUser | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [detailsUser, setDetailsUser] = React.useState<SuperAdminUser | null>(null);
  const [detailsMode, setDetailsMode] = React.useState<"view" | "edit">("view");

  const [logsOpen, setLogsOpen] = React.useState(false);
  const [logsFocusUser, setLogsFocusUser] = React.useState<SuperAdminUser | null>(null);

  // derived state: filter & paginate
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesQuery =
        !q ||
        user.fullName.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.role.toLowerCase().includes(q);

      const matchesRole = filters.roles.length === 0 || filters.roles.includes(user.role);
      const matchesStatus = filters.statuses.length === 0 || filters.statuses.includes(user.status);

      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [users, query, filters]);

  const paged = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filtered.slice(start, end);
  }, [filtered, currentPage]);

  const selectedIds = React.useMemo(() => {
    return Object.keys(selected).filter((id) => selected[id]);
  }, [selected]);

  // selection handlers
  const toggleAllOnPage = () => {
    const allSelected = paged.every((u) => selected[u.id]);
    if (allSelected) {
      // deselect all on page
      setSelected((prev) => {
        const next = { ...prev };
        paged.forEach((u) => delete next[u.id]);
        return next;
      });
    } else {
      // select all on page
      setSelected((prev) => ({
        ...prev,
        ...paged.reduce((acc, u) => ({ ...acc, [u.id]: true }), {}),
      }));
    }
  };

  const toggleRow = (id: string) => {
    setSelected((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleConfirmDelete = () => {
    const idsToDelete = selectedIds;
    Promise.all(idsToDelete.map(id => deleteUserMutation.mutateAsync(id)))
      .then(() => {
        setSelected({});
        setDeleteConfirmOpen(false);
        refetch();
      })
      .catch(error => {
        console.error('Failed to delete users:', error);
      });
  };

  // action handlers
  const handleSuspend = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      updateUserStatusMutation.mutate({ 
        userId: user.id, 
        status: 'inactive' 
      });
    }
  };

  const handleActivate = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      updateUserStatusMutation.mutate({ 
        userId: user.id, 
        status: 'active' 
      });
    }
  };

  const handleCreate = (newUser: Omit<SuperAdminUser, "id" | "lastLoginAt">) => {
    createUserInvitationMutation.mutate({
      email: newUser.email,
      full_name: newUser.fullName,
    });
    setShowCreate(false);
  };

  const openView = (user: SuperAdminUser) => {
    setDetailsUser(user);
    setDetailsMode("view");
  };

  const openEdit = (user: SuperAdminUser) => {
    setDetailsUser(user);
    setDetailsMode("edit");
  };

  const handleSaveDetails = (updatedUser: SuperAdminUser) => {
    updateUserMutation.mutate({
      id: updatedUser.id,
      full_name: updatedUser.fullName,
    });
    setDetailsUser(null);
  };

  const clearFilters = () => {
    setQuery("");
    setFilters({ roles: [], statuses: [] });
    setCurrentPage(1);
  };

  const getUserLogs = (user: SuperAdminUser) => {
    setLogsFocusUser(user);
    setLogsOpen(true);
  };

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  if (usersLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Super Admin Users</h1>
      </div>

      {/* Stats Cards */}
      <SuperAdminStatsCards stats={stats || { active: 0, suspended: 0, pending: 0 }} />

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        {/* Left: search bar */}
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search Users, Department..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setLogsOpen(true)}
            className="gap-2"
          >
            <ScrollText className="h-4 w-4" />
            Audit Logs
          </Button>

          <SuperAdminFilter 
            roles={roles.map(r => r.name)} 
            value={filters} 
            onChange={setFilters}
            onApply={() => {}}
            onClear={clearFilters}
          />
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-3">
          <Dialog open={showCreate} onOpenChange={setShowCreate}>
            <DialogTrigger asChild>
              <Button className={BRAND_PURPLE}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Super Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Super Admin</DialogTitle>
                <DialogDescription>
                  Create a new super admin user account with access to the system.
                </DialogDescription>
              </DialogHeader>
              <NewSuperAdminDialog roles={roles} onCreate={handleCreate} />
            </DialogContent>
          </Dialog>

          <Button
            variant="destructive"
            disabled={selectedIds.length === 0}
            onClick={() => setDeleteConfirmOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete ({selectedIds.length})
          </Button>
        </div>
      </div>

      {/* Filter summary & clear */}
      {(query || filters.roles.length > 0 || filters.statuses.length > 0) && (
        <div className="flex items-center justify-between py-3 px-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Filtered results ({filtered.length} users)</span>
            {query && <span>• Search: "{query}"</span>}
            {filters.roles.length > 0 && <span>• Roles: {filters.roles.join(', ')}</span>}
            {filters.statuses.length > 0 && <span>• Statuses: {filters.statuses.join(', ')}</span>}
          </div>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Table */}
      <SuperAdminTable
        users={paged}
        selected={selected}
        onToggleAllOnPage={toggleAllOnPage}
        onToggleRow={toggleRow}
        onEdit={openEdit}
        onSuspend={handleSuspend}
        onActivate={handleActivate}
        onView={openView}
        onResetPassword={(user) => setResetUser(user)}
        onViewLogs={getUserLogs}
        stickyActions
      />

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {getPaginationText(currentPage, PAGE_SIZE, filtered.length)}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              const distance = Math.abs(page - currentPage);
              return distance <= 2 || page === 1 || page === totalPages;
            })
            .map((page, index, array) => {
              const prev = array[index - 1];
              const showEllipsis = prev && page - prev > 1;

              return (
                <React.Fragment key={page}>
                  {showEllipsis && <span className="text-muted-foreground">...</span>}
                  <Button
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                </React.Fragment>
              );
            })}

          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Details Sheet */}
      <SuperAdminDetailsSheet
        user={detailsUser}
        roles={roles.map(r => r.name) as SuperAdminRole[]}
        mode={detailsMode}
        open={!!detailsUser}
        onOpenChange={(open) => !open && setDetailsUser(null)}
        onSave={handleSaveDetails}
      />

      {/* Reset Password Dialog */}
      <ResetPasswordDialog
        user={resetUser}
        open={!!resetUser}
        onOpenChange={(open) => !open && setResetUser(null)}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.length} selected user(s)? This action
              cannot be undone and will permanently remove their accounts and data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete Users
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Centralized Audit Logs Modal */}
      <AuditLogsModal
        open={logsOpen}
        onOpenChange={setLogsOpen}
        logs={auditLogs}
        focusUser={logsFocusUser}
      />
    </div>
  );
};

export default SuperAdminUserPage;