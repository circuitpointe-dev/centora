import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type VendorRiskAssessment = {
    id: string;
    org_id: string;
    vendor_id: string;
    risk_level: string;
    risk_score: number;
    assessment_date: string;
    assessed_by?: string;
    risk_factors?: string[];
    mitigation_plan?: string;
    next_review_date?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
};

export type VendorPerformanceMetric = {
    id: string;
    org_id: string;
    vendor_id: string;
    performance_score: number;
    quality_score: number;
    delivery_score: number;
    cost_score: number;
    communication_score: number;
    assessment_period_start: string;
    assessment_period_end: string;
    assessed_by?: string;
    notes?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
};

export type VendorCategory = {
    id: string;
    org_id: string;
    vendor_id: string;
    category_type: string;
    category_name: string;
    subcategory?: string;
    assigned_date: string;
    assigned_by?: string;
    reason?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
};

export type VendorComplianceStatus = {
    id: string;
    org_id: string;
    vendor_id: string;
    compliance_type: string;
    compliance_status: string;
    certificate_number?: string;
    issued_date?: string;
    expiry_date?: string;
    issuing_authority?: string;
    document_url?: string;
    notes?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
};

// Get vendor risk assessment
export function useVendorRiskAssessment(vendorId: string | null) {
    return useQuery({
        queryKey: ['vendor-risk-assessment', vendorId],
        queryFn: async () => {
            if (!vendorId) return null;
            const { data, error } = await (supabase as any)
                .from('vendor_risk_assessments')
                .select('*')
                .eq('vendor_id', vendorId)
                .eq('is_active', true)
                .order('assessment_date', { ascending: false })
                .limit(1)
                .single();
            if (error && error.code !== 'PGRST116') throw error;
            return data as VendorRiskAssessment | null;
        },
        enabled: !!vendorId,
        staleTime: 5 * 60 * 1000
    });
}

// Get vendor performance metrics
export function useVendorPerformanceMetrics(vendorId: string | null) {
    return useQuery({
        queryKey: ['vendor-performance-metrics', vendorId],
        queryFn: async () => {
            if (!vendorId) return null;
            const { data, error } = await (supabase as any)
                .from('vendor_performance_metrics')
                .select('*')
                .eq('vendor_id', vendorId)
                .eq('is_active', true)
                .order('assessment_period_end', { ascending: false })
                .limit(1)
                .single();
            if (error && error.code !== 'PGRST116') throw error;
            return data as VendorPerformanceMetric | null;
        },
        enabled: !!vendorId,
        staleTime: 5 * 60 * 1000
    });
}

// Get vendor categories
export function useVendorCategories(vendorId: string | null) {
    return useQuery({
        queryKey: ['vendor-categories', vendorId],
        queryFn: async () => {
            if (!vendorId) return [];
            const { data, error } = await (supabase as any)
                .from('vendor_categories')
                .select('*')
                .eq('vendor_id', vendorId)
                .eq('is_active', true)
                .order('assigned_date', { ascending: false });
            if (error) throw error;
            return data as VendorCategory[];
        },
        enabled: !!vendorId,
        staleTime: 5 * 60 * 1000
    });
}

// Get vendor compliance status
export function useVendorComplianceStatus(vendorId: string | null) {
    return useQuery({
        queryKey: ['vendor-compliance-status', vendorId],
        queryFn: async () => {
            if (!vendorId) return [];
            const { data, error } = await (supabase as any)
                .from('vendor_compliance_status')
                .select('*')
                .eq('vendor_id', vendorId)
                .eq('is_active', true)
                .order('expiry_date', { ascending: true });
            if (error) throw error;
            return data as VendorComplianceStatus[];
        },
        enabled: !!vendorId,
        staleTime: 5 * 60 * 1000
    });
}

// Create/Update vendor risk assessment
export function useUpsertVendorRiskAssessment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { vendor_id: string; data: Partial<VendorRiskAssessment> }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;

            const { data, error } = await (supabase as any)
                .from('vendor_risk_assessments')
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
            qc.invalidateQueries({ queryKey: ['vendor-risk-assessment', data.vendor_id] });
        }
    });
}

// Create/Update vendor performance metrics
export function useUpsertVendorPerformanceMetrics() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { vendor_id: string; data: Partial<VendorPerformanceMetric> }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;

            const { data, error } = await (supabase as any)
                .from('vendor_performance_metrics')
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
            qc.invalidateQueries({ queryKey: ['vendor-performance-metrics', data.vendor_id] });
        }
    });
}

// Create/Update vendor category
export function useUpsertVendorCategory() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { vendor_id: string; data: Partial<VendorCategory> }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;

            const { data, error } = await (supabase as any)
                .from('vendor_categories')
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
            qc.invalidateQueries({ queryKey: ['vendor-categories', data.vendor_id] });
        }
    });
}

// Create/Update vendor compliance status
export function useUpsertVendorComplianceStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { vendor_id: string; data: Partial<VendorComplianceStatus> }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;

            const { data, error } = await (supabase as any)
                .from('vendor_compliance_status')
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
            qc.invalidateQueries({ queryKey: ['vendor-compliance-status', data.vendor_id] });
        }
    });
}
