// src/components/users/roles/mock/roles.ts

export type RoleType = 'system' | 'client';
export type SystemRoleId = 'super-admin' | 'support-admin' | 'billing-admin';
export type ClientRoleId = 'client-admin' | 'client-user' | 'client-viewer';

/** CRUD granularity used in permissions matrix */
export type Crud = 'create' | 'read' | 'update' | 'delete';

/** Permission matrix keyed by module -> CRUD flags */
export type PermissionMatrix = {
  [moduleKey: string]: { [C in Crud]: boolean }
};

/** All app modules (used by RolePermissionsDialog) */
export const MODULES = [
  { key: 'users',          label: 'Users' },
  { key: 'roles',          label: 'Roles & Permissions' },
  { key: 'subscriptions',  label: 'Subscriptions & Billing' },
  { key: 'announcements',  label: 'Announcements' },
  { key: 'inventory',      label: 'Inventory' },
  { key: 'accounting',     label: 'Accounting' },
  { key: 'reports',        label: 'Reports' },
];

export interface RoleMeta {
  id: string;         // unique id (string)
  name: string;       // display name
  description: string;
  members: number;    // mock count
  type: RoleType;     // system | client
}

/** Seed data (built-in roles) */
export const SYSTEM_ROLES_SEED: RoleMeta[] = [
  { id: 'super-admin',   name: 'Super Admin',    description: 'Full System Access',              members: 3,  type: 'system' },
  { id: 'support-admin', name: 'Support Admin',  description: 'Customer Support Access',         members: 12, type: 'system' },
  { id: 'billing-admin', name: 'Billing Admin',  description: 'Billing And Payments',            members: 5,  type: 'system' },
];

export const CLIENT_ROLES_SEED: RoleMeta[] = [
  { id: 'client-admin',  name: 'Client Admin',   description: 'Full Client Organization Access', members: 45, type: 'client' },
  { id: 'client-user',   name: 'Client User',    description: 'Standard Client User Access',     members: 234,type: 'client' },
  { id: 'client-viewer', name: 'Client Viewer',  description: 'Read-Only Client Access',         members: 89, type: 'client' },
];

/** Back-compat aliases (in case any file still imports these names) */
export const SYSTEM_ROLES = SYSTEM_ROLES_SEED;
export const CLIENT_ROLES = CLIENT_ROLES_SEED;

/** Helper to generate a stable-ish mock id for new roles */
export const makeRoleId = (name: string, type: RoleType) =>
  `${type}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Math.random().toString(36).slice(2, 7)}`;
