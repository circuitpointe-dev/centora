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
      // Get current org for demo mode
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      const finalPayload = {
        ...payload,
        org_id: org?.id || payload.org_id
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