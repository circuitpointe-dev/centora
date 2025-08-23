// src/components/roles/RolesPermissionPage.tsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { RoleCardsRow } from './RoleCardsRow';
import { ModuleAccordion } from './ModuleAccordion';
import { roles, modules } from './mock/roles-permission.data';

export const RolesPermissionPage: React.FC = () => {
  const [selectedRoleId, setSelectedRoleId] = useState('admin');

  const handleCreateNewRole = () => {
    console.log('create-new-role');
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Roles & Permission</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage user roles and permissions across your organization's modules and features.
          </p>
        </div>
        <Button onClick={handleCreateNewRole}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Role
        </Button>
      </div>

      {/* Role Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Select Role</h2>
        <RoleCardsRow
          roles={roles}
          selectedRoleId={selectedRoleId}
          onSelect={setSelectedRoleId}
        />
      </div>

      {/* Module Features Accordion */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-medium text-gray-900">
            Module Features & Members
          </h2>
          <div className="text-sm text-gray-500">
            Showing members with <span className="font-medium capitalize">{roles.find(r => r.id === selectedRoleId)?.name}</span> role
          </div>
        </div>
        <ModuleAccordion
          modules={modules}
          selectedRoleId={selectedRoleId}
        />
      </div>
    </div>
  );
};