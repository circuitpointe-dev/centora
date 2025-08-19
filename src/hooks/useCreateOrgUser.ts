import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type CreateOrgUserInput = {
  org_id: string;
  email: string;
  full_name: string;
  department_id?: string | null;
  role_ids?: string[];
  access_json?: unknown;
};

export function useCreateOrgUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: CreateOrgUserInput) => {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No active session');
      }

      console.log('Creating user with payload:', input);

      // Call the Edge Function using Supabase client
      const { data, error: functionError } = await supabase.functions.invoke('admin-create-org-user', {
        body: input,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Failed to call function');
      }

      console.log('User creation result:', data);
      return data;
    },

    onSuccess: async (data) => {
      toast({
        title: 'Success',
        description: `User ${data.email} has been created successfully`,
      });

      // Invalidate relevant queries to refresh the UI
      await Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: ["users"] }),
        queryClient.invalidateQueries({ queryKey: ["org-users"] }),
        queryClient.invalidateQueries({ queryKey: ["org-users-count"] }),
        queryClient.invalidateQueries({ queryKey: ["user-stats"] }),
      ]);
    },

    onError: (error: Error) => {
      console.error('User creation failed:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create user',
        variant: 'destructive',
      });
    },
  });
}