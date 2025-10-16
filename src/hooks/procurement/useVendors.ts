import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type Vendor = {
    id: string;
    org_id: string;
    name: string;
    email?: string;
    phone?: string;
    category?: string;
    status?: string;
    rating?: number;
    address?: string;
    city?: string;
    country?: string;
    risk_score?: number;
    vetting_status?: string;
};

export function useVendors(params: { page: number; limit: number; search?: string; status?: string }) {
    const { page, limit, search, status } = params;
    return useQuery({
        queryKey: ['vendors', page, limit, search, status],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;
            const from = (page - 1) * limit;
            const to = from + limit - 1;
            let query = (supabase as any)
                .from('vendors')
                .select('id,name,email,phone,category,status,rating,city,country,risk_score,vetting_status,created_at', { count: 'exact' })
                .eq('org_id', orgId)
                .order('created_at', { ascending: false })
                .range(from, to);
            if (search) query = query.ilike('name', `%${search}%`);
            if (status) query = query.eq('status', status);
            const { data, error, count } = await query;
            if (error) throw error;
            return { vendors: data || [], total: count || 0 };
        }
    });
}

export function useCreateVendor() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: Partial<Vendor> & { name: string }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;
            const { error } = await (supabase as any).from('vendors').insert({ ...payload, org_id: orgId });
            if (error) throw error;
        },
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['vendors'] }); }
    });
}

export function useUpdateVendor() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Vendor> }) => {
            const { error } = await (supabase as any).from('vendors').update(updates).eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['vendors'] }); }
    });
}

export function useDeleteVendor() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await (supabase as any).from('vendors').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['vendors'] }); }
    });
}

export function useVendorContracts(vendorId: string | null, params: { page: number; limit: number }) {
    const { page, limit } = params;
    return useQuery({
        queryKey: ['vendor-contracts', vendorId, page, limit],
        enabled: !!vendorId,
        queryFn: async () => {
            const from = (page - 1) * limit;
            const to = from + limit - 1;
            const { data, error, count } = await (supabase as any)
                .from('vendor_contracts')
                .select('id,contract_code,title,start_date,end_date,value,currency,status,created_at', { count: 'exact' })
                .eq('vendor_id', vendorId)
                .order('created_at', { ascending: false })
                .range(from, to);
            if (error) throw error;
            return { contracts: data || [], total: count || 0 };
        }
    });
}

export function useVendorDocuments(vendorId: string | null) {
    return useQuery({
        queryKey: ['vendor-docs', vendorId],
        enabled: !!vendorId,
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from('vendor_documents')
                .select('id,title,type,url,status,expires_at,uploaded_at')
                .eq('vendor_id', vendorId)
                .order('uploaded_at', { ascending: false });
            if (error) throw error;
            return data || [];
        }
    });
}

export function useVendorPerformance(vendorId: string | null, params: { from?: string; to?: string }) {
    const { from, to } = params;
    return useQuery({
        queryKey: ['vendor-performance', vendorId, from, to],
        enabled: !!vendorId,
        queryFn: async () => {
            let query = (supabase as any)
                .from('vendor_performance')
                .select('id,period_start,period_end,delivery_score,quality_score,cost_score,overall_score,notes,created_at')
                .eq('vendor_id', vendorId)
                .order('period_start', { ascending: true });
            if (from) query = query.gte('period_start', from);
            if (to) query = query.lte('period_end', to);
            const { data, error } = await query;
            if (error) throw error;
            return data || [];
        }
    });
}


