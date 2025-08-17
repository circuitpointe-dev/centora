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
import { Users } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  modules: string[];
  roles: string[];
  status: 'active' | 'inactive' | 'deactivated';
  lastActive: string;
  joinedDate: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    modules: ['Fundraising', 'Grants', 'Documents'],
    roles: ['Admin', 'Editor'],
    status: 'active',
    lastActive: '2 hours ago',
    joinedDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    modules: ['Documents', 'User Management'],
    roles: ['Admin'],
    status: 'active',
    lastActive: '1 day ago',
    joinedDate: '2024-02-20',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    modules: ['Fundraising'],
    roles: ['Editor', 'Viewer'],
    status: 'inactive',
    lastActive: '1 week ago',
    joinedDate: '2024-03-10',
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    modules: ['Grants', 'Documents', 'Fundraising', 'User Management'],
    roles: ['Super Admin'],
    status: 'active',
    lastActive: '30 minutes ago',
    joinedDate: '2023-11-05',
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@example.com',
    modules: ['Documents'],
    roles: ['Viewer'],
    status: 'deactivated',
    lastActive: '2 weeks ago',
    joinedDate: '2024-01-30',
  },
];

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

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUsers = filteredUsers.length;
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = Math.min(startIndex + usersPerPage, totalUsers);
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handleAddUser = () => {
    // Placeholder for add user functionality
    console.log('Add new user');
  };

  if (filteredUsers.length === 0 && searchQuery === '') {
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

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="text-gray-600 font-medium">Name</TableHead>
              <TableHead className="text-gray-600 font-medium">Modules</TableHead>
              <TableHead className="text-gray-600 font-medium">Role</TableHead>
              <TableHead className="text-gray-600 font-medium">Status</TableHead>
              <TableHead className="text-gray-600 font-medium w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">
                      {user.modules[0]}
                    </span>
                    {user.modules.length > 1 && (
                      <Badge variant="outline" className="text-xs">
                        +{user.modules.length - 1} more
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">
                      {user.roles[0]}
                    </span>
                    {user.roles.length > 1 && (
                      <Badge variant="outline" className="text-xs">
                        +{user.roles.length - 1} more
                      </Badge>
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