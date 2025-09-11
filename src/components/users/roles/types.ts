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
  name: string;
  email: string;
  avatar?: string;
}

export interface PermissionMatrix {
  [moduleKey: string]: {
    [featureKey: string]: Crud;
  };
}

export interface Crud {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export const MODULES = [
  { key: 'users', name: 'User Management' },
  { key: 'documents', name: 'Document Management' },
  { key: 'finance', name: 'Finance Management' },
  { key: 'grants', name: 'Grant Management' },
  { key: 'hr', name: 'HR Management' },
  { key: 'procurement', name: 'Procurement' },
  { key: 'inventory', name: 'Inventory Management' },
  { key: 'reports', name: 'Analytics & Reporting' },
];

export const ROLE_MEMBERS: Member[] = [];

export const CLIENT_ROLES_SEED: RoleMeta[] = [];
export const SYSTEM_ROLES_SEED: RoleMeta[] = [];

export const makeRoleId = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

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