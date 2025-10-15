import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
    const { organization } = useAuth();
    return useQuery({
        queryKey: ["requisition-detail", id, organization?.id],
        enabled: !!id && !!organization?.id,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("procurement_requisitions")
                .select("id, reference, status, estimated_cost, unit_cost, currency, budget_source, requester_name, item_name, description, category, date_submitted")
                .eq("org_id", organization!.id)
                .eq("id", id)
                .maybeSingle();
            if (error) throw error;
            return (data || {}) as RequisitionDetail;
        },
    });
}

export function useRequisitionWorkflow(id?: string) {
    const { organization } = useAuth();
    return useQuery({
        queryKey: ["requisition-workflow", id, organization?.id],
        enabled: !!id && !!organization?.id,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("procurement_requisition_workflow")
                .select("id, label, status, acted_at")
                .eq("org_id", organization!.id)
                .eq("requisition_id", id)
                .order("sequence", { ascending: true });
            if (error) throw error;
            return data as Array<{ id: string; label: string; status: string; acted_at: string | null }>;
        },
    });
}

export function useRequisitionDocuments(id?: string) {
    const { organization } = useAuth();
    return useQuery({
        queryKey: ["requisition-documents", id, organization?.id],
        enabled: !!id && !!organization?.id,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("procurement_requisition_documents")
                .select("id, title, url")
                .eq("org_id", organization!.id)
                .eq("requisition_id", id)
                .order("created_at", { ascending: true });
            if (error) throw error;
            return data as Array<{ id: string; title: string; url: string }>;
        },
    });
}

export function useRequisitionActivity(id?: string) {
    const { organization } = useAuth();
    return useQuery({
        queryKey: ["requisition-activity", id, organization?.id],
        enabled: !!id && !!organization?.id,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("procurement_requisition_activity")
                .select("id, event, created_at")
                .eq("org_id", organization!.id)
                .eq("requisition_id", id)
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data as Array<{ id: string; event: string; created_at: string }>;
        },
    });
}


