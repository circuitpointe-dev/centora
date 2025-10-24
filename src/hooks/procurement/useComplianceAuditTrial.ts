import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Types
export interface ComplianceAuditTrial {
    id: string;
    org_id: string;
    user_id: string;
    user_name?: string;
    document_id: string;
    document_type: 'purchase_order' | 'requisition' | 'invoice' | 'grn' | 'payment' | 'approval';
    action: 'created' | 'updated' | 'approved' | 'rejected' | 'disputed' | 'viewed' | 'exported';
    status: 'approved' | 'pending' | 'rejected' | 'disputed';
    timestamp: string;
    ip_address?: string;
    user_agent?: string;
    details?: string;
    created_at: string;
}

export interface ComplianceAuditTrialStats {
    total_actions: number;
    approvals: number;
    pending_actions: number;
    rejections: number;
    disputes: number;
}

export interface ComplianceAuditTrialListResponse {
    data: ComplianceAuditTrial[];
    total: number;
    page: number;
    limit: number;
}

// Hooks
export const useComplianceAuditTrialStats = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['compliance-audit-trial-stats', user?.org_id],
        queryFn: async (): Promise<ComplianceAuditTrialStats> => {
            if (!user?.org_id) throw new Error('No organization');

            const { data: trials, error } = await supabase
                .from('compliance_audit_trials')
                .select('action, status')
                .eq('org_id', user.org_id);

            if (error) throw error;

            const total_actions = trials?.length || 0;
            const approvals = trials?.filter(t => t.status === 'approved').length || 0;
            const pending_actions = trials?.filter(t => t.status === 'pending').length || 0;
            const rejections = trials?.filter(t => t.status === 'rejected').length || 0;
            const disputes = trials?.filter(t => t.status === 'disputed').length || 0;

            return {
                total_actions,
                approvals,
                pending_actions,
                rejections,
                disputes
            };
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useComplianceAuditTrials = (
    page: number = 1,
    limit: number = 10,
    search?: string,
    document_type?: string,
    status?: string,
    date_from?: string,
    date_to?: string
) => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['compliance-audit-trials', user?.org_id, page, limit, search, document_type, status, date_from, date_to],
        queryFn: async (): Promise<ComplianceAuditTrialListResponse> => {
            if (!user?.org_id) throw new Error('No organization');

            let query = supabase
                .from('compliance_audit_trials')
                .select('*', { count: 'exact' })
                .eq('org_id', user.org_id)
                .order('timestamp', { ascending: false });

            // Apply filters
            if (search) {
                query = query.or(`user_name.ilike.%${search}%,document_id.ilike.%${search}%,details.ilike.%${search}%`);
            }

            if (document_type) {
                query = query.eq('document_type', document_type);
            }

            if (status) {
                query = query.eq('status', status);
            }

            if (date_from) {
                query = query.gte('timestamp', date_from);
            }

            if (date_to) {
                query = query.lte('timestamp', date_to);
            }

            // Apply pagination
            const from = (page - 1) * limit;
            const to = from + limit - 1;
            query = query.range(from, to);

            const { data: trials, error, count } = await query;

            if (error) throw error;

            return {
                data: trials || [],
                total: count || 0,
                page,
                limit
            };
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useComplianceAuditTrialDetail = (id: string) => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['compliance-audit-trial-detail', id],
        queryFn: async (): Promise<ComplianceAuditTrial> => {
            if (!user?.org_id) throw new Error('No organization');

            const { data: trial, error } = await supabase
                .from('compliance_audit_trials')
                .select('*')
                .eq('id', id)
                .eq('org_id', user.org_id)
                .single();

            if (error) throw error;
            if (!trial) throw new Error('Compliance audit trial not found');

            return trial;
        },
        enabled: !!id,
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useCreateComplianceAuditTrial = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (trial: Omit<ComplianceAuditTrial, 'id' | 'org_id' | 'created_at'>) => {
            if (!user?.org_id) throw new Error('No organization');

            const { data, error } = await supabase
                .from('compliance_audit_trials')
                .insert({
                    ...trial,
                    org_id: user.org_id,
                    user_id: user.id,
                    user_name: user.full_name || user.email,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compliance-audit-trials'] });
            queryClient.invalidateQueries({ queryKey: ['compliance-audit-trial-stats'] });
        },
    });
};

export const useExportComplianceAuditTrials = () => {
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (filters: {
            document_type?: string;
            status?: string;
            date_from?: string;
            date_to?: string;
        }) => {
            if (!user?.org_id) throw new Error('No organization');

            let query = supabase
                .from('compliance_audit_trials')
                .select('*')
                .eq('org_id', user.org_id)
                .order('timestamp', { ascending: false });

            // Apply filters
            if (filters.document_type) {
                query = query.eq('document_type', filters.document_type);
            }

            if (filters.status) {
                query = query.eq('status', filters.status);
            }

            if (filters.date_from) {
                query = query.gte('timestamp', filters.date_from);
            }

            if (filters.date_to) {
                query = query.lte('timestamp', filters.date_to);
            }

            const { data: trials, error } = await query;

            if (error) throw error;

            // Convert to CSV format
            const csvHeaders = [
                'User',
                'Document ID',
                'Document Type',
                'Action',
                'Status',
                'Timestamp',
                'IP Address',
                'Details'
            ];

            const csvRows = trials?.map(trial => [
                trial.user_name || 'Unknown',
                trial.document_id,
                trial.document_type,
                trial.action,
                trial.status,
                new Date(trial.timestamp).toLocaleString(),
                trial.ip_address || '',
                trial.details || ''
            ]) || [];

            const csvContent = [csvHeaders, ...csvRows]
                .map(row => row.map(field => `"${field}"`).join(','))
                .join('\n');

            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `compliance-audit-trial-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            return { success: true };
        },
    });
};

export const useDeleteComplianceAuditTrial = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (id: string) => {
            if (!user?.org_id) throw new Error('No organization');

            const { error } = await supabase
                .from('compliance_audit_trials')
                .delete()
                .eq('id', id)
                .eq('org_id', user.org_id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compliance-audit-trials'] });
            queryClient.invalidateQueries({ queryKey: ['compliance-audit-trial-stats'] });
        },
    });
};
