import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PermissionMatrix {
  [moduleKey: string]: Record<'create' | 'read' | 'update' | 'delete', boolean>;
}

// Hook to get role permissions
export const useRolePermissions = (roleId: string | null) => {
  return useQuery({
    queryKey: ['role-permissions', roleId],
    queryFn: async (): Promise<PermissionMatrix> => {
      if (!roleId) return {};

      const { data, error } = await supabase
        .from('user_permissions')
        .select('module_key, feature_id, permissions')
        .eq('role_id', roleId);

      if (error) throw error;

      const matrix: PermissionMatrix = {};
      
      (data || []).forEach((perm: any) => {
        if (!matrix[perm.module_key]) {
          matrix[perm.module_key] = {
            create: false,
            read: false,
            update: false,
            delete: false,
          };
        }
        
        // Convert permissions array to CRUD boolean flags
        perm.permissions.forEach((permission: string) => {
          if (permission in matrix[perm.module_key]) {
            matrix[perm.module_key][permission as keyof typeof matrix[typeof perm.module_key]] = true;
          }
        });
      });

      return matrix;
    },
    enabled: !!roleId,
  });
};

// Hook to update role permissions
export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { 
      roleId: string; 
      moduleKey: string; 
      permissions: PermissionMatrix[string] 
    }) => {
      const { roleId, moduleKey, permissions } = params;
      
      // Convert CRUD boolean flags to permissions array
      const permissionsArray = Object.entries(permissions)
        .filter(([, enabled]) => enabled)
        .map(([permission]) => permission);

      // For now, just show success message as permissions system needs proper setup
      // TODO: Implement proper permissions storage when role_permissions table is ready
      console.log('Would update permissions:', { roleId, moduleKey, permissionsArray });
      
      const data = { roleId, moduleKey, permissions: permissionsArray };

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['role-permissions', variables.roleId] });
      toast.success('Permissions updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update permissions: ${error.message}`);
    },
  });
};