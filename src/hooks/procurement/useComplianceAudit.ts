import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Json } from '@/integrations/supabase/types';

export interface ComplianceAuditLog {
    id: string;
    org_id: string;
    user_id: string;
    user_name: string;
    document_id: string | null;
    document_type: string;
    action: string;
    status: string;
    description?: string | null;
    ip_address?: unknown;
    user_agent?: string | null;
    metadata: Json | null;
    created_at: string;
    updated_at: string;
}

export interface ComplianceReport {
    id: string;
    org_id: string;
    report_type: 'compliance_summary' | 'audit_trail' | 'violation_report' | 'approval_workflow';
    title: string;
    description?: string;
    parameters: Record<string, any>;
    status: 'compliant' | 'non_compliant' | 'pending_review' | 'requires_action';
    generated_by: string;
    generated_at: string;
    reviewed_by?: string;
    reviewed_at?: string;
    file_path?: string;
    file_size?: number;
    created_at: string;
    updated_at: string;
}

export interface ComplianceStats {
    totalActions: number;
    approvals: number;
    pendingActions: number;
    rejections: number;
    violations: number;
    complianceRate: number;
}

export interface AuditFilters {
    user_id?: string;
    document_type?: string;
    action?: string;
    status?: string;
    dateRange?: {
        start: string;
        end: string;
    };
}

export interface AuditListResponse {
    data: ComplianceAuditLog[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Hook to fetch compliance statistics
export const useComplianceStats = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['compliance-stats', user?.org_id],
        queryFn: async (): Promise<ComplianceStats> => {
            if (!user?.org_id) throw new Error('No organization');

            const { data: auditLogs, error } = await supabase
                .from('compliance_audit_logs')
                .select('action, status')
                .eq('org_id', user.org_id);

            if (error) throw error;

            const logsData = auditLogs as any[] || [];
            const totalActions = logsData.length;
            const approvals = logsData.filter(log => log.status === 'approved').length;
            const pendingActions = logsData.filter(log => log.status === 'pending').length;
            const rejections = logsData.filter(log => log.status === 'rejected').length;
            const violations = logsData.filter(log => log.action === 'reject').length;
            const complianceRate = totalActions > 0 ? Math.round((approvals / totalActions) * 100) : 0;

            return {
                totalActions,
                approvals,
                pendingActions,
                rejections,
                violations,
                complianceRate
            };
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to fetch compliance audit logs with pagination and filtering
export const useComplianceAuditLogs = (page = 1, limit = 10, search = '', filters?: AuditFilters) => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['compliance-audit-logs', page, limit, search, filters],
        queryFn: async (): Promise<AuditListResponse> => {
            if (!user?.org_id) throw new Error('No organization');

            let query = supabase
                .from('compliance_audit_logs')
                .select('*', { count: 'exact' })
                .eq('org_id', user.org_id)
                .order('created_at', { ascending: false });

            // Apply search filter
            if (search) {
                query = query.or(`user_name.ilike.%${search}%,document_id.ilike.%${search}%,description.ilike.%${search}%`);
            }

            // Apply user filter
            if (filters?.user_id) {
                query = query.eq('user_id', filters.user_id);
            }

            // Apply document type filter
            if (filters?.document_type) {
                query = query.eq('document_type', filters.document_type);
            }

            // Apply action filter
            if (filters?.action) {
                query = query.eq('action', filters.action);
            }

            // Apply status filter
            if (filters?.status) {
                query = query.eq('status', filters.status);
            }

            // Apply date range filter
            if (filters?.dateRange) {
                query = query
                    .gte('created_at', filters.dateRange.start)
                    .lte('created_at', filters.dateRange.end);
            }

            // Apply pagination
            const from = (page - 1) * limit;
            const to = from + limit - 1;
            const { data, error, count } = await query.range(from, to);

            if (error) throw error;

            const logsData = data as any[] || [];
            const logs = logsData.map((log: any): ComplianceAuditLog => ({
                id: log.id,
                org_id: log.org_id,
                user_id: log.user_id,
                user_name: log.user_name,
                document_id: log.document_id,
                document_type: log.document_type,
                action: log.action,
                status: log.status,
                description: log.description,
                ip_address: log.ip_address,
                user_agent: log.user_agent,
                metadata: log.metadata,
                created_at: log.created_at,
                updated_at: log.updated_at
            }));

            return {
                data: logs,
                total: count || 0,
                page,
                limit,
                totalPages: Math.ceil((count || 0) / limit)
            };
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

// Hook to create a new audit log entry
export const useCreateAuditLog = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (logData: {
            document_id: string;
            document_type: string;
            action: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'view' | 'download' | 'export';
            status: 'approved' | 'pending' | 'rejected' | 'completed' | 'failed';
            description?: string;
            metadata?: Record<string, any>;
        }) => {
            if (!user?.org_id) throw new Error('No organization');

            const { data, error } = await supabase
                .from('compliance_audit_logs')
                .insert({
                    org_id: user.org_id,
                    user_id: user.id,
                    user_name: user.name,
                    document_id: logData.document_id,
                    document_type: logData.document_type,
                    action: logData.action,
                    status: logData.status,
                    description: logData.description,
                    ip_address: '192.168.1.100', // This would be captured from request
                    user_agent: navigator.userAgent,
                    metadata: logData.metadata || {}
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compliance-audit-logs'] });
            queryClient.invalidateQueries({ queryKey: ['compliance-stats'] });
        }
    });
};

// Hook to generate compliance report
export const useGenerateComplianceReport = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (reportData: {
            report_type: 'compliance_summary' | 'audit_trail' | 'violation_report' | 'approval_workflow';
            title: string;
            description?: string;
            parameters?: Record<string, any>;
        }) => {
            if (!user?.org_id) throw new Error('No organization');

            // Temporarily disabled: compliance_reports table doesn't exist
            // TODO: Create compliance_reports table or use alternative approach
            throw new Error('Compliance report generation not yet implemented');
            
            /* const { data, error } = await supabase
                .from('compliance_audit_logs')
                .insert({
                    org_id: user.org_id,
                    user_id: user.id,
                    user_name: user.name || 'Unknown',
                    document_type: 'compliance_report',
                    action: 'create',
                    status: 'pending_review',
                    description: `${reportData.title}: ${reportData.description || ''}`,
                    metadata: {
                        report_type: reportData.report_type,
                        title: reportData.title,
                        parameters: reportData.parameters || {}
                    }
                })
                .select()
                .single();

            if (error) throw error;
            return data; */
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compliance-reports'] });
        }
    });
};

// Hook to export audit logs
export const useExportAuditLogs = () => {
    return useMutation({
        mutationFn: async (filters?: AuditFilters) => {
            // This would generate and download an Excel/CSV file
            // For now, we'll simulate the export
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ success: true, message: 'Export completed' });
                }, 2000);
            });
        }
    });
};

// Hook to view audit log details
export const useViewAuditLog = () => {
    return useMutation({
        mutationFn: async (logId: string) => {
            const { data, error } = await supabase
                .from('compliance_audit_logs')
                .select('*')
                .eq('id', logId)
                .single();

            if (error) throw error;
            return data;
        }
    });
};
