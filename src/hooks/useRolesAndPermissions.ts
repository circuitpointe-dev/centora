import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SystemRole {
  id: string;
  name: string;
  description: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClientRole {
  id: string;
  org_id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface RoleMeta {
  id: string;
  name: string;
  description: string;
  members: number;
  type: 'system' | 'client';
}

export interface RoleMember {
  id: string;
  fullName: string;
  email: string;
  status: 'Active' | 'Suspended';
  avatar?: string;
}

export interface PermissionMatrix {
  [moduleKey: string]: Record<'create' | 'read' | 'update' | 'delete', boolean>;
}

// Hook to get system roles
export const useSystemRoles = () => {
  return useQuery({
    queryKey: ['system-roles'],
    queryFn: async (): Promise<RoleMeta[]> => {
      const { data, error } = await supabase
        .from('system_roles')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      return (data || []).map((role: any) => ({
        id: role.id,
        name: role.name,
        description: role.description || '',
        members: 0, // TODO: Count actual members
        type: 'system' as const
      }));
    },
  });
};

// Hook to get client roles
export const useClientRoles = () => {
  return useQuery({
    queryKey: ['client-roles'],
    queryFn: async (): Promise<RoleMeta[]> => {
      const { data, error } = await supabase
        .from('client_roles')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      return (data || []).map((role: any) => ({
        id: role.id,
        name: role.name,
        description: role.description || '',
        members: 0, // TODO: Count actual members
        type: 'client' as const
      }));
    },
  });
};

// Hook to get role members
export const useRoleMembers = (roleId: string | null, roleType: 'system' | 'client' | null) => {
  return useQuery({
    queryKey: ['role-members', roleId, roleType],
    queryFn: async (): Promise<RoleMember[]> => {
      if (!roleId || !roleType) return [];

      // Get users assigned to this role through user_roles table
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          profiles:profile_id (
            id,
            full_name,
            email,
            status
          )
        `)
        .eq('role_id', roleId);

      if (error) throw error;

      return (data || []).map((item: any) => ({
        id: item.profiles.id,
        fullName: item.profiles.full_name || item.profiles.email,
        email: item.profiles.email,
        status: item.profiles.status === 'active' ? 'Active' : 'Suspended',
      }));
    },
    enabled: !!roleId && !!roleType,
  });
};

// Hook to create system role
export const useCreateSystemRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roleData: { name: string; description?: string }) => {
      const { data, error } = await supabase
        .from('system_roles')
        .insert({
          name: roleData.name,
          description: roleData.description,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-roles'] });
      toast.success('System role created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create system role: ${error.message}`);
    },
  });
};

// Hook to create client role
export const useCreateClientRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roleData: { name: string; description?: string }) => {
      const { data, error } = await supabase
        .from('client_roles')
        .insert({
          name: roleData.name,
          description: roleData.description,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-roles'] });
      toast.success('Client role created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create client role: ${error.message}`);
    },
  });
};

// Hook to update system role
export const useUpdateSystemRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; name: string; description?: string }) => {
      const { data, error } = await supabase
        .from('system_roles')
        .update({
          name: params.name,
          description: params.description,
        })
        .eq('id', params.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-roles'] });
      toast.success('System role updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update system role: ${error.message}`);
    },
  });
};

// Hook to update client role
export const useUpdateClientRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; name: string; description?: string }) => {
      const { data, error } = await supabase
        .from('client_roles')
        .update({
          name: params.name,
          description: params.description,
        })
        .eq('id', params.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-roles'] });
      toast.success('Client role updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update client role: ${error.message}`);
    },
  });
};

// Hook to delete system role
export const useDeleteSystemRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('system_roles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-roles'] });
      toast.success('System role deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete system role: ${error.message}`);
    },
  });
};

// Hook to delete client role
export const useDeleteClientRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('client_roles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-roles'] });
      toast.success('Client role deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete client role: ${error.message}`);
    },
  });
};

// Hook to assign user to role
export const useAssignUserToRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { userId: string; roleId: string; orgId?: string }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          profile_id: params.userId,
          role_id: params.roleId,
          org_id: params.orgId,
          assigned_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-members'] });
      toast.success('User assigned to role successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to assign user to role: ${error.message}`);
    },
  });
};

// Hook to remove user from role
export const useRemoveUserFromRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { userId: string; roleId: string }) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('profile_id', params.userId)
        .eq('role_id', params.roleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-members'] });
      toast.success('User removed from role successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to remove user from role: ${error.message}`);
    },
  });
};