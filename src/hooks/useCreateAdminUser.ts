import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCreateAdminUser = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('create-admin-user');
      
      if (error) {
        throw new Error(`Failed to create admin user: ${error.message}`);
      }
      
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Super Admin User Created",
        description: `User ${data.email} created successfully with full access. You can now login with password: Circuit2025$`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};