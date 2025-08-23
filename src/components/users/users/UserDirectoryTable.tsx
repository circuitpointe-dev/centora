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
import { useMockUsers } from "@/components/users/users/mock/MockUsersProvider";
import { Button } from "@/components/ui/button";

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
  const { users } = useMockUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<UserFilters>({
    status: "all",
    department: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const departments = useMemo(
    () => Array.from(new Set(users.map((u) => u.department))).sort(),
    [users]
  );

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return users
      .filter((u) => {
        if (filters.status !== "all" && u.status !== filters.status)
          return false;
        if (filters.department !== "all" && u.department !== filters.department)
          return false;
        return true;
      })
      .filter((u) => {
        if (!q) return true;
        return (
          u.full_name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.department.toLowerCase().includes(q) ||
          u.modules.join(" ").toLowerCase().includes(q) ||
          u.roles.join(" ").toLowerCase().includes(q)
        );
      });
  }, [users, filters, searchQuery]);

  const totalUsers = filtered.length;
  const startIndex = (currentPage - 1) * usersPerPage;
  const pageItems = filtered.slice(startIndex, startIndex + usersPerPage);
  const endIndex = Math.min(startIndex + usersPerPage, totalUsers);

  const handleAddUser = () => {
    console.log("Add new user (UI-only)");
  };

  const handleResetAll = () => {
    setSearchQuery("");
    setFilters({ status: "all", department: "all" });
    setCurrentPage(1);
  };

  const exportCsv = () => {
    const rows = filtered; // export the filtered set (not only the current page)
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
      ...rows.map((u) => {
        const modules = u.modules.join("; ");
        const roles = u.roles.join("; ");
        // escape quotes/commas
        const safe = (s: string) =>
          `"${(s ?? "").toString().replace(/"/g, '""')}"`;
        return [
          safe(u.full_name),
          safe(u.email),
          safe(u.department),
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
            <span className="font-medium text-gray-900">{totalUsers}</span>{" "}
            result{totalUsers === 1 ? "" : "s"}
            {searchQuery ||
            filters.status !== "all" ||
            filters.department !== "all"
              ? " (filtered)"
              : ""}
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
            {pageItems.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">
                      {user.full_name}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {user.department}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.modules.length > 0 ? (
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
                    {user.roles.length > 0 ? (
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
                  <UserActionMenu user={user as any} />
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
