import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function usePlanStats() {
    const { organization } = useAuth();
    return useQuery({
        queryKey: ["plan-stats", organization?.id],
        enabled: !!organization?.id,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("procurement_plans")
                .select("total_planned_spend, total_items, pending_items")
                .eq("org_id", organization!.id)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();
            if (error) throw error;
            return data || { total_planned_spend: 0, total_items: 0, pending_items: 0 };
        }
    });
}

export function usePlanItems(params: { page: number; limit: number; search?: string }) {
    const { organization } = useAuth();
    const { page, limit, search } = params;
    return useQuery({
        queryKey: ["plan-items", organization?.id, page, limit, search],
        enabled: !!organization?.id,
        queryFn: async () => {
            const from = (page - 1) * limit;
            const to = from + limit - 1;
            let query = supabase
                .from("procurement_plan_items")
                .select("id, item, description, est_cost, budget_source, status, planned_date", { count: "exact" })
                .eq("org_id", organization!.id)
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
    const { organization } = useAuth();
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { item: string; description?: string; est_cost?: number; budget_source?: string; status?: string; planned_date?: string }) => {
            const { error } = await supabase.from("procurement_plan_items").insert({ ...payload, org_id: organization!.id, plan_id: null });
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
            const { error } = await supabase
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
            const { error } = await supabase
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


