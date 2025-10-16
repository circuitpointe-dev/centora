import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useApprovalMatrix(params: { page: number; limit: number; search?: string; filters?: { entityType?: string; status?: string } }) {
  const { page, limit, search, filters } = params;
  return useQuery({
    queryKey: ["approval-matrix", page, limit, search, filters?.entityType, filters?.status],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
      const orgId = profile?.org_id;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      let query = (supabase as any)
        .from("procurement_approval_rules")
        .select("id, rule_code, entity_type, condition, approver_sequence, escalation_sla, status, updated_at", { count: "exact" })
        .eq("org_id", orgId)
        .order("updated_at", { ascending: false })
        .range(from, to);
      if (search) query = query.ilike("rule_code", `%${search}%`);
      if (filters?.entityType) query = query.eq("entity_type", filters.entityType);
      if (filters?.status) query = query.eq("status", filters.status);
      const { data, error, count } = await query;
      if (error) throw error;
      return { rules: data || [], total: count || 0 };
    }
  });
}

export function useCreateApprovalRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { rule_code: string; entity_type: string; condition?: string; approver_sequence?: string[]; escalation_sla?: string; status?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
      const orgId = profile?.org_id;
      const { error } = await (supabase as any)
        .from('procurement_approval_rules')
        .insert({ ...payload, org_id: orgId });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["approval-matrix"] });
    }
  });
}

export function useUpdateApprovalRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<{ rule_code: string; entity_type: string; condition?: string; approver_sequence?: string[]; escalation_sla?: string; status?: string }> }) => {
      const { error } = await (supabase as any)
        .from('procurement_approval_rules')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["approval-matrix"] });
    }
  });
}

export function useDeleteApprovalRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from('procurement_approval_rules')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["approval-matrix"] });
    }
  });
}
