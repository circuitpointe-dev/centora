import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type VendorCompanyInfo = {
    id: string;
    org_id: string;
    vendor_id: string;
    company_name?: string;
    registration_number?: string;
    address?: string;
    country?: string;
    contact_person?: string;
    email?: string;
    phone_number?: string;
    is_complete: boolean;
    created_at?: string;
    updated_at?: string;
};

export type VendorBankingInfo = {
    id: string;
    org_id: string;
    vendor_id: string;
    bank_name?: string;
    account_holder?: string;
    account_number?: string;
    tax_id?: string;
    is_complete: boolean;
    created_at?: string;
    updated_at?: string;
};

export type VendorCertificate = {
    id: string;
    org_id: string;
    vendor_id: string;
    certificate_type: string;
    certificate_name: string;
    file_url?: string;
    valid_until?: string;
    status: string;
    is_complete: boolean;
    created_at?: string;
    updated_at?: string;
};

// Get vendor company info
export function useVendorCompanyInfo(vendorId: string | null) {
    return useQuery({
        queryKey: ['vendor-company-info', vendorId],
        queryFn: async () => {
            if (!vendorId) return null;
            const { data, error } = await (supabase as any)
                .from('vendor_company_info')
                .select('*')
                .eq('vendor_id', vendorId)
                .single();
            if (error && error.code !== 'PGRST116') throw error;
            return data as VendorCompanyInfo | null;
        },
        enabled: !!vendorId,
        staleTime: 5 * 60 * 1000
    });
}

// Get vendor banking info
export function useVendorBankingInfo(vendorId: string | null) {
    return useQuery({
        queryKey: ['vendor-banking-info', vendorId],
        queryFn: async () => {
            if (!vendorId) return null;
            const { data, error } = await (supabase as any)
                .from('vendor_banking_info')
                .select('*')
                .eq('vendor_id', vendorId)
                .single();
            if (error && error.code !== 'PGRST116') throw error;
            return data as VendorBankingInfo | null;
        },
        enabled: !!vendorId,
        staleTime: 5 * 60 * 1000
    });
}

// Get vendor certificates
export function useVendorCertificates(vendorId: string | null) {
    return useQuery({
        queryKey: ['vendor-certificates', vendorId],
        queryFn: async () => {
            if (!vendorId) return [];
            const { data, error } = await (supabase as any)
                .from('vendor_certificates')
                .select('*')
                .eq('vendor_id', vendorId)
                .order('created_at', { ascending: true });
            if (error) throw error;
            return data as VendorCertificate[];
        },
        enabled: !!vendorId,
        staleTime: 5 * 60 * 1000
    });
}

// Create/Update vendor company info
export function useUpsertVendorCompanyInfo() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { vendor_id: string; data: Partial<VendorCompanyInfo> }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;

            const { data, error } = await (supabase as any)
                .from('vendor_company_info')
                .upsert({
                    ...payload.data,
                    vendor_id: payload.vendor_id,
                    org_id: orgId
                }, { onConflict: 'vendor_id' })
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            qc.invalidateQueries({ queryKey: ['vendor-company-info', data.vendor_id] });
        }
    });
}

// Create/Update vendor banking info
export function useUpsertVendorBankingInfo() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { vendor_id: string; data: Partial<VendorBankingInfo> }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;

            const { data, error } = await (supabase as any)
                .from('vendor_banking_info')
                .upsert({
                    ...payload.data,
                    vendor_id: payload.vendor_id,
                    org_id: orgId
                }, { onConflict: 'vendor_id' })
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            qc.invalidateQueries({ queryKey: ['vendor-banking-info', data.vendor_id] });
        }
    });
}

// Create/Update vendor certificate
export function useUpsertVendorCertificate() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { vendor_id: string; data: Partial<VendorCertificate> }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;

            const { data, error } = await (supabase as any)
                .from('vendor_certificates')
                .upsert({
                    ...payload.data,
                    vendor_id: payload.vendor_id,
                    org_id: orgId
                })
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            qc.invalidateQueries({ queryKey: ['vendor-certificates', data.vendor_id] });
        }
    });
}

// Delete vendor certificate
export function useDeleteVendorCertificate() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (certificateId: string) => {
            const { error } = await (supabase as any)
                .from('vendor_certificates')
                .delete()
                .eq('id', certificateId);
            if (error) throw error;
        },
        onSuccess: (_, certificateId) => {
            qc.invalidateQueries({ queryKey: ['vendor-certificates'] });
        }
    });
}
