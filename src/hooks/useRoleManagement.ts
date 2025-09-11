import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Types for role management
export interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
  members_count?: number;
  avatar_preview?: string[];
}

export interface RolePermission {
  role_id: string;
  module_key: string;
  feature_id: string;
  permissions: string[];
}

export interface RoleWithMembers extends Role {
  members: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  }[];
}

// Hook to get all roles for the current organization
export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_roles');
      
      if (error) {
        throw new Error(`Failed to fetch roles: ${error.message}`);
      }

      return data as Role[];
    },
  });
};

// Hook to get role with members and permissions
export const useRoleDetails = (roleId?: string) => {
  return useQuery({
    queryKey: ['role-details', roleId],
    queryFn: async () => {
      if (!roleId) return null;

      // Get role basic info
      const { data: role, error: roleError } = await supabase
        .from('roles')
        .select('*')
        .eq('id', roleId)
        .single();

      if (roleError) {
        throw new Error(`Failed to fetch role: ${roleError.message}`);
      }

      // Get role members
      const { data: members, error: membersError } = await supabase
        .from('user_roles')
        .select(`
          profiles!inner(
            id,
            full_name,
            email
          )
        `)
        .eq('role_id', roleId);

      if (membersError) {
        throw new Error(`Failed to fetch role members: ${membersError.message}`);
      }

      // Get role permissions
      const { data: permissions, error: permissionsError } = await supabase
        .from('role_permissions')
        .select('*')
        .eq('role_id', roleId);

      if (permissionsError) {
        throw new Error(`Failed to fetch role permissions: ${permissionsError.message}`);
      }

      return {
        ...role,
        members: members?.map(m => m.profiles).filter(Boolean) || [],
        permissions: permissions || [],
      };
    },
    enabled: !!roleId,
  });
};

// Hook to create a new role
export const useCreateRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      const { data, error } = await supabase.rpc('create_role', {
        _name: name,
        _description: description || null,
      });
      
      if (error) {
        throw new Error(`Failed to create role: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: 'Role created',
        description: 'The new role has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating role',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Hook to update role permissions
export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      roleId, 
      permissions 
    }: { 
      roleId: string; 
      permissions: Array<{
        module_key: string;
        feature_id: string;
        permissions: string[];
      }>;
    }) => {
      // First, delete existing permissions for this role
      await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', roleId);

      // Insert new permissions
      if (permissions.length > 0) {
        const { data: { user } } = await supabase.auth.getUser();
        const { data: profile } = await supabase
          .from('profiles')
          .select('org_id')
          .eq('id', user?.id || '')
          .single();

        if (!profile?.org_id) {
          throw new Error('User organization not found');
        }

        const { error } = await supabase
          .from('role_permissions')
          .insert(
            permissions.map(perm => ({
              org_id: profile.org_id,
              role_id: roleId,
              module_key: perm.module_key,
              feature_id: perm.feature_id,
              permissions: perm.permissions as ('read' | 'write' | 'admin')[],
            }))
          );

        if (error) {
          throw new Error(`Failed to update permissions: ${error.message}`);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-details'] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: 'Permissions updated',
        description: 'Role permissions have been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating permissions',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Hook to get organization modules and features
export const useOrgModulesWithFeatures = () => {
  return useQuery({
    queryKey: ['org-modules-with-features'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_org_modules_with_features');
      if (error) {
        console.error('get_org_modules_with_features error:', error);
        throw new Error(error.message);
      }
      return (data || []).map((module: any) => ({
        module: module.module,
        module_name: module.module_name,
        features: module.features || [],
      }));
    },
  });
};

// Hook to get role statistics (members count, etc.)
export const useRoleStats = () => {
  return useQuery({
    queryKey: ['role-stats'],
    queryFn: async () => {
      // Get roles with member counts
      const { data: roles, error } = await supabase
        .from('roles')
        .select(`
          id,
          name,
          description,
          user_roles(count)
        `);

      if (error) {
        throw new Error(`Failed to fetch role stats: ${error.message}`);
      }

      return roles?.map(role => ({
        ...role,
        members_count: role.user_roles?.[0]?.count || 0,
      })) || [];
    },
  });
};