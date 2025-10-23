import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ProcurementDocument {
    id: string;
    org_id: string;
    document_type: 'PO' | 'Invoice' | 'GRN' | 'Tender' | 'Contract' | 'Quote' | 'Receipt' | 'Other';
    document_number: string;
    title: string;
    description?: string;
    vendor_name?: string;
    amount?: number;
    currency?: string;
    status: 'active' | 'archived' | 'expired' | 'draft';
    file_path?: string;
    file_size?: number;
    file_type?: string;
    uploaded_by: string;
    uploaded_by_name?: string;
    uploaded_at: string;
    created_at: string;
    updated_at: string;
    tags?: string[];
    category?: string;
    department?: string;
    fiscal_year?: string;
    retention_date?: string;
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

            const { data: documents, error } = await (supabase as any)
                .from('procurement_documents')
                .select('document_type, status, file_size, uploaded_at')
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

            let query = (supabase as any)
                .from('procurement_documents')
                .select('*')
                .eq('org_id', user.org_id)
                .order('uploaded_at', { ascending: false });

            // Apply search filter
            if (search) {
                query = query.or(`title.ilike.%${search}%,document_number.ilike.%${search}%,vendor_name.ilike.%${search}%,description.ilike.%${search}%`);
            }

            // Apply document type filter
            if (filters?.document_type) {
                query = query.eq('document_type', filters.document_type);
            }

            // Apply status filter
            if (filters?.status) {
                query = query.eq('status', filters.status);
            }

            // Apply vendor filter
            if (filters?.vendor) {
                query = query.eq('vendor_name', filters.vendor);
            }

            // Apply category filter
            if (filters?.category) {
                query = query.eq('category', filters.category);
            }

            // Apply department filter
            if (filters?.department) {
                query = query.eq('department', filters.department);
            }

            // Apply fiscal year filter
            if (filters?.fiscal_year) {
                query = query.eq('fiscal_year', filters.fiscal_year);
            }

            // Apply date range filter
            if (filters?.dateRange) {
                query = query
                    .gte('uploaded_at', filters.dateRange.start)
                    .lte('uploaded_at', filters.dateRange.end);
            }

            // Apply pagination
            const from = (page - 1) * limit;
            const to = from + limit - 1;
            const { data, error, count } = await query.range(from, to);

            if (error) throw error;

            const documentsData = data as any[] || [];
            const documents = documentsData.map((doc: any): ProcurementDocument => ({
                id: doc.id,
                org_id: doc.org_id,
                document_type: doc.document_type,
                document_number: doc.document_number,
                title: doc.title,
                description: doc.description,
                vendor_name: doc.vendor_name,
                amount: doc.amount,
                currency: doc.currency,
                status: doc.status,
                file_path: doc.file_path,
                file_size: doc.file_size,
                file_type: doc.file_type,
                uploaded_by: doc.uploaded_by,
                uploaded_by_name: doc.uploaded_by_name,
                uploaded_at: doc.uploaded_at,
                created_at: doc.created_at,
                updated_at: doc.updated_at,
                tags: doc.tags,
                category: doc.category,
                department: doc.department,
                fiscal_year: doc.fiscal_year,
                retention_date: doc.retention_date
            }));

            return {
                data: documents,
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
        mutationFn: async (documentData: Partial<ProcurementDocument>) => {
            const { data, error } = await (supabase as any)
                .from('procurement_documents')
                .insert([documentData])
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
            const { data, error } = await (supabase as any)
                .from('procurement_documents')
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
            const { data, error } = await (supabase as any)
                .from('procurement_documents')
                .update({
                    status: 'active',
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
            const { error } = await (supabase as any)
                .from('procurement_documents')
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
