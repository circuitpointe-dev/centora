// src/components/roles/RoleMembersTable.tsx

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { UserTablePagination } from '@/components/users/users/UserTablePagination';
import type { RoleUser } from '@/types/roles-permission';

export type RoleUserFilters = {
  status: "all" | "active" | "inactive" | "deactivated";
  department: "all" | string;
};

interface RoleMembersTableProps {
  users: RoleUser[];
}

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

export const RoleMembersTable: React.FC<RoleMembersTableProps> = ({ users }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<RoleUserFilters>({
    status: "all",
    department: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const usersPerPage = 10;

  const departments = useMemo(
    () => Array.from(new Set(users.map((u) => u.department))).sort(),
    [users]
  );

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return users
      .filter((user) => {
        if (filters.status !== "all" && user.status !== filters.status)
          return false;
        if (filters.department !== "all" && user.department !== filters.department)
          return false;
        return true;
      })
      .filter((user) => {
        if (!query) return true;
        return (
          user.full_name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.department.toLowerCase().includes(query)
        );
      });
  }, [users, filters, searchQuery]);

  const totalUsers = filteredUsers.length;
  const startIndex = (currentPage - 1) * usersPerPage;
  const pageItems = filteredUsers.slice(startIndex, startIndex + usersPerPage);
  const endIndex = Math.min(startIndex + usersPerPage, totalUsers);

  // Reset page when search or filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilters({ status: "all", department: "all" });
    setCurrentPage(1);
    setFilterOpen(false);
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No members in this role for this feature yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-brand-purple hover:text-brand-purple-foreground hover:border-brand-purple"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(v) => setFilters({ ...filters, status: v as RoleUserFilters["status"] })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="deactivated">Deactivated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Department</Label>
                <Select
                  value={filters.department}
                  onValueChange={(v) => setFilters({ ...filters, department: v as RoleUserFilters["department"] })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="hover:bg-brand-purple hover:text-brand-purple-foreground hover:border-brand-purple"
                  onClick={handleResetFilters}
                >
                  Reset
                </Button>
                <Button
                  type="button"
                  className="bg-brand-purple hover:bg-brand-purple/90 text-brand-purple-foreground"
                  onClick={() => setFilterOpen(false)}
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Results info */}
      <div className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-medium text-gray-900">{totalUsers}</span>{" "}
        member{totalUsers === 1 ? "" : "s"}
        {searchQuery || filters.status !== "all" || filters.department !== "all" ? " (filtered)" : ""}
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="text-gray-600 font-medium">Name</TableHead>
              <TableHead className="text-gray-600 font-medium">Email</TableHead>
              <TableHead className="text-gray-600 font-medium">Department</TableHead>
              <TableHead className="text-gray-600 font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="font-medium text-gray-900">{user.full_name}</div>
                </TableCell>
                <TableCell>
                  <div className="text-gray-600">{user.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {user.department}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(user.status)} border-0 capitalize`}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalUsers > usersPerPage && (
        <UserTablePagination
          currentPage={currentPage}
          totalItems={totalUsers}
          itemsPerPage={usersPerPage}
          startIndex={startIndex + 1}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};