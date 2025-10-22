import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Tender {
    id: string;
    org_id: string;
    vendor_id: string;
    vendor_name: string;
    items: string;
    price: number;
    currency: string;
    delivery_terms: string;
    score: number;
    status: 'active' | 'awarded' | 'rejected' | 'expired';
    compliance_status: 'compliant' | 'pending' | 'non-compliant';
    created_at: string;
    due_date: string;
    description?: string;
    requirements?: string[];
    attachments?: string[];
}

export interface ProcurementExecutionStats {
    activeTenders: number;
    pendingCompliance: number;
    awardedVendors: number;
    totalValue: number;
    averageScore: number;
}

// Hook to fetch procurement execution statistics
export const useProcurementExecutionStats = () => {
    return useQuery({
        queryKey: ['procurement-execution-stats'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            // Get user's org_id
            const { data: profile } = await supabase
                .from('profiles')
                .select('org_id')
                .eq('id', user.id)
                .single();

            if (!profile) throw new Error('User profile not found');

            // Fetch tender statistics
            const { data: tenders, error } = await supabase
                .from('tenders')
                .select('status, score, price, compliance_status')
                .eq('org_id', profile.org_id);

            if (error) throw error;

            const activeTenders = tenders?.filter(t => t.status === 'active').length || 0;
            const pendingCompliance = tenders?.filter(t => t.compliance_status === 'pending').length || 0;
            const awardedVendors = tenders?.filter(t => t.status === 'awarded').length || 0;
            const totalValue = tenders?.reduce((sum, t) => sum + (t.price || 0), 0) || 0;
            const averageScore = tenders?.length > 0
                ? tenders.reduce((sum, t) => sum + (t.score || 0), 0) / tenders.length
                : 0;

            return {
                activeTenders,
                pendingCompliance,
                awardedVendors,
                totalValue,
                averageScore: Math.round(averageScore * 10) / 10
            } as ProcurementExecutionStats;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to fetch tenders with pagination and filtering
export const useTenders = (page = 1, limit = 10, search = '') => {
    return useQuery({
        queryKey: ['tenders', page, limit, search],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            // Get user's org_id
            const { data: profile } = await supabase
                .from('profiles')
                .select('org_id')
                .eq('id', user.id)
                .single();

            if (!profile) throw new Error('User profile not found');

            let query = supabase
                .from('tenders')
                .select(`
                    *,
                    vendor:profiles!vendor_id(full_name)
                `)
                .eq('org_id', profile.org_id)
                .order('created_at', { ascending: false });

            // Apply search filter
            if (search) {
                query = query.or(`vendor_name.ilike.%${search}%,items.ilike.%${search}%`);
            }

            // Apply pagination
            const from = (page - 1) * limit;
            const to = from + limit - 1;
            const { data, error, count } = await query.range(from, to);

            if (error) throw error;

            return {
                data: data || [],
                total: count || 0,
                page,
                limit,
                totalPages: Math.ceil((count || 0) / limit)
            };
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

// Hook to award a tender
export const useAwardTender = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ tenderId, comment }: { tenderId: string; comment?: string }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('tenders')
                .update({
                    status: 'awarded',
                    awarded_by: user.id,
                    awarded_at: new Date().toISOString(),
                    award_comment: comment,
                    updated_at: new Date().toISOString()
                })
                .eq('id', tenderId)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenders'] });
            queryClient.invalidateQueries({ queryKey: ['procurement-execution-stats'] });
            toast({
                title: 'Success',
                description: 'Tender awarded successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to award tender',
                variant: 'destructive',
            });
        }
    });
};

// Hook to reject a tender
export const useRejectTender = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ tenderId, reason }: { tenderId: string; reason: string }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('tenders')
                .update({
                    status: 'rejected',
                    rejected_by: user.id,
                    rejected_at: new Date().toISOString(),
                    rejection_reason: reason,
                    updated_at: new Date().toISOString()
                })
                .eq('id', tenderId)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenders'] });
            queryClient.invalidateQueries({ queryKey: ['procurement-execution-stats'] });
            toast({
                title: 'Success',
                description: 'Tender rejected successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to reject tender',
                variant: 'destructive',
            });
        }
    });
};

// Hook to create a new tender
export const useCreateTender = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (payload: {
            vendor_id: string;
            items: string;
            price: number;
            currency: string;
            delivery_terms: string;
            due_date: string;
            description?: string;
            requirements?: string[];
        }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;

            const { data, error } = await supabase
                .from('tenders')
                .insert({
                    ...payload,
                    org_id: orgId,
                    created_by: user.id,
                    status: 'active',
                    compliance_status: 'pending'
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenders'] });
            queryClient.invalidateQueries({ queryKey: ['procurement-execution-stats'] });
            toast({
                title: 'Success',
                description: 'Tender created successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to create tender',
                variant: 'destructive',
            });
        }
    });
};
