import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type RequisitionDetail = {
    id: string;
    reference?: string | null;
    status?: string | null;
    estimated_cost?: number | null;
    unit_cost?: number | null;
    currency?: string | null;
    budget_source?: string | null;
    requester_name?: string | null;
    item_name?: string | null;
    description?: string | null;
    category?: string | null;
    date_submitted?: string | null;
};

export function useRequisitionDetail(id?: string) {
    return useQuery({
        queryKey: ["requisition-detail", id],
        enabled: !!id,
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;
            const { data, error } = await (supabase as any)
                .from("procurement_requisitions")
                .select("id, reference, status, estimated_cost, unit_cost, currency, budget_source, requester_name, item_name, description, category, date_submitted")
                .eq("org_id", orgId)
                .eq("id", id)
                .maybeSingle();
            if (error) throw error;
            return (data || {}) as RequisitionDetail;
        },
    });
}

export function useRequisitionWorkflow(id?: string) {
    return useQuery({
        queryKey: ["requisition-workflow", id],
        enabled: !!id,
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;
            const { data, error } = await (supabase as any)
                .from("procurement_requisition_workflow")
                .select("id, label, status, acted_at")
                .eq("org_id", orgId)
                .eq("requisition_id", id)
                .order("sequence", { ascending: true });
            if (error) throw error;
            return (data || []) as Array<{ id: string; label: string; status: string; acted_at: string | null }>;
        },
    });
}

export function useRequisitionDocuments(id?: string) {
    return useQuery({
        queryKey: ["requisition-documents", id],
        enabled: !!id,
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;
            const { data, error } = await (supabase as any)
                .from("procurement_requisition_documents")
                .select("id, title, url")
                .eq("org_id", orgId)
                .eq("requisition_id", id)
                .order("created_at", { ascending: true });
            if (error) throw error;
            return (data || []) as Array<{ id: string; title: string; url: string }>;
        },
    });
}

export function useRequisitionActivity(id?: string) {
    return useQuery({
        queryKey: ["requisition-activity", id],
        enabled: !!id,
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;
            const { data, error } = await (supabase as any)
                .from("procurement_requisition_activity")
                .select("id, event, created_at")
                .eq("org_id", orgId)
                .eq("requisition_id", id)
                .order("created_at", { ascending: false });
            if (error) throw error;
            return (data || []) as Array<{ id: string; event: string; created_at: string }>;
        },
    });
}

export function useUpdateRequisitionFields() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<RequisitionDetail> }) => {
            const { error } = await supabase
                .from("procurement_requisitions")
                .update(updates)
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: (_d, variables) => {
            qc.invalidateQueries({ queryKey: ["requisition-detail", variables.id] });
            qc.invalidateQueries({ queryKey: ["requisition-activity", variables.id] });
        }
    });
}

export function useSubmitRequisitionForApproval() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id }: { id: string }) => {
            const now = new Date().toISOString();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;
            const { error: uErr } = await supabase
                .from("procurement_requisitions")
                .update({ status: 'pending', updated_at: now })
                .eq("id", id);
            if (uErr) throw uErr;

            const { error: wErr } = await (supabase as any)
                .from("procurement_requisition_workflow")
                .insert({ org_id: orgId, requisition_id: id, sequence: 2, label: 'Submitted for approval', status: 'submitted', acted_at: now });
            if (wErr) throw wErr;
        },
        onSuccess: (_d, variables) => {
            qc.invalidateQueries({ queryKey: ["requisition-detail", variables.id] });
            qc.invalidateQueries({ queryKey: ["requisition-workflow", variables.id] });
        }
    });
}


