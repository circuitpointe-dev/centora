import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ProcurementDocument {
    id: string;
    org_id: string;
    title: string;
    file_name: string;
    file_path: string;
    file_size?: number;
    mime_type?: string;
    category: 'compliance' | 'contracts' | 'finance' | 'm-e' | 'policies' | 'templates' | 'uncategorized';
    status: 'draft' | 'active' | 'archived' | 'expired' | 'pending_approval';
    version?: string;
    description?: string;
    is_template?: boolean;
    template_category?: string;
    cover_image?: string;
    created_by?: string;
    created_at: string;
    updated_by?: string;
    updated_at: string;
}

export interface ProcurementReport {
    id: string;
    org_id: string;
    report_type: 'summary' | 'detailed' | 'analytics' | 'compliance' | 'audit';
    title: string;
    description?: string;
    parameters: Record<string, any>;
    generated_by: string;
    generated_by_name?: string;
    generated_at: string;
    file_path?: string;
    file_size?: number;
    file_type?: string;
    status: 'generating' | 'completed' | 'failed';
    created_at: string;
    updated_at: string;
}

export interface ProcurementArchiveStats {
    totalDocuments: number;
    totalSize: number;
    documentsByType: Record<string, number>;
    documentsByStatus: Record<string, number>;
    recentUploads: number;
    archivedDocuments: number;
}

export interface DocumentFilters {
    document_type?: string;
    status?: string;
    vendor?: string;
    dateRange?: {
        start: string;
        end: string;
    };
    category?: string;
    department?: string;
    fiscal_year?: string;
}

export interface DocumentListResponse {
    data: ProcurementDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Hook to fetch procurement archive statistics
export const useProcurementArchiveStats = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['procurement-archive-stats', user?.org_id],
        queryFn: async (): Promise<ProcurementArchiveStats> => {
            if (!user?.org_id) throw new Error('No organization');

            const { data: documents, error } = await supabase
                .from('documents')
                .select('category, status, file_size, created_at')
                .eq('org_id', user.org_id);

            if (error) throw error;

            const documentsData = documents as any[] || [];
            const totalDocuments = documentsData.length;
            const totalSize = documentsData.reduce((sum, doc) => sum + (doc.file_size || 0), 0);

            const documentsByType = documentsData.reduce((acc, doc) => {
                acc[doc.document_type] = (acc[doc.document_type] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const documentsByStatus = documentsData.reduce((acc, doc) => {
                acc[doc.status] = (acc[doc.status] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const recentUploads = documentsData.filter(doc => {
                const uploadDate = new Date(doc.uploaded_at);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return uploadDate >= weekAgo;
            }).length;

            const archivedDocuments = documentsData.filter(doc => doc.status === 'archived').length;

            return {
                totalDocuments,
                totalSize,
                documentsByType,
                documentsByStatus,
                recentUploads,
                archivedDocuments
            };
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to fetch procurement documents with pagination and filtering
export const useProcurementDocuments = (page = 1, limit = 10, search = '', filters?: DocumentFilters) => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['procurement-documents', page, limit, search, filters],
        queryFn: async (): Promise<DocumentListResponse> => {
            if (!user?.org_id) throw new Error('No organization');

            let query = supabase
                .from('documents')
                .select('*')
                .eq('org_id', user.org_id)
                .order('created_at', { ascending: false });

            // Apply search filter
            if (search) {
                query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
            }

            // Apply status filter  
            if (filters?.status) {
                query = query.eq('status', filters.status as any);
            }

            // Apply category filter
            if (filters?.category) {
                query = query.eq('category', filters.category as any);
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

            const documentsData = data as any[] || [];

            return {
                data: documentsData as ProcurementDocument[],
                total: count || 0,
                page,
                limit,
                totalPages: Math.ceil((count || 0) / limit)
            };
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

// Hook to fetch procurement reports
export const useProcurementReports = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['procurement-reports', user?.org_id],
        queryFn: async (): Promise<ProcurementReport[]> => {
            if (!user?.org_id) throw new Error('No organization');

            const { data, error } = await (supabase as any)
                .from('procurement_reports')
                .select('*')
                .eq('org_id', user.org_id)
                .order('generated_at', { ascending: false });

            if (error) throw error;

            const reportsData = data as any[] || [];
            return reportsData.map((report: any): ProcurementReport => ({
                id: report.id,
                org_id: report.org_id,
                report_type: report.report_type,
                title: report.title,
                description: report.description,
                parameters: report.parameters,
                generated_by: report.generated_by,
                generated_by_name: report.generated_by_name,
                generated_at: report.generated_at,
                file_path: report.file_path,
                file_size: report.file_size,
                file_type: report.file_type,
                status: report.status,
                created_at: report.created_at,
                updated_at: report.updated_at
            }));
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

// Hook to upload document
export const useUploadDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (documentData: { title: string; file_name: string; file_path: string; category: string; org_id: string; created_by: string; [key: string]: any }) => {
            const { data, error } = await supabase
                .from('documents')
                .insert([{ ...documentData, category: documentData.category as any }])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['procurement-documents'] });
            queryClient.invalidateQueries({ queryKey: ['procurement-archive-stats'] });
        }
    });
};

// Hook to archive document
export const useArchiveDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await supabase
                .from('documents')
                .update({
                    status: 'archived',
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['procurement-documents'] });
            queryClient.invalidateQueries({ queryKey: ['procurement-archive-stats'] });
        }
    });
};

// Hook to restore document
export const useRestoreDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await supabase
                .from('documents')
                .update({
                    status: 'draft',
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['procurement-documents'] });
            queryClient.invalidateQueries({ queryKey: ['procurement-archive-stats'] });
        }
    });
};

// Hook to delete document
export const useDeleteDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('documents')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['procurement-documents'] });
            queryClient.invalidateQueries({ queryKey: ['procurement-archive-stats'] });
        }
    });
};

// Hook to generate report
export const useGenerateReport = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (reportData: Partial<ProcurementReport>) => {
            const { data, error } = await (supabase as any)
                .from('procurement_reports')
                .insert([reportData])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['procurement-reports'] });
        }
    });
};
