// src/components/users/UserDirectoryTable.tsx

import React, { useState } from 'react';
import { UserTableToolbar } from './UserTableToolbar';
import { UserTablePagination } from './UserTablePagination';
import { UserActionMenu } from './UserActionMenu';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users, Loader2 } from 'lucide-react';
import { useOrgUsers, useOrgUsersCount } from '@/hooks/useOrgUsers';

interface User {
  id: string;
  full_name: string;
  email: string;
  status: 'active' | 'inactive' | 'deactivated';
  department: string;
  modules: string[];
  roles: string[];
}


const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'inactive':
      return 'secondary';
    case 'deactivated':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-50';
    case 'inactive':
      return 'text-orange-600 bg-orange-50';
    case 'deactivated':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const UserDirectoryTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  // Fetch users and count from backend
  const { data: users = [], isLoading: usersLoading, error: usersError } = useOrgUsers({
    search: searchQuery || undefined,
    page: currentPage,
    pageSize: usersPerPage,
  });

  const { data: totalUsers = 0, isLoading: countLoading } = useOrgUsersCount(searchQuery || undefined);

  const isLoading = usersLoading || countLoading;
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = Math.min(startIndex + usersPerPage, totalUsers);

  const handleAddUser = () => {
    console.log('Add new user');
  };

  if (usersError) {
    return (
      <div className="space-y-6">
        <UserTableToolbar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddUser={handleAddUser}
        />
        <div className="text-center py-8">
          <p className="text-red-600">Failed to load users</p>
        </div>
      </div>
    );
  }

  if (users.length === 0 && searchQuery === '' && !isLoading) {
    return (
      <div className="space-y-6">
        <UserTableToolbar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddUser={handleAddUser}
        />
        <EmptyState
          icon={Users}
          title="No users found"
          description="Get started by adding your first team member to the system."
          action={{
            label: "+ Add New User",
            onClick: handleAddUser,
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserTableToolbar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddUser={handleAddUser}
      />

      {isLoading ? (
        <div className="border rounded-lg">
          <div className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
            <p className="mt-4 text-gray-500">Loading users...</p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-gray-600 font-medium">Name</TableHead>
                <TableHead className="text-gray-600 font-medium">Department</TableHead>
                <TableHead className="text-gray-600 font-medium">Modules</TableHead>
                <TableHead className="text-gray-600 font-medium">Roles</TableHead>
                <TableHead className="text-gray-600 font-medium">Status</TableHead>
                <TableHead className="text-gray-600 font-medium w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{user.full_name}</div>
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
                      className={`${getStatusColor(user.status)} border-0 capitalize`}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <UserActionMenu user={user} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!isLoading && (
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