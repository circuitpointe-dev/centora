import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { SuperAdminUser, SuperAdminRole } from '@/components/users/super-admin/types';

// Hook to get super admin users from backend
export const useSuperAdminUsers = (search?: string) => {
  return useQuery({
    queryKey: ['super-admin-users', search],
    queryFn: async (): Promise<SuperAdminUser[]> => {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          role,
          status,
          updated_at,
          departments(name)
        `)
        .eq('is_super_admin', false) // Regular users, not super admin themselves
        .order('full_name', { ascending: true });

      if (search) {
        query = query.or(`full_name.ilike.%${search}%, email.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((user: any) => ({
        id: user.id,
        fullName: user.full_name || user.email,
        email: user.email,
        role: user.role as SuperAdminRole,
        lastLoginAt: user.updated_at, // Using updated_at as proxy for last login
        status: user.status === 'active' ? 'active' : 
                user.status === 'inactive' ? 'suspended' : 'pending',
      }));
    },
  });
};

// Hook to get user statistics
export const useSuperAdminStats = () => {
  return useQuery({
    queryKey: ['super-admin-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_stats');
      if (error) throw error;

      return {
        active: data?.[0]?.active_users || 0,
        suspended: data?.[0]?.inactive_users || 0,
        pending: data?.[0]?.pending_invitations || 0,
      };
    },
  });
};

// Hook to update user status
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      const { data, error } = await supabase.rpc('admin_update_user_status', {
        _profile_id: userId,
        _status: status,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['super-admin-stats'] });
      toast.success('User status updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update user status: ${error.message}`);
    },
  });
};

// Hook to update user information
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: {
      id: string;
      full_name?: string;
      department_id?: string;
      status?: string;
    }) => {
      const { data, error } = await supabase.rpc('admin_update_user', {
        _profile_id: userData.id,
        _full_name: userData.full_name,
        _department_id: userData.department_id,
        _status: userData.status,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-users'] });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update user: ${error.message}`);
    },
  });
};

// Hook to create new user invitation
export const useCreateUserInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: {
      email: string;
      full_name: string;
      department_id?: string;
      role_ids?: string[];
    }) => {
      const { data, error } = await supabase.rpc('create_user_invitation', {
        _email: userData.email,
        _full_name: userData.full_name,
        _department_id: userData.department_id,
        _role_ids: userData.role_ids || [],
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['super-admin-stats'] });
      toast.success('User invitation sent successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to send invitation: ${error.message}`);
    },
  });
};

// Hook to delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['super-admin-stats'] });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete user: ${error.message}`);
    },
  });
};