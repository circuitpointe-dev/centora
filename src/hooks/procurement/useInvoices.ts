import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Invoice {
    id: string;
    org_id: string;
    invoice_number: string;
    vendor_id: string;
    vendor_name: string;
    total_amount: number;
    currency: string;
    linked_po_number?: string;
    linked_grn_number?: string;
    status: 'pending' | 'matched' | 'approved' | 'paid' | 'disputed' | 'cancelled';
    invoice_date: string;
    due_date?: string;
    payment_date?: string;
    description?: string;
    notes?: string;
    attachments: string[];
    created_by: string;
    created_at: string;
    updated_at: string;
}

export interface InvoiceStats {
    pendingInvoices: number;
    matchedInvoices: number;
    approvedInvoices: number;
    paidInvoices: number;
    totalAmount: number;
    overdueInvoices: number;
}

export interface InvoiceFilters {
    status?: string;
    vendor?: string;
    dateRange?: {
        start: string;
        end: string;
    };
}

export interface InvoiceListResponse {
    data: Invoice[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Hook to fetch invoice statistics
export const useInvoiceStats = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['invoice-stats', user?.org_id],
        queryFn: async (): Promise<InvoiceStats> => {
            if (!user?.org_id) throw new Error('No organization');

            const { data: invoices, error } = await (supabase as any)
                .from('invoices')
                .select('status, total_amount, due_date, invoice_date')
                .eq('org_id', user.org_id);

            if (error) throw error;

            const invoicesData = invoices as any[] || [];
            const pendingInvoices = invoicesData.filter(i => i.status === 'pending').length;
            const matchedInvoices = invoicesData.filter(i => i.status === 'matched').length;
            const approvedInvoices = invoicesData.filter(i => i.status === 'approved').length;
            const paidInvoices = invoicesData.filter(i => i.status === 'paid').length;
            const totalAmount = invoicesData.reduce((sum, invoice) => sum + Number(invoice.total_amount || 0), 0);

            const today = new Date();
            const overdueInvoices = invoicesData.filter(i =>
                i.status !== 'paid' &&
                i.due_date &&
                new Date(i.due_date) < today
            ).length;

            return {
                pendingInvoices,
                matchedInvoices,
                approvedInvoices,
                paidInvoices,
                totalAmount,
                overdueInvoices
            };
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to fetch invoices with pagination and filtering
export const useInvoices = (page = 1, limit = 10, search = '', filters?: InvoiceFilters) => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['invoices', page, limit, search, filters],
        queryFn: async (): Promise<InvoiceListResponse> => {
            if (!user?.org_id) throw new Error('No organization');

            let query = (supabase as any)
                .from('invoices')
                .select(`
                    *,
                    vendor:vendors(vendor_name)
                `)
                .eq('org_id', user.org_id)
                .order('created_at', { ascending: false });

            // Apply search filter
            if (search) {
                query = query.or(`invoice_number.ilike.%${search}%,vendor_name.ilike.%${search}%`);
            }

            // Apply status filter
            if (filters?.status) {
                query = query.eq('status', filters.status);
            }

            // Apply vendor filter
            if (filters?.vendor) {
                query = query.eq('vendor_id', filters.vendor);
            }

            // Apply date range filter
            if (filters?.dateRange) {
                query = query
                    .gte('invoice_date', filters.dateRange.start)
                    .lte('invoice_date', filters.dateRange.end);
            }

            // Apply pagination
            const from = (page - 1) * limit;
            const to = from + limit - 1;
            const { data, error, count } = await query.range(from, to);

            if (error) throw error;

            const invoicesData = data as any[] || [];
            const invoices = invoicesData.map((invoice: any): Invoice => ({
                id: invoice.id,
                org_id: invoice.org_id,
                invoice_number: invoice.invoice_number,
                vendor_id: invoice.vendor_id,
                vendor_name: invoice.vendor?.vendor_name || invoice.vendor_name,
                total_amount: invoice.total_amount,
                currency: invoice.currency,
                linked_po_number: invoice.linked_po_number,
                linked_grn_number: invoice.linked_grn_number,
                status: invoice.status,
                invoice_date: invoice.invoice_date,
                due_date: invoice.due_date,
                payment_date: invoice.payment_date,
                description: invoice.description,
                notes: invoice.notes,
                attachments: invoice.attachments || [],
                created_by: invoice.created_by,
                created_at: invoice.created_at,
                updated_at: invoice.updated_at
            }));

            return {
                data: invoices,
                total: count || 0,
                page,
                limit,
                totalPages: Math.ceil((count || 0) / limit)
            };
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

// Hook to fetch invoice detail
export const useInvoiceDetail = (id: string) => {
    return useQuery({
        queryKey: ['invoice-detail', id],
        queryFn: async (): Promise<Invoice> => {
            const { data, error } = await (supabase as any)
                .from('invoices')
                .select(`
                    *,
                    vendor:vendors(vendor_name)
                `)
                .eq('id', id)
                .single();

            if (error) throw error;

            const invoiceData = data as any;
            return {
                id: invoiceData.id,
                org_id: invoiceData.org_id,
                invoice_number: invoiceData.invoice_number,
                vendor_id: invoiceData.vendor_id,
                vendor_name: invoiceData.vendor?.vendor_name || invoiceData.vendor_name,
                total_amount: invoiceData.total_amount,
                currency: invoiceData.currency,
                linked_po_number: invoiceData.linked_po_number,
                linked_grn_number: invoiceData.linked_grn_number,
                status: invoiceData.status,
                invoice_date: invoiceData.invoice_date,
                due_date: invoiceData.due_date,
                payment_date: invoiceData.payment_date,
                description: invoiceData.description,
                notes: invoiceData.notes,
                attachments: invoiceData.attachments || [],
                created_by: invoiceData.created_by,
                created_at: invoiceData.created_at,
                updated_at: invoiceData.updated_at
            };
        },
        enabled: !!id,
    });
};

// Hook to create invoice
export const useCreateInvoice = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (payload: {
            invoice_number: string;
            vendor_id: string;
            amount: number;
            currency?: string;
            linked_po_number?: string;
            linked_grn_number?: string;
            invoice_date: string;
            due_date?: string;
            description?: string;
            notes?: string;
        }) => {
            if (!user) throw new Error('User not authenticated');

            const { data: profile } = await supabase
                .from('profiles')
                .select('org_id')
                .eq('id', user.id)
                .single();

            if (!profile) throw new Error('User profile not found');

            const { data, error } = await (supabase as any)
                .from('invoices')
                .insert({
                    ...payload,
                    org_id: profile.org_id,
                    created_by: user.id,
                    currency: payload.currency || 'USD',
                    status: 'pending'
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
        }
    });
};

// Hook to update invoice
export const useUpdateInvoice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Invoice> }) => {
            const { data, error } = await (supabase as any)
                .from('invoices')
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
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
            queryClient.invalidateQueries({ queryKey: ['invoice-detail'] });
        }
    });
};

// Hook to approve invoice
export const useApproveInvoice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await (supabase as any)
                .from('invoices')
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
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
            queryClient.invalidateQueries({ queryKey: ['invoice-detail'] });
        }
    });
};

// Hook to mark invoice as paid
export const useMarkInvoicePaid = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, payment_date }: { id: string; payment_date: string }) => {
            const { data, error } = await (supabase as any)
                .from('invoices')
                .update({
                    status: 'paid',
                    payment_date,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
            queryClient.invalidateQueries({ queryKey: ['invoice-detail'] });
        }
    });
};

// Hook to delete invoice
export const useDeleteInvoice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await (supabase as any)
                .from('invoices')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
        }
    });
};
