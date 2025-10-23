import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface GRN {
    id: string;
    org_id: string;
    grn_number: string;
    po_id: string;
    po_number?: string;
    vendor_id: string;
    vendor_name?: string;
    item_name: string;
    item_description?: string;
    quantity_ordered: number;
    quantity_received: number;
    unit_price?: number;
    total_amount?: number;
    currency: string;
    delivery_date: string;
    received_date?: string;
    status: 'pending' | 'partial' | 'completed' | 'approved' | 'rejected';
    delivery_status: 'pending' | 'partial' | 'completed' | 'overdue';
    notes?: string;
    received_by?: string;
    received_by_name?: string;
    approved_by?: string;
    approved_by_name?: string;
    approved_at?: string;
    created_by: string;
    created_by_name?: string;
    created_at: string;
    updated_at: string;
}

export interface GRNStats {
    pendingGRNs: number;
    partialDeliveries: number;
    completedDeliveries: number;
    overdueDeliveries: number;
}

export interface GRNListResponse {
    data: GRN[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Hook to fetch GRN statistics
export const useGRNStats = () => {
    return useQuery({
        queryKey: ['grn-stats'],
        queryFn: async (): Promise<GRNStats> => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data: profile } = await supabase
                .from('profiles')
                .select('org_id')
                .eq('id', user.id)
                .single();

            if (!profile) throw new Error('User profile not found');

            const { data: grns, error } = await (supabase as any)
                .from('goods_received_notes')
                .select('status, delivery_status')
                .eq('org_id', profile.org_id);

            if (error) throw error;

            const grnsData = grns as any[] || [];
            const pendingGRNs = grnsData.filter(g => g.status === 'pending').length;
            const partialDeliveries = grnsData.filter(g => g.delivery_status === 'partial').length;
            const completedDeliveries = grnsData.filter(g => g.delivery_status === 'completed').length;
            const overdueDeliveries = grnsData.filter(g => g.delivery_status === 'overdue').length;

            return {
                pendingGRNs,
                partialDeliveries,
                completedDeliveries,
                overdueDeliveries
            };
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to fetch GRNs with pagination and filtering
export const useGRNs = (page = 1, limit = 10, search = '') => {
    return useQuery({
        queryKey: ['grns', page, limit, search],
        queryFn: async (): Promise<GRNListResponse> => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data: profile } = await supabase
                .from('profiles')
                .select('org_id')
                .eq('id', user.id)
                .single();

            if (!profile) throw new Error('User profile not found');

            let query = (supabase as any)
                .from('goods_received_notes')
                .select(`
                    *,
                    po:purchase_orders(po_number),
                    vendor:vendors(vendor_name),
                    received_by_user:profiles!received_by(full_name),
                    approved_by_user:profiles!approved_by(full_name),
                    created_by_user:profiles!created_by(full_name)
                `)
                .eq('org_id', profile.org_id)
                .order('created_at', { ascending: false });

            // Apply search filter
            if (search) {
                query = query.or(`grn_number.ilike.%${search}%,item_name.ilike.%${search}%,vendor.vendor_name.ilike.%${search}%`);
            }

            // Apply pagination
            const from = (page - 1) * limit;
            const to = from + limit - 1;
            const { data, error, count } = await query.range(from, to);

            if (error) throw error;

            const grnsData = data as any[] || [];
            const grns = grnsData.map((grn: any): GRN => ({
                id: grn.id,
                org_id: grn.org_id,
                grn_number: grn.grn_number,
                po_id: grn.po_id,
                po_number: grn.po?.po_number,
                vendor_id: grn.vendor_id,
                vendor_name: grn.vendor?.vendor_name,
                item_name: grn.item_name,
                item_description: grn.item_description,
                quantity_ordered: grn.quantity_ordered,
                quantity_received: grn.quantity_received,
                unit_price: grn.unit_price,
                total_amount: grn.total_amount,
                currency: grn.currency,
                delivery_date: grn.delivery_date,
                received_date: grn.received_date,
                status: grn.status,
                delivery_status: grn.delivery_status,
                notes: grn.notes,
                received_by: grn.received_by,
                received_by_name: grn.received_by_user?.full_name,
                approved_by: grn.approved_by,
                approved_by_name: grn.approved_by_user?.full_name,
                approved_at: grn.approved_at,
                created_by: grn.created_by,
                created_by_name: grn.created_by_user?.full_name,
                created_at: grn.created_at,
                updated_at: grn.updated_at
            }));

            return {
                data: grns,
                total: count || 0,
                page,
                limit,
                totalPages: Math.ceil((count || 0) / limit)
            };
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

// Hook to fetch GRN detail
export const useGRNDetail = (id: string) => {
    return useQuery({
        queryKey: ['grn-detail', id],
        queryFn: async (): Promise<GRN> => {
            const { data, error } = await (supabase as any)
                .from('goods_received_notes')
                .select(`
                    *,
                    po:purchase_orders(po_number),
                    vendor:vendors(vendor_name),
                    received_by_user:profiles!received_by(full_name),
                    approved_by_user:profiles!approved_by(full_name),
                    created_by_user:profiles!created_by(full_name)
                `)
                .eq('id', id)
                .single();

            if (error) throw error;

            const grnData = data as any;
            return {
                id: grnData.id,
                org_id: grnData.org_id,
                grn_number: grnData.grn_number,
                po_id: grnData.po_id,
                po_number: grnData.po?.po_number,
                vendor_id: grnData.vendor_id,
                vendor_name: grnData.vendor?.vendor_name,
                item_name: grnData.item_name,
                item_description: grnData.item_description,
                quantity_ordered: grnData.quantity_ordered,
                quantity_received: grnData.quantity_received,
                unit_price: grnData.unit_price,
                total_amount: grnData.total_amount,
                currency: grnData.currency,
                delivery_date: grnData.delivery_date,
                received_date: grnData.received_date,
                status: grnData.status,
                delivery_status: grnData.delivery_status,
                notes: grnData.notes,
                received_by: grnData.received_by,
                received_by_name: grnData.received_by_user?.full_name,
                approved_by: grnData.approved_by,
                approved_by_name: grnData.approved_by_user?.full_name,
                approved_at: grnData.approved_at,
                created_by: grnData.created_by,
                created_by_name: grnData.created_by_user?.full_name,
                created_at: grnData.created_at,
                updated_at: grnData.updated_at
            };
        },
        enabled: !!id,
    });
};

// Hook to create GRN
export const useCreateGRN = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (payload: {
            po_id: string;
            vendor_id: string;
            item_name: string;
            item_description?: string;
            quantity_ordered: number;
            quantity_received: number;
            unit_price?: number;
            currency?: string;
            delivery_date: string;
            notes?: string;
        }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data: profile } = await supabase
                .from('profiles')
                .select('org_id')
                .eq('id', user.id)
                .single();

            if (!profile) throw new Error('User profile not found');

            const { data, error } = await (supabase as any)
                .from('goods_received_notes')
                .insert({
                    ...payload,
                    org_id: profile.org_id,
                    created_by: user.id,
                    received_by: user.id,
                    received_date: new Date().toISOString().split('T')[0],
                    currency: payload.currency || 'USD',
                    total_amount: payload.unit_price ? payload.quantity_received * payload.unit_price : undefined
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['grns'] });
            queryClient.invalidateQueries({ queryKey: ['grn-stats'] });
            toast({
                title: 'Success',
                description: 'GRN created successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to create GRN',
                variant: 'destructive',
            });
        }
    });
};

// Hook to update GRN
export const useUpdateGRN = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<GRN> }) => {
            const { data, error } = await (supabase as any)
                .from('goods_received_notes')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['grns'] });
            queryClient.invalidateQueries({ queryKey: ['grn-stats'] });
            queryClient.invalidateQueries({ queryKey: ['grn-detail'] });
            toast({
                title: 'Success',
                description: 'GRN updated successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update GRN',
                variant: 'destructive',
            });
        }
    });
};

// Hook to approve GRN
export const useApproveGRN = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await (supabase as any)
                .from('goods_received_notes')
                .update({
                    status: 'approved',
                    approved_by: user.id,
                    approved_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['grns'] });
            queryClient.invalidateQueries({ queryKey: ['grn-stats'] });
            queryClient.invalidateQueries({ queryKey: ['grn-detail'] });
            toast({
                title: 'Success',
                description: 'GRN approved successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to approve GRN',
                variant: 'destructive',
            });
        }
    });
};

// Hook to reject GRN
export const useRejectGRN = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
            const { data, error } = await (supabase as any)
                .from('goods_received_notes')
                .update({
                    status: 'rejected',
                    notes: reason,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['grns'] });
            queryClient.invalidateQueries({ queryKey: ['grn-stats'] });
            queryClient.invalidateQueries({ queryKey: ['grn-detail'] });
            toast({
                title: 'Success',
                description: 'GRN rejected successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to reject GRN',
                variant: 'destructive',
            });
        }
    });
};

// Hook to delete GRN
export const useDeleteGRN = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await (supabase as any)
                .from('goods_received_notes')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['grns'] });
            queryClient.invalidateQueries({ queryKey: ['grn-stats'] });
            toast({
                title: 'Success',
                description: 'GRN deleted successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete GRN',
                variant: 'destructive',
            });
        }
    });
};
