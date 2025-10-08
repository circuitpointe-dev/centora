// src/components/users/UserDirectoryTable.tsx
import React, { useMemo, useState } from "react";
import { UserTableToolbar, type UserFilters } from "./UserTableToolbar";
import { UserTablePagination } from "./UserTablePagination";
import { UserActionMenu } from "./UserActionMenu";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUsers, useUsersCount } from "@/hooks/useUsers";
import { useDepartments } from "@/hooks/useDepartments";

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "text-green-600 bg-green-50";
    case "inactive":
      return "text-orange-600 bg-orange-50";
    case "deactivated":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

export const UserDirectoryTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<UserFilters>({
    status: "all",
    department: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const { data: users = [], isLoading: usersLoading, refetch: refetchUsers } = useUsers({
    search: searchQuery,
    status: filters.status !== "all" ? (filters.status as string) : undefined,
    department: filters.department !== "all" ? (filters.department as string) : undefined,
    page: currentPage,
    pageSize: usersPerPage,
  });

  const { data: totalUsers = 0 } = useUsersCount(
    searchQuery,
    filters.status !== "all" ? (filters.status as string) : undefined,
    filters.department !== "all" ? (filters.department as string) : undefined
  );
  const { data: departmentsData = [] } = useDepartments();

  const departments = useMemo(
    () => departmentsData.map(d => d.name).sort(),
    [departmentsData]
  );

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = Math.min(startIndex + usersPerPage, totalUsers);

  // Client-side filtering for instant feedback (first-letter search responsiveness)
  const displayedUsers = useMemo(() => {
    const query = (searchQuery || "").trim().toLowerCase();
    if (!query) return users;
    return users.filter((u: any) => {
      const haystack = [
        u.full_name,
        u.email,
        u.department,
        ...(u.modules || []),
        ...(u.roles || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [users, searchQuery]);

  const handleAddUser = () => {
    console.log("Add new user (UI-only)");
  };

  const handleResetAll = () => {
    setSearchQuery("");
    setFilters({ status: "all", department: "all" });
    setCurrentPage(1);
  };

  const exportCsv = () => {
    const headers = [
      "Name",
      "Email",
      "Department",
      "Status",
      "Modules",
      "Roles",
    ];
    const csvRows = [
      headers.join(","),
      ...users.map((u) => {
        const modules = u.modules?.join("; ") || "";
        const roles = u.roles?.join("; ") || "";
        // escape quotes/commas
        const safe = (s: string) =>
          `"${(s ?? "").toString().replace(/"/g, '""')}"`;
        return [
          safe(u.full_name || u.email),
          safe(u.email),
          safe(u.department || ""),
          safe(u.status),
          safe(modules),
          safe(roles),
        ].join(",");
      }),
    ];
    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const ts = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `users_export_${ts}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Keep toolbar mounted at all times to preserve input focus; show loading within the table instead

  if (users.length === 0 && searchQuery === "") {
    return (
      <div className="space-y-6">
        <UserTableToolbar
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
          onAddUser={handleAddUser}
          filters={filters}
          onFiltersChange={(f) => {
            setFilters(f);
            setCurrentPage(1);
          }}
          departments={departments}
          onResetAll={handleResetAll}
        />
        <EmptyState
          icon={Users}
          title="No users found"
          description="Get started by adding your first team member to the system."
          action={{ label: "+ Add New User", onClick: handleAddUser }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserTableToolbar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        onAddUser={handleAddUser}
        filters={filters}
        onFiltersChange={(f) => {
          setFilters(f);
          setCurrentPage(1);
        }}
        departments={departments}
        onResetAll={handleResetAll}
      />

      {/* Top row with Export (left) + showing text */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={exportCsv}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>

          <span className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-900">
              {searchQuery ? displayedUsers.length : totalUsers}
            </span>{" "}
            result{(searchQuery ? displayedUsers.length : totalUsers) === 1 ? "" : "s"}
            {searchQuery || filters.status !== "all" || filters.department !== "all" ? " (filtered)" : ""}
          </span>
        </div>

        {/* right side left empty (keeps spacing consistent) */}
        <div />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="text-gray-600 font-medium">Name</TableHead>
              <TableHead className="text-gray-600 font-medium">
                Department
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Modules
              </TableHead>
              <TableHead className="text-gray-600 font-medium">Roles</TableHead>
              <TableHead className="text-gray-600 font-medium">
                Status
              </TableHead>
              <TableHead className="text-gray-600 font-medium w-12">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersLoading && (
              <>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableCell colSpan={6}>
                      <div className="h-10 bg-gray-100 animate-pulse rounded" />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
            {!usersLoading && (searchQuery ? displayedUsers : users).map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">
                      {user.full_name || user.email}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {user.department || "No Department"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.modules && user.modules.length > 0 ? (
                      <>
                        <span className="text-sm text-gray-900">
                          {user.modules[0]}
                        </span>
                        {user.modules.length > 1 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.modules.length - 1} more
                          </Badge>
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-gray-400">No modules</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.roles && user.roles.length > 0 ? (
                      <>
                        <span className="text-sm text-gray-900">
                          {user.roles[0]}
                        </span>
                        {user.roles.length > 1 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.roles.length - 1} more
                          </Badge>
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-gray-400">No roles</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(
                      user.status
                    )} border-0 capitalize`}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <UserActionMenu
                    user={user as any}
                    onStatusChange={refetchUsers}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UserTablePagination
        currentPage={currentPage}
        totalItems={totalUsers}
        itemsPerPage={usersPerPage}
        startIndex={startIndex + 1}
        endIndex={endIndex}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
