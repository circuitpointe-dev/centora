import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Types for the User Management system
export interface User {
  id: string;
  email: string;
  full_name: string;
  status: 'active' | 'inactive' | 'deactivated';
  department: string;
  roles: string[];
  modules: string[];
  last_active: string | null;
  created_at: string;
  avatar_url?: string;
}

export interface UserStats {
  active_users: number;
  inactive_users: number; 
  deactivated_users: number;
  pending_invitations: number;
}

export interface CreateUserData {
  email: string;
  full_name: string;
  department_id?: string;
  role_ids: string[];
  access_json?: Record<string, any>;
}

export interface UpdateUserData {
  full_name?: string;
  department_id?: string;
  status?: 'active' | 'inactive' | 'deactivated';
}

// Hook to get user statistics
export const useUserStats = () => {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_stats');
      
      if (error) {
        throw new Error(`Failed to fetch user stats: ${error.message}`);
      }
      
      return data[0] as UserStats;
    },
  });
};

// Hook to get paginated users list
export const useUsers = ({ 
  search, 
  department, 
  status, 
  page = 1, 
  pageSize = 8 
}: {
  search?: string;
  department?: string;
  status?: string;
  page?: number;
  pageSize?: number;
} = {}) => {
  return useQuery({
    queryKey: ['org-users', search, department, status, page, pageSize],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('list_org_users', {
        _search: search || null,
        _status: status || null,
        _department: department || null,
        _page: page,
        _page_size: pageSize,
      });
      
      if (error) {
        throw new Error(`Failed to fetch users: ${error.message}`);
      }
      
      return data as User[];
    },
  });
};

// Hook to get users count (for pagination)
export const useUsersCount = (search?: string, department?: string, status?: string) => {
  return useQuery({
    queryKey: ['org-users-count', search, department, status],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('count_org_users', {
        _search: search || null,
        _status: status || null,
        _department: department || null,
      });
      
      if (error) {
        throw new Error(`Failed to count users: ${error.message}`);
      }
      
      return data as number;
    },
  });
};

// Hook to create user invitation
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userData: CreateUserData) => {
      const { data, error } = await supabase.rpc('create_user_invitation', {
        _email: userData.email,
        _full_name: userData.full_name,
        _department_id: userData.department_id || null,
        _role_ids: userData.role_ids,
        _access: userData.access_json || null,
      });
      
      if (error) {
        throw new Error(`Failed to create user: ${error.message}`);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-users'] });
      queryClient.invalidateQueries({ queryKey: ['org-users-count'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      toast({
        title: 'User invited',
        description: 'The user invitation has been sent successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating user',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Hook to update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: UpdateUserData }) => {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userId);
      
      if (error) {
        throw new Error(`Failed to update user: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-users'] });
      queryClient.invalidateQueries({ queryKey: ['org-users-count'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      toast({
        title: 'User updated',
        description: 'The user has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating user',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Hook to update user status (activate/suspend)
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      status, 
      reason 
    }: { 
      userId: string; 
      status: 'active' | 'inactive' | 'deactivated';
      reason?: string;
    }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', userId);
      
      if (error) {
        throw new Error(`Failed to update user status: ${error.message}`);
      }
      
      // TODO: Add audit log entry for status change
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['org-users'] });
      queryClient.invalidateQueries({ queryKey: ['org-users-count'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      toast({
        title: 'User status updated',
        description: `User has been ${variables.status === 'active' ? 'activated' : 'deactivated'}.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Hook to assign roles to user
export const useAssignUserRoles = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, roleIds }: { userId: string; roleIds: string[] }) => {
      // First, delete existing role assignments
      await supabase.from('user_roles').delete().eq('profile_id', userId);
      
      // Then, insert new role assignments
      if (roleIds.length > 0) {
        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase
          .from('user_roles')
          .insert(
            roleIds.map(roleId => ({
              profile_id: userId,
              role_id: roleId,
              assigned_by: user?.id || '',
            }))
          );
        
        if (error) {
          throw new Error(`Failed to assign roles: ${error.message}`);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-users'] });
      queryClient.invalidateQueries({ queryKey: ['org-users-count'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      toast({
        title: 'Roles updated',
        description: 'User roles have been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating roles',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Hook to get user permissions
export const useUserPermissions = (userId?: string) => {
  return useQuery({
    queryKey: ['user-permissions', userId],
    queryFn: async () => {
      if (!userId) return {};
      
      const { data, error } = await supabase.rpc('get_effective_permissions', {
        _profile_id: userId,
      });
      
      if (error) {
        throw new Error(`Failed to fetch user permissions: ${error.message}`);
      }
      
      return data || {};
    },
    enabled: !!userId,
  });
};