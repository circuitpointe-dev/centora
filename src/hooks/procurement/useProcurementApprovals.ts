import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProcurementApproval {
    id: string;
    display_id: string;
    org_id: string;
    type: 'requisition' | 'purchase_order' | 'payment';
    requestor_id: string;
    requestor_name: string;
    date_submitted: string;
    amount: number;
    currency: string;
    risk_level: 'low' | 'medium' | 'high';
    status: 'pending' | 'approved' | 'rejected';
    description: string;
    priority: 'low' | 'medium' | 'high';
    department: string;
    vendor_name?: string;
    due_date?: string;
    created_at: string;
    updated_at: string;
    approved_by?: string;
    approved_at?: string;
    rejection_reason?: string;
    attachments?: string[];
}

export interface ApprovalFilters {
    type?: string;
    risk_level?: string;
    status?: string;
    department?: string;
    date_from?: string;
    date_to?: string;
    amount_min?: number;
    amount_max?: number;
}

export interface ApprovalStats {
    total_pending: number;
    requisitions: number;
    purchase_orders: number;
    payments: number;
    high_risk: number;
    medium_risk: number;
    low_risk: number;
    total_amount: number;
}

// Hook to fetch approval statistics
export const useApprovalStats = () => {
    return useQuery({
        queryKey: ['procurement-approval-stats'],
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

            // Fetch approval statistics
            const { data: stats, error } = await supabase
                .from('procurement_approvals')
                .select(`
          type,
          risk_level,
          amount,
          status
        `)
                .eq('org_id', profile.org_id)
                .eq('status', 'pending');

            if (error) throw error;

            // Calculate statistics
            const requisitions = stats?.filter(s => s.type === 'requisition').length || 0;
            const purchase_orders = stats?.filter(s => s.type === 'purchase_order').length || 0;
            const payments = stats?.filter(s => s.type === 'payment').length || 0;
            const high_risk = stats?.filter(s => s.risk_level === 'high').length || 0;
            const medium_risk = stats?.filter(s => s.risk_level === 'medium').length || 0;
            const low_risk = stats?.filter(s => s.risk_level === 'low').length || 0;
            const total_amount = stats?.reduce((sum, s) => sum + (s.amount || 0), 0) || 0;

            return {
                total_pending: stats?.length || 0,
                requisitions,
                purchase_orders,
                payments,
                high_risk,
                medium_risk,
                low_risk,
                total_amount
            } as ApprovalStats;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to fetch approvals with pagination and filtering
export const useApprovals = (page = 1, limit = 10, filters: ApprovalFilters = {}) => {
    return useQuery({
        queryKey: ['procurement-approvals', page, limit, filters],
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
                .from('procurement_approvals')
                .select(`
          *,
          requestor:profiles!requestor_id(full_name)
        `)
                .eq('org_id', profile.org_id)
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            // Apply filters
            if (filters.type) {
                query = query.eq('type', filters.type);
            }
            if (filters.risk_level) {
                query = query.eq('risk_level', filters.risk_level);
            }
            if (filters.department) {
                query = query.eq('department', filters.department);
            }
            if (filters.date_from) {
                query = query.gte('date_submitted', filters.date_from);
            }
            if (filters.date_to) {
                query = query.lte('date_submitted', filters.date_to);
            }
            if (filters.amount_min) {
                query = query.gte('amount', filters.amount_min);
            }
            if (filters.amount_max) {
                query = query.lte('amount', filters.amount_max);
            }

            // Get total count for pagination
            const countQuery = supabase
                .from('procurement_approvals')
                .select('*', { count: 'exact', head: true })
                .eq('org_id', profile.org_id)
                .eq('status', 'pending');
            
            // Apply same filters to count query
            if (filters.type) countQuery.eq('type', filters.type);
            if (filters.risk_level) countQuery.eq('risk_level', filters.risk_level);
            if (filters.department) countQuery.eq('department', filters.department);
            if (filters.date_from) countQuery.gte('date_submitted', filters.date_from);
            if (filters.date_to) countQuery.lte('date_submitted', filters.date_to);
            if (filters.amount_min) countQuery.gte('amount', filters.amount_min);
            if (filters.amount_max) countQuery.lte('amount', filters.amount_max);
            
            const { count } = await countQuery;

            // Apply pagination
            const from = (page - 1) * limit;
            const to = from + limit - 1;
            const { data, error } = await query.range(from, to);

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

// Hook to approve an item
export const useApproveItem = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ id, comment }: { id: string; comment?: string }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('procurement_approvals')
                .update({
                    status: 'approved',
                    approved_by: user.id,
                    approved_at: new Date().toISOString(),
                    approval_comment: comment,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['procurement-approvals'] });
            queryClient.invalidateQueries({ queryKey: ['procurement-approval-stats'] });
            toast({
                title: "Approval Successful",
                description: `${data.type} ${data.id} has been approved.`,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Approval Failed",
                description: error.message || "Failed to approve item",
                variant: "destructive",
            });
        },
    });
};

// Hook to reject an item
export const useRejectItem = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('procurement_approvals')
                .update({
                    status: 'rejected',
                    approved_by: user.id,
                    approved_at: new Date().toISOString(),
                    rejection_reason: reason,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['procurement-approvals'] });
            queryClient.invalidateQueries({ queryKey: ['procurement-approval-stats'] });
            toast({
                title: "Rejection Successful",
                description: `${data.type} ${data.id} has been rejected.`,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Rejection Failed",
                description: error.message || "Failed to reject item",
                variant: "destructive",
            });
        },
    });
};

// Hook to bulk approve items
export const useBulkApprove = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ ids, comment }: { ids: string[]; comment?: string }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('procurement_approvals')
                .update({
                    status: 'approved',
                    approved_by: user.id,
                    approved_at: new Date().toISOString(),
                    approval_comment: comment,
                    updated_at: new Date().toISOString()
                })
                .in('id', ids)
                .select();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['procurement-approvals'] });
            queryClient.invalidateQueries({ queryKey: ['procurement-approval-stats'] });
            toast({
                title: "Bulk Approval Successful",
                description: `${data.length} items have been approved.`,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Bulk Approval Failed",
                description: error.message || "Failed to approve items",
                variant: "destructive",
            });
        },
    });
};
