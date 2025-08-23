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
import { Search, Filter } from 'lucide-react';
import { UserTablePagination } from '@/components/users/users/UserTablePagination';
import type { RoleUser } from '@/types/roles-permission';

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
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return users;
    
    return users.filter(user =>
      user.full_name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.department.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  const totalUsers = filteredUsers.length;
  const startIndex = (currentPage - 1) * usersPerPage;
  const pageItems = filteredUsers.slice(startIndex, startIndex + usersPerPage);
  const endIndex = Math.min(startIndex + usersPerPage, totalUsers);

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
      <div className="flex items-center gap-3">
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
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-brand-purple hover:text-brand-purple-foreground hover:border-brand-purple"
          onClick={() => console.log('filter-users')}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Results info */}
      <div className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-medium text-gray-900">{totalUsers}</span>{" "}
        member{totalUsers === 1 ? "" : "s"}
        {searchQuery ? " (filtered)" : ""}
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