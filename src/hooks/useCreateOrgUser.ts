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
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User created successfully. Default password: P@$$w0rd",
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
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