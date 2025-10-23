import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ProcurementStats {
    totalSpent: number;
    pendingRequisitions: number;
    openPurchaseOrders: number;
    outstandingInvoices: number;
}

export interface PendingApproval {
    id: string;
    type: 'requisition' | 'purchase_order' | 'payment';
    title: string;
    amount: number;
    currency: string;
    submittedBy: string;
    submittedAt: string;
    priority: 'low' | 'medium' | 'high';
}

export interface UpcomingDelivery {
    id: string;
    title: string;
    supplier: string;
    expectedDate: string;
    status: 'scheduled' | 'overdue' | 'delivered';
    amount: number;
    currency: string;
}

export interface SpendData {
    month: string;
    amount: number;
    category: string;
}

export const useProcurementStats = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['procurement-stats', user?.org_id],
        queryFn: async (): Promise<ProcurementStats> => {
            if (!user?.org_id) throw new Error('No organization');

            // Fetch real data from database
            const [requisitionsResult, purchaseOrdersResult, invoicesResult] = await Promise.all([
                supabase
                    .from('requisitions')
                    .select('id, status, total_amount')
                    .eq('org_id', user.org_id),

                supabase
                    .from('purchase_orders')
                    .select('id, status, total_amount')
                    .eq('org_id', user.org_id),

                supabase
                    .from('invoices')
                    .select('id, status, total_amount, paid_amount')
                    .eq('org_id', user.org_id)
            ]);

            if (requisitionsResult.error) throw requisitionsResult.error;
            if (purchaseOrdersResult.error) throw purchaseOrdersResult.error;
            if (invoicesResult.error) throw invoicesResult.error;

            // Calculate total spent from paid invoices
            const totalSpent = invoicesResult.data
                ?.filter(invoice => invoice.status === 'paid')
                .reduce((sum, invoice) => sum + Number(invoice.paid_amount || 0), 0) || 0;

            // Count pending requisitions
            const pendingRequisitions = requisitionsResult.data
                ?.filter(req => req.status === 'submitted' || req.status === 'draft')
                .length || 0;

            // Count open purchase orders
            const openPurchaseOrders = purchaseOrdersResult.data
                ?.filter(po => po.status === 'sent' || po.status === 'acknowledged' || po.status === 'partially_received')
                .length || 0;

            // Count outstanding invoices
            const outstandingInvoices = invoicesResult.data
                ?.filter(invoice => invoice.status === 'pending' || invoice.status === 'overdue')
                .length || 0;

            return {
                totalSpent,
                pendingRequisitions,
                openPurchaseOrders,
                outstandingInvoices
            };
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const usePendingApprovals = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['pending-approvals', user?.org_id],
        queryFn: async (): Promise<PendingApproval[]> => {
            if (!user?.org_id) throw new Error('No organization');

            // Fetch pending approvals from database - using actual schema columns
            const { data: approvals, error } = await supabase
                .from('procurement_approvals')
                .select('id, type, requestor_name, amount, currency, description, priority, created_at, date_submitted')
                .eq('org_id', user.org_id)
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map to PendingApproval format
            const approvalsWithDetails: PendingApproval[] = (approvals || []).map((approval) => ({
                id: approval.id,
                type: approval.type as 'requisition' | 'purchase_order' | 'payment',
                title: approval.description || `${approval.type} #${approval.id.slice(0, 8)}`,
                amount: Number(approval.amount || 0),
                currency: approval.currency || 'USD',
                submittedBy: approval.requestor_name || 'Unknown',
                submittedAt: approval.date_submitted || approval.created_at,
                priority: (approval.priority || 'medium') as 'low' | 'medium' | 'high'
            }));

            return approvalsWithDetails;
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useUpcomingDeliveries = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['upcoming-deliveries', user?.org_id],
        queryFn: async (): Promise<UpcomingDelivery[]> => {
            if (!user?.org_id) throw new Error('No organization');

            // Fetch deliveries from database
            const { data: deliveries, error } = await supabase
                .from('deliveries')
                .select('id, status, scheduled_date, po_id')
                .eq('org_id', user.org_id)
                .in('status', ['scheduled', 'overdue', 'in_transit'])
                .order('scheduled_date', { ascending: true });

            if (error) throw error;

            // Fetch related POs for titles and amounts
            const poIds = Array.from(new Set((deliveries || []).map(d => d.po_id).filter(Boolean)));
            let poMap: Record<string, any> = {};
            if (poIds.length > 0) {
                const { data: pos } = await supabase
                    .from('purchase_orders')
                    .select('id, title, total_amount, currency')
                    .in('id', poIds);
                (pos || []).forEach((po: any) => { poMap[po.id] = po; });
            }

            return (deliveries || []).map((delivery: any) => {
                const po = poMap[delivery.po_id] || {};
                return {
                    id: delivery.id,
                    title: po.title || 'Delivery',
                    supplier: '—',
                    expectedDate: delivery.scheduled_date,
                    status: delivery.status as 'scheduled' | 'overdue' | 'delivered',
                    amount: Number(po.total_amount || 0),
                    currency: po.currency || 'USD'
                };
            });
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
};

export interface SpendFilters {
    vendor?: string;
    category?: string;
    status?: string; // optional; applied only if column exists in schema
}

export const useSpendOverTime = (period: 'monthly' | 'quarterly' | 'yearly' = 'monthly', filters?: SpendFilters) => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['spend-over-time', user?.org_id, period, filters?.vendor, filters?.category, filters?.status],
        queryFn: async (): Promise<SpendData[]> => {
            if (!user?.org_id) throw new Error('No organization');
            // Determine date window based on period
            const now = new Date();
            const start = new Date(now.getFullYear(), 0, 1);
            const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

            // Fetch invoices within the window
            // Minimal, schema-safe select to avoid 400 errors on unknown columns
            const { data: invoices, error } = await supabase
                .from('invoices')
                .select('invoice_date, total_amount')
                .eq('org_id', user.org_id)
                .gte('invoice_date', start.toISOString())
                .lte('invoice_date', end.toISOString());

            if (error) throw error;

            // Aggregate by month (Jan..Dec)
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthTotals = new Array(12).fill(0);

            (invoices || []).forEach(inv => {
                const d = new Date(inv.invoice_date);
                const idx = d.getMonth();
                monthTotals[idx] += Number(inv.total_amount || 0);
            });

            const monthlyData: SpendData[] = monthNames.map((name, idx) => ({
                month: name,
                amount: monthTotals[idx],
                category: 'All'
            }));

            return monthlyData;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};
