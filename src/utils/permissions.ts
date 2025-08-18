// src/utils/permissions.ts
import type { PermissionMap } from '@/hooks/usePermissions';

export type Permission = 'create' | 'read' | 'update' | 'delete' | 'export' | 'upload';

/**
 * Check if user has specific permission for a module/feature
 */
export function can(
  permissions: PermissionMap,
  moduleKey: string,
  featureId?: string,
  action: Permission = 'read'
): boolean {
  // Check if module exists and has access
  const modulePerms = permissions[moduleKey];
  if (!modulePerms || !modulePerms._module) {
    return false;
  }
  
  // If no specific feature requested, just check module access
  if (!featureId) {
    return true;
  }
  
  // Check feature-specific permissions
  const featurePerms = modulePerms[featureId];
  if (!featurePerms || typeof featurePerms === 'boolean') {
    return false;
  }
  
  // Check if user has the required permission
  return (featurePerms as string[]).includes(action);
}

/**
 * Check if user has any access to a module
 */
export function canAccessModule(permissions: PermissionMap, moduleKey: string): boolean {
  return can(permissions, moduleKey);
}

/**
 * Check if user has admin permissions for a feature
 */
export function canAdmin(permissions: PermissionMap, moduleKey: string, featureId?: string): boolean {
  return can(permissions, moduleKey, featureId, 'delete') && 
         can(permissions, moduleKey, featureId, 'create') && 
         can(permissions, moduleKey, featureId, 'update');
}

/**
 * Permission labels for UI display
 */
export const PERMISSION_LABELS: Record<Permission, string> = {
  create: 'Create',
  read: 'Read',
  update: 'Update',
  delete: 'Delete',
  export: 'Export',
  upload: 'Upload',
};

/**
 * Return the list of permissions to show for a given module/feature.
 * Defaults to full CRUD + export + upload, with some common-sense overrides.
 */
export function featurePermissions(moduleKey: string, featureId: string): Permission[] {
  // very limited features
  const READ_ONLY_FEATURES = new Set([
    'dashboard',
    'compliance',
    'grants-archive',
  ]);

  // features that typically allow read + export
  const READ_EXPORT_FEATURES = new Set([
    'reports-submissions',
    'grantee-submissions',
    'templates',
  ]);

  if (READ_ONLY_FEATURES.has(featureId)) {
    return ['read'];
  }
  if (READ_EXPORT_FEATURES.has(featureId)) {
    return ['read', 'export'];
  }

  // module-specific tweaks (extend as you refine your model)
  switch (moduleKey) {
    case 'documents':
      if (featureId === 'e-signature') {
        return ['create', 'read', 'update'];
      }
      if (featureId === 'documents') {
        return ['create', 'read', 'update', 'delete', 'upload'];
      }
      break;
    case 'grants':
      if (featureId === 'reports-submissions') {
        return ['read', 'update', 'export'];
      }
      break;
    default:
      break;
  }

  // default full set
  return ['create', 'read', 'update', 'delete', 'export', 'upload'];
}
