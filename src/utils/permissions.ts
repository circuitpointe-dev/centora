// src/utils/permissions.ts
export type Permission = 'create' | 'read' | 'update' | 'delete' | 'export' | 'upload';

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
