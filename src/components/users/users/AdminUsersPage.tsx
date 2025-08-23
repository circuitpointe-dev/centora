// src/components/users/AdminUsersPage.tsx

import React from 'react';
import { UserStatsCards } from './UserStatsCards';
import { UserDirectoryTable } from './UserDirectoryTable';
import { MockUsersProvider } from '@/components/users/users/mock/MockUsersProvider';

export const AdminUsersPage: React.FC = () => {
  return (
    <MockUsersProvider>
      <div className="p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-medium text-gray-900">Users Dashboard</h1>
        </div>

        <UserStatsCards />
        <UserDirectoryTable />
      </div>
    </MockUsersProvider>
  );
};
