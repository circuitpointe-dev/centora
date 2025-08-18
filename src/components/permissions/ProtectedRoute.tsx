import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCurrentUserPermissions } from '@/hooks/usePermissions';
import { can } from '@/utils/permissions';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  moduleKey: string;
  featureId?: string;
  permission?: 'create' | 'read' | 'update' | 'delete' | 'export' | 'upload';
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  moduleKey,
  featureId,
  permission = 'read',
  fallback,
  redirectTo = '/dashboard',
}) => {
  const { data: permissions, isLoading } = useCurrentUserPermissions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!permissions || !can(permissions, moduleKey, featureId, permission)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};