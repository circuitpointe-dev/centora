import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Use the consolidated org users functionality
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

export interface UpdateUserData {
  full_name?: string;
  department_id?: string;
  status?: 'active' | 'inactive' | 'deactivated';
}

// Re-export consolidated hooks from useOrgUsers for compatibility
export { useOrgUsers as useUsers, useOrgUsersCount as useUsersCount } from './useOrgUsers';

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

// Hook to update user - using direct table update
export const useUpdateUser = () => {
  const { toast } = useToast();

  const mutateAsync = async ({ userId, data }: { userId: string; data: UpdateUserData }) => {
    const updateData: any = {};
    
    if (data.full_name !== undefined) updateData.full_name = data.full_name;
    if (data.status !== undefined) updateData.status = data.status;
    if ((data as any).department_id !== undefined) updateData.department_id = (data as any).department_id;
    
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);
    
    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    toast({
      title: 'User updated',
      description: 'The user has been updated successfully.',
    });
  };

  const mutate = (variables: { userId: string; data: UpdateUserData }, options?: { onSuccess?: () => void }) => {
    mutateAsync(variables).then(() => {
      options?.onSuccess?.();
    }).catch(error => {
      console.error('Update user error:', error);
    });
  };

  return {
    mutateAsync,
    mutate
  };
};

// Hook to update user status
export const useUpdateUserStatus = () => {
  const { toast } = useToast();

  const mutateAsync = async ({ 
    userId, 
    status 
  }: { 
    userId: string; 
    status: 'active' | 'inactive' | 'deactivated';
  }) => {
    const { error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', userId);
    
    if (error) {
      throw new Error(`Failed to update user status: ${error.message}`);
    }
    
    toast({
      title: 'User status updated',
      description: `User has been ${status === 'active' ? 'activated' : 'deactivated'}.`,
    });
  };

  const mutate = (variables: { userId: string; status: 'active' | 'inactive' | 'deactivated'; reason?: string }, options?: { onSuccess?: () => void }) => {
    mutateAsync(variables).then(() => {
      options?.onSuccess?.();
    }).catch(error => {
      console.error('Update user status error:', error);
    });
  };

  return {
    mutateAsync,
    mutate
  };
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