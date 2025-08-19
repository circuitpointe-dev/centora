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

      // Call the Edge Function
      const response = await fetch(
        `https://kspzfifdwfpirgqstzhz.supabase.co/functions/v1/admin-create-org-user`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('User creation result:', result);
      return result;
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