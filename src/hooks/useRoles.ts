import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

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