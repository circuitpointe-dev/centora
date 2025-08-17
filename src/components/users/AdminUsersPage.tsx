import React from 'react';
import { UserStatsCards } from './UserStatsCards';
import { UserDirectoryTable } from './UserDirectoryTable';

export const AdminUsersPage: React.FC = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Statistics Cards Section */}
      <UserStatsCards />
      
      {/* User Directory Table Section */}
      <UserDirectoryTable />
    </div>
  );
};