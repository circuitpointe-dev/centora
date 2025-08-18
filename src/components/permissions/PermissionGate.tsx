import React from 'react';
import { useCurrentUserPermissions } from '@/hooks/usePermissions';
import { can } from '@/utils/permissions';

interface PermissionGateProps {
  children: React.ReactNode;
  moduleKey: string;
  featureId?: string;
  permission?: 'create' | 'read' | 'update' | 'delete' | 'export' | 'upload';
  fallback?: React.ReactNode;
  showLoading?: boolean;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  moduleKey,
  featureId,
  permission = 'read',
  fallback = null,
  showLoading = false,
}) => {
  const { data: permissions, isLoading } = useCurrentUserPermissions();

  if (isLoading && showLoading) {
    return <>{fallback}</>;
  }

  if (!permissions || !can(permissions, moduleKey, featureId, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};