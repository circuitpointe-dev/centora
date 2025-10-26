import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ProcurementDocument {
    id: string;
    org_id: string;
    document_type: 'Contract' | 'Invoice' | 'GRN' | 'PO' | 'Tender' | 'Quote' | 'Compliance' | 'Receipt' | 'Other';
    title: string;
    file_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    vendor_name?: string;
    project_name?: string;
    amount?: number;
    currency: string;
    status: 'active' | 'archived' | 'expired' | 'draft';
    description?: string;
    fiscal_year?: string;
    uploaded_by: string;
    uploaded_at: string;
    archived_at?: string;
    archived_by?: string;
    created_at: string;
    updated_at: string;
}

export interface ProcurementReport {
    id: string;
    org_id: string;
    report_type: 'summary' | 'detailed' | 'analytics' | 'compliance' | 'audit';
    title: string;
    parameters: Record<string, any>;
    status: 'generating' | 'completed' | 'failed';
    file_path?: string;
    file_size?: number;
    generated_by: string;
    generated_at: string;
    completed_at?: string;
    created_at: string;
    updated_at: string;
}

export interface DocumentStats {
    totalDocuments: number;
    totalSize: number;
    recentUploads: number;
    archivedDocuments: number;
    contractCount: number;
    invoiceCount: number;
    grnCount: number;
    poCount: number;
}

export interface DocumentFilters {
    document_type?: string;
    status?: string;
    vendor?: string;
    fiscal_year?: string;
    dateRange?: {
        start: string;
        end: string;
    };
}

export interface DocumentListResponse {
    data: ProcurementDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Hook to fetch document statistics
export const useProcurementArchiveStats = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['procurement-archive-stats', user?.org_id],
        queryFn: async (): Promise<DocumentStats> => {
            if (!user?.org_id) throw new Error('No organization');

            const { data: documents, error } = await supabase
                .from('procurement_documents')
                .select('document_type, status, file_size, uploaded_at')
                .eq('org_id', user.org_id);

            if (error) throw error;

            const documentsData = documents as any[] || [];
            const totalDocuments = documentsData.length;
            const totalSize = documentsData.reduce((sum, doc) => sum + Number(doc.file_size || 0), 0);
            const recentUploads = documentsData.filter(doc => {
                const uploadDate = new Date(doc.uploaded_at);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return uploadDate >= thirtyDaysAgo;
            }).length;
            const archivedDocuments = documentsData.filter(doc => doc.status === 'archived').length;
            const contractCount = documentsData.filter(doc => doc.document_type === 'Contract').length;
            const invoiceCount = documentsData.filter(doc => doc.document_type === 'Invoice').length;
            const grnCount = documentsData.filter(doc => doc.document_type === 'GRN').length;
            const poCount = documentsData.filter(doc => doc.document_type === 'PO').length;

            return {
                totalDocuments,
                totalSize,
                recentUploads,
                archivedDocuments,
                contractCount,
                invoiceCount,
                grnCount,
                poCount
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

            let query: any = supabase
                .from('procurement_documents')
                .select('*', { count: 'exact' })
                .eq('org_id', user.org_id)
                .order('uploaded_at', { ascending: false });

            // Apply search filter
            if (search) {
                query = query.or(`title.ilike.%${search}%,file_name.ilike.%${search}%,vendor_name.ilike.%${search}%,project_name.ilike.%${search}%`) as any;
            }

            // Apply document type filter
            if (filters?.document_type) {
                query = query.eq('document_type', filters.document_type as any) as any;
            }

            // Apply status filter  
            if (filters?.status) {
                query = query.eq('status', filters.status as any) as any;
            }

            // Apply vendor filter
            if (filters?.vendor) {
                query = query.eq('vendor_name', filters.vendor) as any;
            }

            // Apply fiscal year filter
            if (filters?.fiscal_year) {
                query = query.eq('fiscal_year', filters.fiscal_year) as any;
            }

            // Apply date range filter
            if (filters?.dateRange) {
                query = query
                    .gte('uploaded_at', filters.dateRange.start)
                    .lte('uploaded_at', filters.dateRange.end) as any;
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
                title: doc.title,
                file_name: doc.file_name,
                file_path: doc.file_path,
                file_size: doc.file_size,
                mime_type: doc.mime_type,
                vendor_name: doc.vendor_name,
                project_name: doc.project_name,
                amount: doc.amount,
                currency: doc.currency,
                status: doc.status,
                description: doc.description,
                fiscal_year: doc.fiscal_year,
                uploaded_by: doc.uploaded_by,
                uploaded_at: doc.uploaded_at,
                archived_at: doc.archived_at,
                archived_by: doc.archived_by,
                created_at: doc.created_at,
                updated_at: doc.updated_at
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

// Hook to archive a document
export const useArchiveDocument = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (documentId: string) => {
            const { data, error } = await supabase
                .from('procurement_documents')
                .update({
                    status: 'archived',
                    archived_at: new Date().toISOString(),
                    archived_by: user?.id,
                    updated_at: new Date().toISOString()
                })
                .eq('id', documentId)
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

// Hook to restore a document
export const useRestoreDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (documentId: string) => {
            const { data, error } = await supabase
                .from('procurement_documents')
                .update({
                    status: 'active',
                    archived_at: null,
                    archived_by: null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', documentId)
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

// Hook to delete a document
export const useDeleteDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (documentId: string) => {
            const { error } = await supabase
                .from('procurement_documents')
                .delete()
                .eq('id', documentId);

            if (error) throw error;
            return documentId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['procurement-documents'] });
            queryClient.invalidateQueries({ queryKey: ['procurement-archive-stats'] });
        }
    });
};

// Hook to upload a document
export const useUploadDocument = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (documentData: {
            document_type: 'Contract' | 'Invoice' | 'GRN' | 'PO' | 'Tender' | 'Quote' | 'Compliance' | 'Receipt' | 'Other';
            title: string;
            file_name: string;
            file_path: string;
            file_size: number;
            mime_type: string;
            vendor_name?: string;
            project_name?: string;
            amount?: number;
            currency?: string;
            description?: string;
            fiscal_year?: string;
        }) => {
            if (!user?.org_id) throw new Error('No organization');

            const { data, error} = await supabase
                .from('procurement_documents')
                .insert([{
                    org_id: user.org_id,
                    document_type: documentData.document_type as any,
                    title: documentData.title,
                    file_name: documentData.file_name,
                    file_path: documentData.file_path,
                    file_size: documentData.file_size,
                    mime_type: documentData.mime_type,
                    vendor_name: documentData.vendor_name,
                    project_name: documentData.project_name,
                    amount: documentData.amount,
                    currency: documentData.currency || 'USD',
                    description: documentData.description,
                    fiscal_year: documentData.fiscal_year,
                    uploaded_by: user.id,
                    status: 'active' as any,
                    document_number: `DOC-${Date.now()}`,
                    document_date: new Date().toISOString().split('T')[0]
                }])
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

// Hook to generate a report
export const useGenerateReport = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (reportData: {
            report_type: 'summary' | 'detailed' | 'analytics' | 'compliance' | 'audit';
            title: string;
            parameters: Record<string, any>;
            status: 'generating' | 'completed' | 'failed';
        }) => {
            if (!user?.org_id) throw new Error('No organization');

            // Temporarily disabled: procurement_reports table doesn't exist
            // TODO: Create procurement_reports table or use alternative approach
            throw new Error('Report generation not yet implemented');
            
            /* const { data, error } = await supabase
                .from('procurement_documents')
                .insert([{
                    org_id: user.org_id,
                    report_type: reportData.report_type,
                    title: reportData.title,
                    parameters: reportData.parameters,
                    status: reportData.status,
                    generated_by: user.id
                }])
                .select()
                .single();

            if (error) throw error;
            return data; */
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['procurement-reports'] });
        }
    });
};

// Hook to download a document
export const useDownloadDocument = () => {
    return useMutation({
        mutationFn: async (documentId: string) => {
            const { data, error } = await supabase
                .from('procurement_documents')
                .select('file_path, file_name, mime_type')
                .eq('id', documentId)
                .single();

            if (error) throw error;
            return data;
        }
    });
};

// Hook to view a document
export const useViewDocument = () => {
    return useMutation({
        mutationFn: async (documentId: string) => {
            const { data, error } = await supabase
                .from('procurement_documents')
                .select('file_path, file_name, mime_type, title')
                .eq('id', documentId)
                .single();

            if (error) throw error;
            return data;
        }
    });
};