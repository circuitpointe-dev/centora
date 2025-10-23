import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PurchaseOrder {
    id: string;
    org_id: string;
    po_number: string;
    requisition_id?: string;
    vendor_id?: string;
    title: string;
    description?: string;
    status: 'draft' | 'sent' | 'acknowledged' | 'partially_received' | 'received' | 'cancelled';
    priority?: string;
    total_amount: number;
    currency: string;
    po_date: string;
    expected_delivery_date?: string;
    actual_delivery_date?: string;
    terms_and_conditions?: string;
    notes?: string;
    created_by: string;
    approved_by?: string;
    created_at: string;
    updated_at: string;
}

export interface PurchaseOrderItem {
    id: string;
    po_id: string;
    item_description: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    unit_of_measure?: string;
    specifications?: string;
    received_quantity?: number;
    created_at: string;
}

export interface PurchaseOrderDetail extends PurchaseOrder {
    items: PurchaseOrderItem[];
    vendor?: {
        full_name: string;
    };
}

export interface PurchaseOrderStats {
    activePOs: number;
    draftPOs: number;
    sentPOs: number;
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
                .select(`
                    *,
                    vendor:profiles!vendor_id(full_name)
                `, { count: 'exact' })
                .eq('org_id', orgId)
                .order('created_at', { ascending: false });

            if (searchTerm) {
                query = query.or(`po_number.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%`);
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
        staleTime: 2 * 60 * 1000,
    });
}

export function usePurchaseOrderDetail(poId: string) {
    return useQuery({
        queryKey: ['purchase-order-detail', poId],
        queryFn: async () => {
            const { data: po, error: poError } = await supabase
                .from('purchase_orders')
                .select(`
                    *,
                    vendor:profiles!vendor_id(full_name)
                `)
                .eq('id', poId)
                .maybeSingle();

            if (poError) throw poError;
            if (!po) throw new Error('Purchase order not found');

            const { data: items, error: itemsError } = await supabase
                .from('purchase_order_items')
                .select('*')
                .eq('po_id', poId);

            if (itemsError) throw itemsError;

            // Ensure vendor is a single object, not an array
            const vendorData = Array.isArray(po.vendor) ? po.vendor[0] : po.vendor;

            return {
                ...po,
                vendor: vendorData,
                items: items || []
            } as PurchaseOrderDetail;
        },
        enabled: !!poId,
        staleTime: 2 * 60 * 1000,
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

            const { data: orders, error } = await supabase
                .from('purchase_orders')
                .select('status, total_amount')
                .eq('org_id', orgId);

            if (error) throw error;

            const activePOs = orders?.filter(o => o.status === 'sent' || o.status === 'acknowledged').length || 0;
            const draftPOs = orders?.filter(o => o.status === 'draft').length || 0;
            const sentPOs = orders?.filter(o => o.status === 'sent').length || 0;
            const totalValue = orders?.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0) || 0;

            return {
                activePOs,
                draftPOs,
                sentPOs,
                totalValue
            } as PurchaseOrderStats;
        },
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreatePurchaseOrder() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (payload: Partial<PurchaseOrder> & { items?: Omit<PurchaseOrderItem, 'id' | 'po_id' | 'created_at'>[] }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
            const orgId = profile?.org_id;

            const { items, ...poData } = payload;

            const { data: po, error: poError } = await supabase
                .from('purchase_orders')
                .insert([{
                    org_id: orgId,
                    created_by: user.id,
                    status: 'draft',
                    title: poData.title || 'New Purchase Order',
                    po_number: poData.po_number || `PO-${Date.now()}`,
                    currency: poData.currency || 'USD',
                    total_amount: poData.total_amount || 0,
                    po_date: poData.po_date || new Date().toISOString().split('T')[0],
                    vendor_id: poData.vendor_id,
                    requisition_id: poData.requisition_id,
                    description: poData.description,
                    expected_delivery_date: poData.expected_delivery_date,
                    terms_and_conditions: poData.terms_and_conditions,
                    notes: poData.notes
                }])
                .select()
                .single();

            if (poError) throw poError;

            if (items && items.length > 0) {
                const itemsData = items.map(item => ({
                    ...item,
                    po_id: po.id
                }));
                
                const { error: itemsError } = await supabase
                    .from('purchase_order_items')
                    .insert(itemsData);

                if (itemsError) throw itemsError;
            }

            return po;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
            queryClient.invalidateQueries({ queryKey: ['purchase-order-stats'] });
            toast({
                title: 'Success',
                description: 'Purchase order created successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to create purchase order',
                variant: 'destructive',
            });
        }
    });
}

export function useUpdatePurchaseOrder() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ id, ...updates }: Partial<PurchaseOrder> & { id: string }) => {
            // Remove fields that don't exist in the table or are restricted
            const { org_id, priority, ...validUpdates } = updates;
            
            const { data, error } = await supabase
                .from('purchase_orders')
                .update(validUpdates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
            queryClient.invalidateQueries({ queryKey: ['purchase-order-detail'] });
            queryClient.invalidateQueries({ queryKey: ['purchase-order-stats'] });
            toast({
                title: 'Success',
                description: 'Purchase order updated successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update purchase order',
                variant: 'destructive',
            });
        }
    });
}

export function useDeletePurchaseOrder() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (id: string) => {
            // Delete items first
            await supabase.from('purchase_order_items').delete().eq('po_id', id);

            // Then delete PO
            const { error } = await supabase.from('purchase_orders').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
            queryClient.invalidateQueries({ queryKey: ['purchase-order-stats'] });
            toast({
                title: 'Success',
                description: 'Purchase order deleted successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete purchase order',
                variant: 'destructive',
            });
        }
    });
}
