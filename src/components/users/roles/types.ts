// src/components/users/roles/types.ts

export interface RoleMeta {
  id: string;
  name: string;
  description: string;
  members: number;
  type: RoleType;
}

export type RoleType = 'system' | 'client';

export interface Member {
  id: string;
  fullName: string;
  email: string;
  status: 'Active' | 'Suspended';
  avatar?: string;
}

export interface PermissionMatrix {
  [moduleKey: string]: Record<CrudAction, boolean>;
}

export type CrudAction = 'create' | 'read' | 'update' | 'delete';

export interface Crud {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export const MODULES = [
  { key: 'users', label: 'User Management', name: 'User Management' },
  { key: 'documents', label: 'Document Management', name: 'Document Management' },
  { key: 'finance', label: 'Finance Management', name: 'Finance Management' },
  { key: 'grants', label: 'Grant Management', name: 'Grant Management' },
  { key: 'hr', label: 'HR Management', name: 'HR Management' },
  { key: 'procurement', label: 'Procurement', name: 'Procurement' },
  { key: 'inventory', label: 'Inventory Management', name: 'Inventory Management' },
  { key: 'reports', label: 'Analytics & Reporting', name: 'Analytics & Reporting' },
];

export const makeRoleId = (name: string, type?: RoleType) => 
  `${type ? `${type}-` : ''}${name.toLowerCase().replace(/\s+/g, '-')}`;

export const modules = [
  { id: 'users', name: 'User Management', features: [] },
  { id: 'documents', name: 'Document Management', features: [] },
  { id: 'finance', name: 'Finance Management', features: [] },
  { id: 'grants', name: 'Grant Management', features: [] },
  { id: 'hr', name: 'HR Management', features: [] },
  { id: 'procurement', name: 'Procurement', features: [] },
  { id: 'inventory', name: 'Inventory Management', features: [] },
  { id: 'reports', name: 'Analytics & Reporting', features: [] },
];

export const roleMemberships = {};