import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PurchaseOrder {
    id: string;
    po_number: string;
    linked_requisition?: string;
    vendor_id?: string;
    vendor_name: string;
    po_date: string;
    delivery_date?: string;
    payment_terms?: string;
    currency: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    subtotal: number;
    tax: number;
    discounts: number;
    grand_total: number;
    created_by?: string;
    created_at: string;
    updated_at: string;
}

export interface PurchaseOrderItem {
    id: string;
    po_id: string;
    item_name: string;
    description?: string;
    quantity: number;
    unit_price: number;
    total: number;
    budget_source?: string;
    created_at: string;
    updated_at: string;
}

export interface PurchaseOrderApproval {
    id: string;
    po_id: string;
    approval_type: 'created' | 'manager_approval' | 'finance_approval' | 'procurement_head';
    approver_id?: string;
    approver_name?: string;
    status: 'pending' | 'approved' | 'rejected';
    approved_at?: string;
    comments?: string;
    created_at: string;
}

export interface PurchaseOrderAttachment {
    id: string;
    po_id: string;
    file_name: string;
    file_url: string;
    file_type?: string;
    file_size?: number;
    created_at: string;
}

export interface PurchaseOrderDetail extends PurchaseOrder {
    items: PurchaseOrderItem[];
    approvals: PurchaseOrderApproval[];
    attachments: PurchaseOrderAttachment[];
}

export interface PurchaseOrderStats {
    activePOs: number;
    pendingApprovals: number;
    approvedPOs: number;
    totalValue: number;
}

export function usePurchaseOrders(page = 1, limit = 10, searchTerm = '') {
    return useQuery({
        queryKey: ['purchase-orders', page, limit, searchTerm],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;

            let query = supabase
                .from('purchase_orders')
                .select('*', { count: 'exact' })
                .eq('org_id', orgId)
                .order('created_at', { ascending: false });

            if (searchTerm) {
                query = query.or(`po_number.ilike.%${searchTerm}%,vendor_name.ilike.%${searchTerm}%`);
            }

            const from = (page - 1) * limit;
            const to = from + limit - 1;
            const { data, error, count } = await query.range(from, to);

            if (error) throw error;

            return {
                data: data || [],
                total: count || 0,
                page,
                limit,
                totalPages: Math.ceil((count || 0) / limit)
            };
        },
        staleTime: 5 * 60 * 1000,
    });
}

export function usePurchaseOrderDetail(poId: string) {
    return useQuery({
        queryKey: ['purchase-order-detail', poId],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;

            // Get purchase order
            const { data: po, error: poError } = await supabase
                .from('purchase_orders')
                .select('*')
                .eq('id', poId)
                .eq('org_id', orgId)
                .single();

            if (poError) throw poError;

            // Get items
            const { data: items, error: itemsError } = await supabase
                .from('purchase_order_items')
                .select('*')
                .eq('po_id', poId)
                .eq('org_id', orgId);

            if (itemsError) throw itemsError;

            // Get approvals
            const { data: approvals, error: approvalsError } = await supabase
                .from('purchase_order_approvals')
                .select('*')
                .eq('po_id', poId)
                .eq('org_id', orgId)
                .order('created_at', { ascending: true });

            if (approvalsError) throw approvalsError;

            // Get attachments
            const { data: attachments, error: attachmentsError } = await supabase
                .from('purchase_order_attachments')
                .select('*')
                .eq('po_id', poId)
                .eq('org_id', orgId);

            if (attachmentsError) throw attachmentsError;

            return {
                ...po,
                items: items || [],
                approvals: approvals || [],
                attachments: attachments || []
            } as PurchaseOrderDetail;
        },
        enabled: !!poId,
        staleTime: 5 * 60 * 1000,
    });
}

export function usePurchaseOrderStats() {
    return useQuery({
        queryKey: ['purchase-order-stats'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;

            const { data, error } = await supabase
                .from('purchase_orders')
                .select('status, grand_total')
                .eq('org_id', orgId);

            if (error) throw error;

            const stats = {
                activePOs: 0,
                pendingApprovals: 0,
                approvedPOs: 0,
                totalValue: 0
            };

            (data || []).forEach(po => {
                if (po.status === 'approved') {
                    stats.approvedPOs++;
                    stats.totalValue += po.grand_total || 0;
                } else if (po.status === 'pending') {
                    stats.pendingApprovals++;
                }
                stats.activePOs++;
            });

            return stats as PurchaseOrderStats;
        },
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreatePurchaseOrder() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: {
            po_number: string;
            linked_requisition?: string;
            vendor_id?: string;
            vendor_name: string;
            po_date: string;
            delivery_date?: string;
            payment_terms?: string;
            currency?: string;
            items: Omit<PurchaseOrderItem, 'id' | 'po_id' | 'created_at' | 'updated_at'>[];
        }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;

            // Calculate totals
            const subtotal = payload.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
            const grand_total = subtotal + (payload.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0) * 0.1); // 10% tax

            // Create purchase order
            const { data: po, error: poError } = await supabase
                .from('purchase_orders')
                .insert({
                    org_id: orgId,
                    po_number: payload.po_number,
                    linked_requisition: payload.linked_requisition,
                    vendor_id: payload.vendor_id,
                    vendor_name: payload.vendor_name,
                    po_date: payload.po_date,
                    delivery_date: payload.delivery_date,
                    payment_terms: payload.payment_terms,
                    currency: payload.currency || 'USD',
                    subtotal,
                    tax: subtotal * 0.1,
                    discounts: 0,
                    grand_total,
                    created_by: user.id
                })
                .select()
                .single();

            if (poError) throw poError;

            // Create items
            const items = payload.items.map(item => ({
                org_id: orgId,
                po_id: po.id,
                item_name: item.item_name,
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total: item.unit_price * item.quantity,
                budget_source: item.budget_source
            }));

            const { error: itemsError } = await supabase
                .from('purchase_order_items')
                .insert(items);

            if (itemsError) throw itemsError;

            // Create initial approval
            const { error: approvalError } = await supabase
                .from('purchase_order_approvals')
                .insert({
                    org_id: orgId,
                    po_id: po.id,
                    approval_type: 'created',
                    approver_name: 'System',
                    status: 'approved',
                    approved_at: new Date().toISOString()
                });

            if (approvalError) throw approvalError;

            return po;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['purchase-orders'] });
            qc.invalidateQueries({ queryKey: ['purchase-order-stats'] });
        }
    });
}

export function useUpdatePurchaseOrder() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<PurchaseOrder> }) => {
            const { error } = await supabase
                .from('purchase_orders')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: (_, variables) => {
            qc.invalidateQueries({ queryKey: ['purchase-orders'] });
            qc.invalidateQueries({ queryKey: ['purchase-order-detail', variables.id] });
            qc.invalidateQueries({ queryKey: ['purchase-order-stats'] });
        }
    });
}

export function useDeletePurchaseOrder() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('purchase_orders')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['purchase-orders'] });
            qc.invalidateQueries({ queryKey: ['purchase-order-stats'] });
        }
    });
}
