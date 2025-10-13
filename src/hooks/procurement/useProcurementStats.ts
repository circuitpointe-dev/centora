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
                    .from<any>('requisitions')
                    .select('id, status, total_amount')
                    .eq('org_id', user.org_id),

                supabase
                    .from<any>('purchase_orders')
                    .select('id, status, total_amount')
                    .eq('org_id', user.org_id),

                supabase
                    .from<any>('invoices')
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
                ?.filter(req => req.status === 'pending_approval' || req.status === 'submitted')
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

            // Fetch pending approvals from database
            const { data: approvals, error } = await supabase
                .from<any>('procurement_approvals')
                .select('id, entity_type, entity_id, status, comments, created_at, approver_id')
                .eq('org_id', user.org_id)
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Fetch related entity details
            const approvalsWithDetails = await Promise.all(
                (approvals || []).map(async (approval) => {
                    let entityDetails = null;

                    if (approval.entity_type === 'requisition') {
                        const { data } = await supabase
                            .from<any>('requisitions')
                            .select('title, total_amount, currency, priority')
                            .eq('id', approval.entity_id)
                            .single();
                        entityDetails = data;
                    } else if (approval.entity_type === 'purchase_order') {
                        const { data } = await supabase
                            .from<any>('purchase_orders')
                            .select('title, total_amount, currency, priority')
                            .eq('id', approval.entity_id)
                            .single();
                        entityDetails = data;
                    } else if (approval.entity_type === 'invoice') {
                        const { data } = await supabase
                            .from<any>('invoices')
                            .select('total_amount, currency')
                            .eq('id', approval.entity_id)
                            .single();
                        entityDetails = data;
                    }

                    return {
                        id: approval.id,
                        type: approval.entity_type as 'requisition' | 'purchase_order' | 'payment',
                        title: entityDetails?.title || `Invoice #${approval.entity_id}`,
                        amount: Number(entityDetails?.total_amount || 0),
                        currency: entityDetails?.currency || 'USD',
                        submittedBy: 'Unknown',
                        submittedAt: approval.created_at,
                        priority: (entityDetails?.priority || 'medium') as 'low' | 'medium' | 'high'
                    };
                })
            );

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
                .from<any>('deliveries')
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
                    .from<any>('purchase_orders')
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

export const useSpendOverTime = (period: 'monthly' | 'quarterly' | 'yearly' = 'monthly') => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['spend-over-time', user?.org_id, period],
        queryFn: async (): Promise<SpendData[]> => {
            if (!user?.org_id) throw new Error('No organization');
            // Determine date window based on period
            const now = new Date();
            const start = new Date(now.getFullYear(), 0, 1);
            const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

            // Fetch invoices within the window
            const { data: invoices, error } = await supabase
                .from<any>('invoices')
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
