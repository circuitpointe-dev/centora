// src/hooks/useCreateOrgUser.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreateUserPayload {
  org_id: string;
  email: string;
  full_name: string;
  department_id: string | null;
  role_ids: string[];
  access_json: Record<string, any>;
}

export const useCreateOrgUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      // Resolve organization id via RPC (handles demo/no-auth gracefully)
      const { data: orgIdData } = await supabase.rpc('current_org_id');
      const resolvedOrgId = (orgIdData as string | null) || payload.org_id || '';

      // Sanitize department_id: must be UUID, otherwise send null
      const isValidUuid = (s?: string | null) =>
        typeof s === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(s);

      const finalPayload = {
        ...payload,
        org_id: resolvedOrgId,
        department_id: isValidUuid(payload.department_id) ? payload.department_id : null,
      };

      const { data, error } = await supabase.functions.invoke('admin-create-org-user', {
        body: finalPayload,
      });

      if (error) throw error;
      if (!data) throw new Error('Failed to create user');

      return data;
    },
    onSuccess: (data) => {
      const password = data.temporary_password || 'Unknown';
      toast({
        title: "Success",
        description: `User created successfully. Temporary password: ${password}`,
        duration: 10000, // Show for 10 seconds so user can copy it
      });
      queryClient.invalidateQueries({ queryKey: ['org-users'] });
      queryClient.invalidateQueries({ queryKey: ['org-users-count'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error: any) => {
      // Handle different error types
      let errorMessage = error.message || 'An unexpected error occurred';
      let errorTitle = 'Error';

      // Parse edge function errors
      if (error.context?.res) {
        try {
          const errorData = JSON.parse(error.context.res);
          if (errorData.code === 'email_exists') {
            errorTitle = 'Email Already Exists';
            errorMessage = errorData.error;
          } else {
            errorMessage = errorData.error || errorMessage;
          }
        } catch (e) {
          // Fallback to original error message
        }
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};