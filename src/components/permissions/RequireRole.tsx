import React from 'react';
import { useCurrentUserPermissions } from '@/hooks/usePermissions';
import { can } from '@/utils/permissions';
import { useRoles } from '@/hooks/useRoleManagement';

interface RequireRoleProps {
  children: React.ReactNode;
  roles: string[]; // Role names like 'Admin', 'Contributor', 'Viewer', 'Custom'
  fallback?: React.ReactNode;
  showLoading?: boolean;
}

export const RequireRole: React.FC<RequireRoleProps> = ({
  children,
  roles,
  fallback = null,
  showLoading = false,
}) => {
  const { data: permissions, isLoading: permissionsLoading } = useCurrentUserPermissions();
  const { data: allRoles, isLoading: rolesLoading } = useRoles();

  const isLoading = permissionsLoading || rolesLoading;

  if (isLoading && showLoading) {
    return <>{fallback}</>;
  }

  if (!permissions || !allRoles) {
    return <>{fallback}</>;
  }

    // Check if user has any of the required roles
    const hasRequiredRole = roles.some(roleName => {
      // Find the role ID by name
      const role = allRoles.find(r => r.name === roleName);
      if (!role) return false;

      // Check if user has admin access to users module (indicates role membership)
      return can(permissions, 'users', 'user-accounts', 'delete') || 
             can(permissions, 'users', 'user-accounts', 'update') ||
             can(permissions, 'users', 'user-accounts', 'read');
    });

  if (!hasRequiredRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Convenience components for specific roles
export const RequireAdmin: React.FC<Omit<RequireRoleProps, 'roles'>> = (props) => (
  <RequireRole {...props} roles={['Admin']} />
);

export const RequireContributor: React.FC<Omit<RequireRoleProps, 'roles'>> = (props) => (
  <RequireRole {...props} roles={['Admin', 'Contributor']} />
);

export const RequireViewer: React.FC<Omit<RequireRoleProps, 'roles'>> = (props) => (
  <RequireRole {...props} roles={['Admin', 'Contributor', 'Viewer']} />
);