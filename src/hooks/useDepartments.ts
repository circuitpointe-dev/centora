import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Department {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_departments');
      
      if (error) {
        throw new Error(`Failed to fetch departments: ${error.message}`);
      }

      return data as Department[];
    },
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      const { data, error } = await supabase.rpc('create_department', {
        _name: name,
        _description: description || null,
      });
      
      if (error) {
        throw new Error(`Failed to create department: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast({
        title: 'Department created',
        description: 'The new department has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating department',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};