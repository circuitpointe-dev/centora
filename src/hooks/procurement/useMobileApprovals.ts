import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MobileApproval {
    id: string;
    org_id: string;
    type: 'requisition' | 'purchase_order' | 'payment';
    display_id: string;
    vendor_name?: string;
    amount: number;
    currency: string;
    status: 'pending' | 'approved' | 'rejected';
    priority: 'low' | 'medium' | 'high';
    description?: string;
    requestor_name: string;
    date_submitted: string;
    due_date?: string;
    created_at: string;
    updated_at: string;
}

export interface MobileApprovalStats {
    pendingApprovals: number;
    poPending: number;
    paymentPending: number;
    urgentApprovals: number;
    totalAmount: number;
}

export interface MobileApprovalFilters {
    type?: string;
    status?: string;
    priority?: string;
    vendor?: string;
    dateRange?: {
        start: string;
        end: string;
    };
}

export interface MobileApprovalListResponse {
    data: MobileApproval[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Hook to fetch mobile approval statistics
export const useMobileApprovalStats = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['mobile-approval-stats', user?.org_id],
        queryFn: async (): Promise<MobileApprovalStats> => {
            if (!user?.org_id) throw new Error('No organization');

            const { data: approvals, error } = await supabase
                .from('procurement_approvals')
                .select('type, status, priority, amount')
                .eq('org_id', user.org_id);

            if (error) throw error;

            const approvalsData = approvals as any[] || [];
            const pendingApprovals = approvalsData.filter(a => a.status === 'pending').length;
            const poPending = approvalsData.filter(a => a.type === 'purchase_order' && a.status === 'pending').length;
            const paymentPending = approvalsData.filter(a => a.type === 'payment' && a.status === 'pending').length;
            const urgentApprovals = approvalsData.filter(a => a.priority === 'urgent' && a.status === 'pending').length;
            const totalAmount = approvalsData.reduce((sum, approval) => sum + Number(approval.amount || 0), 0);

            return {
                pendingApprovals,
                poPending,
                paymentPending,
                urgentApprovals,
                totalAmount
            };
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to fetch mobile approvals with pagination and filtering
export const useMobileApprovals = (page = 1, limit = 10, search = '', filters?: MobileApprovalFilters) => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['mobile-approvals', page, limit, search, filters],
        queryFn: async (): Promise<MobileApprovalListResponse> => {
            if (!user?.org_id) throw new Error('No organization');

            let query = supabase
                .from('procurement_approvals')
                .select('*')
                .eq('org_id', user.org_id)
                .order('created_at', { ascending: false });

            // Apply search filter
            if (search) {
                query = query.or(`display_id.ilike.%${search}%,vendor_name.ilike.%${search}%,description.ilike.%${search}%`);
            }

            // Apply type filter
            if (filters?.type) {
                query = query.eq('type', filters.type);
            }

            // Apply status filter
            if (filters?.status) {
                query = query.eq('status', filters.status);
            }

            // Apply priority filter
            if (filters?.priority) {
                query = query.eq('priority', filters.priority);
            }

            // Apply vendor filter
            if (filters?.vendor) {
                query = query.eq('vendor_name', filters.vendor);
            }

            // Apply date range filter
            if (filters?.dateRange) {
                query = query
                    .gte('submitted_at', filters.dateRange.start)
                    .lte('submitted_at', filters.dateRange.end);
            }

            // Apply pagination
            const from = (page - 1) * limit;
            const to = from + limit - 1;
            const { data, error, count } = await query.range(from, to);

            if (error) throw error;

            const approvalsData = data as any[] || [];
            const approvals = approvalsData.map((approval: any): MobileApproval => ({
                id: approval.id,
                org_id: approval.org_id,
                type: approval.type,
                display_id: approval.display_id || approval.id.slice(0, 8),
                vendor_name: approval.vendor_name,
                amount: approval.amount,
                currency: approval.currency,
                status: approval.status,
                priority: approval.priority,
                description: approval.description,
                requestor_name: approval.requestor_name,
                date_submitted: approval.date_submitted,
                due_date: approval.due_date,
                created_at: approval.created_at,
                updated_at: approval.updated_at
            }));

            return {
                data: approvals,
                total: count || 0,
                page,
                limit,
                totalPages: Math.ceil((count || 0) / limit)
            };
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

// Hook to approve mobile approval
export const useApproveMobileApproval = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await supabase
                .from('procurement_approvals')
                .update({
                    status: 'approved',
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mobile-approvals'] });
            queryClient.invalidateQueries({ queryKey: ['mobile-approval-stats'] });
        }
    });
};

// Hook to reject mobile approval
export const useRejectMobileApproval = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
            const { data, error } = await supabase
                .from('procurement_approvals')
                .update({
                    status: 'rejected',
                    rejection_reason: reason,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mobile-approvals'] });
            queryClient.invalidateQueries({ queryKey: ['mobile-approval-stats'] });
        }
    });
};

// Hook to dispute mobile approval
export const useDisputeMobileApproval = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
            const { data, error } = await supabase
                .from('procurement_approvals')
                .update({
                    status: 'rejected',
                    rejection_reason: reason,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mobile-approvals'] });
            queryClient.invalidateQueries({ queryKey: ['mobile-approval-stats'] });
        }
    });
};

// Hook to delete mobile approval
export const useDeleteMobileApproval = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('procurement_approvals')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mobile-approvals'] });
            queryClient.invalidateQueries({ queryKey: ['mobile-approval-stats'] });
        }
    });
};
