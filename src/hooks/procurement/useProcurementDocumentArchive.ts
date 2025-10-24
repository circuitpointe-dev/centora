import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Types
export interface ProcurementDocument {
    id: string;
    org_id: string;
    document_number: string;
    title: string;
    description?: string;
    file_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    document_type: 'contract' | 'invoice' | 'grn' | 'po' | 'policy' | 'report' | 'other';
    status: 'active' | 'archived' | 'expired' | 'draft';
    vendor_id?: string;
    vendor_name?: string;
    project_name?: string;
    amount?: number;
    currency?: string;
    document_date: string;
    expiry_date?: string;
    uploaded_by: string;
    uploaded_by_name?: string;
    uploaded_at: string;
    updated_at: string;
}

export interface DocumentArchiveStats {
    total_documents: number;
    total_size: number; // in bytes
    recent_uploads: number;
    archived_documents: number;
    contracts: number;
    invoices: number;
    grns: number;
    pos: number;
}

export interface DocumentArchiveListResponse {
    data: ProcurementDocument[];
    total: number;
    page: number;
    limit: number;
}

// Hooks
export const useDocumentArchiveStats = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['document-archive-stats', user?.org_id],
        queryFn: async (): Promise<DocumentArchiveStats> => {
            if (!user?.org_id) throw new Error('No organization');

            const { data: documents, error } = await supabase
                .from('procurement_documents')
                .select('document_type, status, file_size, uploaded_at')
                .eq('org_id', user.org_id);

            if (error) throw error;

            const total_documents = documents?.length || 0;
            const total_size = documents?.reduce((sum, doc) => sum + (doc.file_size || 0), 0) || 0;
            const recent_uploads = documents?.filter(doc => {
                const uploadDate = new Date(doc.uploaded_at);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return uploadDate >= thirtyDaysAgo;
            }).length || 0;
            const archived_documents = documents?.filter(doc => doc.status === 'archived').length || 0;
            const contracts = documents?.filter(doc => doc.document_type === 'contract').length || 0;
            const invoices = documents?.filter(doc => doc.document_type === 'invoice').length || 0;
            const grns = documents?.filter(doc => doc.document_type === 'grn').length || 0;
            const pos = documents?.filter(doc => doc.document_type === 'po').length || 0;

            return {
                total_documents,
                total_size,
                recent_uploads,
                archived_documents,
                contracts,
                invoices,
                grns,
                pos
            };
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useDocumentArchive = (
    page: number = 1,
    limit: number = 10,
    search?: string,
    document_type?: string,
    status?: string,
    vendor_id?: string,
    date_from?: string,
    date_to?: string
) => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['document-archive', user?.org_id, page, limit, search, document_type, status, vendor_id, date_from, date_to],
        queryFn: async (): Promise<DocumentArchiveListResponse> => {
            if (!user?.org_id) throw new Error('No organization');

            let query = supabase
                .from('procurement_documents')
                .select('*', { count: 'exact' })
                .eq('org_id', user.org_id)
                .order('uploaded_at', { ascending: false });

            // Apply filters
            if (search) {
                query = query.or(`title.ilike.%${search}%,document_number.ilike.%${search}%,vendor_name.ilike.%${search}%,project_name.ilike.%${search}%`);
            }

            if (document_type) {
                query = query.eq('document_type', document_type);
            }

            if (status) {
                query = query.eq('status', status);
            }

            if (vendor_id) {
                query = query.eq('vendor_id', vendor_id);
            }

            if (date_from) {
                query = query.gte('document_date', date_from);
            }

            if (date_to) {
                query = query.lte('document_date', date_to);
            }

            // Apply pagination
            const from = (page - 1) * limit;
            const to = from + limit - 1;
            query = query.range(from, to);

            const { data: documents, error, count } = await query;

            if (error) throw error;

            return {
                data: documents || [],
                total: count || 0,
                page,
                limit
            };
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useDocumentDetail = (id: string) => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['document-detail', id],
        queryFn: async (): Promise<ProcurementDocument> => {
            if (!user?.org_id) throw new Error('No organization');

            const { data: document, error } = await supabase
                .from('procurement_documents')
                .select('*')
                .eq('id', id)
                .eq('org_id', user.org_id)
                .single();

            if (error) throw error;
            if (!document) throw new Error('Document not found');

            return document;
        },
        enabled: !!id,
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useUploadDocument = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (document: {
            title: string;
            description?: string;
            file_name: string;
            file_path: string;
            file_size: number;
            mime_type: string;
            document_type: string;
            vendor_id?: string;
            project_name?: string;
            amount?: number;
            currency?: string;
            document_date: string;
            expiry_date?: string;
        }) => {
            if (!user?.org_id) throw new Error('No organization');

            const { data, error } = await supabase
                .from('procurement_documents')
                .insert({
                    ...document,
                    org_id: user.org_id,
                    uploaded_by: user.id,
                    uploaded_by_name: user.full_name || user.email,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['document-archive'] });
            queryClient.invalidateQueries({ queryKey: ['document-archive-stats'] });
        },
    });
};

export const useArchiveDocument = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (id: string) => {
            if (!user?.org_id) throw new Error('No organization');

            const { error } = await supabase
                .from('procurement_documents')
                .update({ status: 'archived' })
                .eq('id', id)
                .eq('org_id', user.org_id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['document-archive'] });
            queryClient.invalidateQueries({ queryKey: ['document-archive-stats'] });
        },
    });
};

export const useRestoreDocument = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (id: string) => {
            if (!user?.org_id) throw new Error('No organization');

            const { error } = await supabase
                .from('procurement_documents')
                .update({ status: 'active' })
                .eq('id', id)
                .eq('org_id', user.org_id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['document-archive'] });
            queryClient.invalidateQueries({ queryKey: ['document-archive-stats'] });
        },
    });
};

export const useDeleteDocument = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (id: string) => {
            if (!user?.org_id) throw new Error('No organization');

            const { error } = await supabase
                .from('procurement_documents')
                .delete()
                .eq('id', id)
                .eq('org_id', user.org_id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['document-archive'] });
            queryClient.invalidateQueries({ queryKey: ['document-archive-stats'] });
        },
    });
};

export const useDownloadDocument = () => {
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (id: string) => {
            if (!user?.org_id) throw new Error('No organization');

            const { data: document, error } = await supabase
                .from('procurement_documents')
                .select('file_path, file_name, mime_type')
                .eq('id', id)
                .eq('org_id', user.org_id)
                .single();

            if (error) throw error;
            if (!document) throw new Error('Document not found');

            // Create download link
            const link = document.createElement('a');
            link.href = document.file_path;
            link.download = document.file_name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            return { success: true };
        },
    });
};
