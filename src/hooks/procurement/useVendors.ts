import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type Vendor = {
    id: string;
    org_id: string;
    vendor_name: string;
    contact_person?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    tax_id?: string;
    payment_terms?: number;
    currency: string;
    is_active: boolean;
    rating?: number;
    notes?: string;
    created_by: string;
    created_at?: string;
    updated_at?: string;
};

export type VendorStats = {
    activeVendors: number;
    expiringContracts30d: number;
    highRiskVendors: number;
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
                .select('id,vendor_name,contact_person,email,phone,city,country,is_active,rating,created_at', { count: 'exact' })
                .eq('org_id', orgId)
                .order('created_at', { ascending: false })
                .range(from, to);
            if (search) query = query.ilike('vendor_name', `%${search}%`);
            if (status) query = status === 'active' ? query.eq('is_active', true) : status === 'inactive' ? query.eq('is_active', false) : query;
            const { data, error, count } = await query;
            if (error) throw error;
            // Map database fields to TypeScript interface
            const vendors = (data || []).map((v: any) => ({
                ...v
            }));
            const vendorIds = vendors.map((v: any) => v.id);
            const today = new Date().toISOString().slice(0, 10);
            let nextExpiryByVendor: Record<string, string | null> = {};
            if (vendorIds.length) {
                const { data: contracts } = await (supabase as any)
                    .from('vendor_contracts')
                    .select('vendor_id,end_date')
                    .in('vendor_id', vendorIds)
                    .gte('end_date', today)
                    .order('end_date', { ascending: true });
                for (const vId of vendorIds) {
                    const first = (contracts || []).find((c: any) => c.vendor_id === vId);
                    nextExpiryByVendor[vId] = first?.end_date || null;
                }
            }
            return { vendors, total: count || 0, nextExpiryByVendor } as any;
        }
    });
}

export function useVendorStats() {
    return useQuery<VendorStats>({
        queryKey: ['vendor-stats'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;

            const now = new Date();
            const in30 = new Date(now);
            in30.setDate(in30.getDate() + 30);
            const in30ISO = in30.toISOString().slice(0, 10);

            const [vendorsRes, contractsRes] = await Promise.all([
                (supabase as any)
                    .from('vendors')
                    .select('id,is_active,rating')
                    .eq('org_id', orgId),
                (supabase as any)
                    .from('vendor_contracts')
                    .select('id,end_date,status')
                    .eq('status', 'Active')
                    .lte('end_date', in30ISO)
            ]);

            if (vendorsRes.error) throw vendorsRes.error;
            if (contractsRes.error) throw contractsRes.error;

            const vendors = vendorsRes.data || [];
            const activeVendors = vendors.filter((v: any) => v.is_active === true).length;
            const highRiskVendors = vendors.filter((v: any) => Number(v.rating || 0) >= 70).length; // Using rating as risk indicator
            const expiringContracts30d = (contractsRes.data || []).length;

            return { activeVendors, expiringContracts30d, highRiskVendors };
        },
        staleTime: 5 * 60 * 1000
    });
}

export function useCreateVendor() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: Partial<Vendor> & { vendor_name: string }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;

            // Prepare database payload
            const dbPayload = {
                ...payload,
                org_id: orgId,
                created_by: user.id
            };

            console.log('Inserting vendor with payload:', dbPayload);
            const { error } = await (supabase as any).from('vendors').insert(dbPayload);
            if (error) {
                console.error('Database error:', error);
                throw error;
            }
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['vendors'] });
            qc.invalidateQueries({ queryKey: ['vendor-stats'] });
        }
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

export function useCreateVendorDocument() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { vendor_id: string; title: string; type?: string; url: string; status?: string; expires_at?: string }) => {
            const { error } = await (supabase as any)
                .from('vendor_documents')
                .insert(payload);
            if (error) throw error;
        },
        onSuccess: (_data, variables) => {
            qc.invalidateQueries({ queryKey: ['vendor-docs', variables.vendor_id] });
        }
    });
}

export function useCreateVendorContract() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { vendor_id: string; contract_code: string; title: string; start_date?: string; end_date?: string; value?: number; currency?: string; status?: string }) => {
            const { error } = await (supabase as any)
                .from('vendor_contracts')
                .insert(payload);
            if (error) throw error;
        },
        onSuccess: (_data, variables) => {
            qc.invalidateQueries({ queryKey: ['vendor-contracts', variables.vendor_id] });
        }
    });
}

export function useCreateVendorPerformance() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { vendor_id: string; period_start: string; period_end: string; delivery_score?: number; quality_score?: number; cost_score?: number; overall_score?: number; notes?: string }) => {
            const { error } = await (supabase as any)
                .from('vendor_performance')
                .insert(payload);
            if (error) throw error;
        },
        onSuccess: (_data, variables) => {
            qc.invalidateQueries({ queryKey: ['vendor-performance', variables.vendor_id] });
        }
    });
}

export function useUploadVendorDocument() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (args: { vendor_id: string; file: File }) => {
            const { vendor_id, file } = args;
            // Validate file
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (!allowedTypes.includes(file.type)) {
                throw new Error('File type not allowed. Please upload PDF, images, or Word documents.');
            }
            if (file.size > maxSize) {
                throw new Error('File size too large. Maximum size is 10MB.');
            }
            const ext = file.name.split('.').pop() || 'dat';
            const path = `${vendor_id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
            const { data, error } = await supabase.storage.from('vendor-documents').upload(path, file, { upsert: false });
            if (error) throw error;
            const { data: pub } = supabase.storage.from('vendor-documents').getPublicUrl(data.path);
            return { url: pub.publicUrl };
        },
        onSuccess: (_res, variables) => {
            qc.invalidateQueries({ queryKey: ['vendor-docs', variables.vendor_id] });
        }
    });
}

export function useBulkCreateVendorContracts() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (args: { vendor_id: string; contracts: Array<{ title: string; start_date?: string; end_date?: string; value?: number; currency?: string; status?: string }> }) => {
            const { vendor_id, contracts } = args;
            const now = new Date();
            const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;

            const contractData = contracts.map((contract, index) => ({
                vendor_id,
                contract_code: `CON-${ymd}-${String(index + 1).padStart(4, '0')}`,
                title: contract.title,
                start_date: contract.start_date,
                end_date: contract.end_date,
                value: contract.value,
                currency: contract.currency,
                status: contract.status || 'Active'
            }));

            const { error } = await (supabase as any)
                .from('vendor_contracts')
                .insert(contractData);
            if (error) throw error;
        },
        onSuccess: (_res, variables) => {
            qc.invalidateQueries({ queryKey: ['vendor-contracts', variables.vendor_id] });
        }
    });
}

export function useBulkCreateVendorDocuments() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (args: { vendor_id: string; documents: Array<{ title: string; type?: string; url: string; status?: string; expires_at?: string }> }) => {
            const { vendor_id, documents } = args;
            const docData = documents.map(doc => ({
                vendor_id,
                title: doc.title,
                type: doc.type,
                url: doc.url,
                status: doc.status || 'Active',
                expires_at: doc.expires_at
            }));

            const { error } = await (supabase as any)
                .from('vendor_documents')
                .insert(docData);
            if (error) throw error;
        },
        onSuccess: (_res, variables) => {
            qc.invalidateQueries({ queryKey: ['vendor-docs', variables.vendor_id] });
        }
    });
}


