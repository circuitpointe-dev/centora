import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Types for role requests
export interface RoleRequest {
  id: string;
  requested_role: string;
  modules: string[];
  requester: {
    id: string;
    full_name: string;
    email: string;
  };
  submitted: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface CreateRoleRequestData {
  requested_role: string;
  modules: string[];
  message?: string;
}

// Hook to get role requests with pagination and filtering
export const useRoleRequests = ({
  search,
  status,
  page = 1,
  pageSize = 8,
}: {
  search?: string;
  status?: 'pending' | 'accepted' | 'rejected';
  page?: number;
  pageSize?: number;
} = {}) => {
  return useQuery({
    queryKey: ['role-requests', search, status, page, pageSize],
    queryFn: async () => {
      let query = supabase
        .from('user_invitations')
        .select(`
          id,
          email,
          full_name,
          role_ids,
          status,
          created_at,
          expires_at
        `)
        .eq('status', 'pending');

      if (search) {
        query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
      }

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) {
        throw new Error(`Failed to fetch role requests: ${error.message}`);
      }

      return data || [];
    },
  });
};

// Hook to create a new role request
export const useCreateRoleRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (requestData: CreateRoleRequestData) => {
      // For now, create a user invitation as a role request
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get user's profile to get org info
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id, full_name, email')
        .eq('id', user.id)
        .single();

      if (!profile) {
        throw new Error('User profile not found');
      }

      // Create the role request as an invitation record
      const { data, error } = await supabase.rpc('create_user_invitation', {
        _email: profile.email,
        _full_name: profile.full_name || 'User',
        _department_id: null,
        _role_ids: [], // Will be filled when approved
        _access: {
          requested_role: requestData.requested_role,
          modules: requestData.modules,
          message: requestData.message,
        },
      });

      if (error) {
        throw new Error(`Failed to create role request: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-requests'] });
      toast({
        title: 'Role request submitted',
        description: 'Your role request has been submitted for review.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error submitting request',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Hook to approve a role request
export const useApproveRoleRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      requestId, 
      roleIds 
    }: { 
      requestId: string; 
      roleIds: string[];
    }) => {
      // Update the invitation status and assign roles
      const { error } = await supabase
        .from('user_invitations')
        .update({
          status: 'accepted',
          role_ids: roleIds,
        })
        .eq('id', requestId);

      if (error) {
        throw new Error(`Failed to approve request: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-requests'] });
      toast({
        title: 'Request approved',
        description: 'The role request has been approved successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error approving request',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Hook to decline a role request
export const useDeclineRoleRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      requestId, 
      reason 
    }: { 
      requestId: string; 
      reason?: string;
    }) => {
      const { error } = await supabase
        .from('user_invitations')
        .update({
          status: 'rejected',
          // Could store reason in access field if needed
        })
        .eq('id', requestId);

      if (error) {
        throw new Error(`Failed to decline request: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-requests'] });
      toast({
        title: 'Request declined',
        description: 'The role request has been declined.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error declining request',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};