import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateInvitationParams {
  email: string;
  full_name: string;
  department_id?: string;
  role_ids?: string[];
  access?: any;
}

interface CreateUserImmediatelyParams {
  org_id: string;
  email: string;
  full_name: string;
  department_id?: string;
  role_ids?: string[];
  access?: any;
}

export const useCreateInvitation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ email, full_name, department_id, role_ids = [], access }: CreateInvitationParams) => {
      const { data, error } = await supabase.rpc('create_user_invitation', {
        _email: email,
        _full_name: full_name,
        _department_id: department_id || null,
        _role_ids: role_ids,
        _access: access || null,
      });
      
      if (error) {
        throw new Error(`Failed to create invitation: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      queryClient.invalidateQueries({ queryKey: ['org-users'] });
      toast({
        title: 'Invitation sent',
        description: 'The user invitation has been sent successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error sending invitation',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useAcceptInvitation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (token: string) => {
      const { data, error } = await supabase.rpc('accept_invitation', {
        _token: token,
      });
      
      if (error) {
        throw new Error(`Failed to accept invitation: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Invitation accepted',
        description: 'Welcome! Your account has been set up successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error accepting invitation',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useCreateUserImmediately = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ org_id, email, full_name, department_id, role_ids = [], access }: CreateUserImmediatelyParams) => {
      const { data, error } = await supabase.functions.invoke('create-user-immediately', {
        body: {
          org_id,
          email,
          full_name,
          department_id: department_id || null,
          role_ids,
          access: access || {},
        },
      });
      
      if (error) {
        throw new Error(`Failed to create user: ${error.message}`);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      queryClient.invalidateQueries({ queryKey: ['org-users'] });
      toast({
        title: 'User created successfully',
        description: 'The user account has been created and is ready to use with default password "P@$$w0rd".',
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