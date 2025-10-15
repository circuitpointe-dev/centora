import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useApprovalMatrix(params: { page: number; limit: number; search?: string }) {
    const { organization } = useAuth();
    const { page, limit, search } = params;
    return useQuery({
        queryKey: ["approval-matrix", organization?.id, page, limit, search],
        enabled: !!organization?.id,
        queryFn: async () => {
            const from = (page - 1) * limit;
            const to = from + limit - 1;
            let query = supabase
                .from("procurement_approval_rules")
                .select("id, rule_code, entity_type, condition, approver_sequence, escalation_sla, status", { count: "exact" })
                .eq("org_id", organization!.id)
                .order("updated_at", { ascending: false })
                .range(from, to);
            if (search) query = query.ilike("rule_code", `%${search}%`);
            const { data, error, count } = await query;
            if (error) throw error;
            return { rules: data || [], total: count || 0 };
        }
    });
}


