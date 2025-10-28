import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function usePlanStats() {
    return useQuery({
        queryKey: ["plan-stats"],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;
            const { data, error } = await (supabase as any)
                .from("procurement_plans")
                .select("total_planned_spend, total_items, pending_items")
                .eq("org_id", orgId)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();
            if (error) throw error;
            return data || { total_planned_spend: 0, total_items: 0, pending_items: 0 };
        }
    });
}

export function usePlanItems(params: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = params;
    return useQuery({
        queryKey: ["plan-items", page, limit, search],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;
            const from = (page - 1) * limit;
            const to = from + limit - 1;
            let query = (supabase as any)
                .from("procurement_plan_items")
                .select("id, item, description, est_cost, budget_source, status, planned_date", { count: "exact" })
                .eq("org_id", orgId)
                .order("created_at", { ascending: true })
                .range(from, to);
            if (search) query = query.ilike("item", `%${search}%`);
            const { data, error, count } = await query;
            if (error) throw error;
            return { items: data || [], total: count || 0 };
        }
    });
}

export function useCreatePlanItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { item: string; description?: string; est_cost?: number; budget_source?: string; status?: string; planned_date?: string }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;
            if (!orgId) throw new Error('User organization not found');
            
            // Ensure a plan exists for this org and get its id
            let { data: plan } = await (supabase as any)
                .from('procurement_plans')
                .select('id')
                .eq('org_id', orgId)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();
            if (!plan) {
                const { data: newPlan, error: planErr } = await (supabase as any)
                    .from('procurement_plans')
                    .insert({ org_id: orgId, title: 'Default plan', total_planned_spend: 0, total_items: 0, pending_items: 0 })
                    .select('id')
                    .single();
                if (planErr) throw planErr;
                plan = newPlan;
            }
            
            const insertData = { 
                ...payload, 
                org_id: orgId, 
                plan_id: plan.id,
                created_by: user.id
            };
            
            const { error } = await (supabase as any).from("procurement_plan_items").insert(insertData);
            if (error) throw error;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["plan-items"] });
            qc.invalidateQueries({ queryKey: ["plan-stats"] });
        }
    });
}

export function useUpdatePlanItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<{ item: string; description?: string; est_cost?: number; budget_source?: string; status?: string; planned_date?: string }> }) => {
            const { error } = await (supabase as any)
                .from("procurement_plan_items")
                .update(updates)
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["plan-items"] });
            qc.invalidateQueries({ queryKey: ["plan-stats"] });
        }
    });
}

export function useDeletePlanItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await (supabase as any)
                .from("procurement_plan_items")
                .delete()
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["plan-items"] });
            qc.invalidateQueries({ queryKey: ["plan-stats"] });
        }
    });
}


