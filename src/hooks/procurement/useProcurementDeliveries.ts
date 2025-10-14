import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Delivery {
  id: string;
  org_id: string;
  reference: string;
  po_number?: string;
  vendor_name: string;
  delivery_date: string;
  expected_date?: string;
  status: 'pending' | 'due_soon' | 'overdue' | 'delivered' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  amount?: number;
  currency: string;
  description?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  delivery_address?: string;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  confirmed_by?: string;
  confirmed_at?: string;
  attachments: string[];
}

export interface DeliveryStats {
  totalDeliveries: number;
  overdueDeliveries: number;
  dueSoonDeliveries: number;
  deliveredCount: number;
  pendingCount: number;
}

export interface DeliveryFilters {
  status?: string;
  vendor?: string;
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface DeliverySearchParams {
  page?: number;
  limit?: number;
  search?: string;
  filters?: DeliveryFilters;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Hook to fetch delivery statistics
export const useDeliveryStats = () => {
  return useQuery({
    queryKey: ['delivery-stats'],
    queryFn: async (): Promise<DeliveryStats> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user's organization
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();

      if (!profile?.org_id) throw new Error('Organization not found');

      // Get delivery statistics
      const { data: deliveries } = await supabase
        .from('procurement_deliveries')
        .select('status')
        .eq('org_id', profile.org_id);

      if (!deliveries) return {
        totalDeliveries: 0,
        overdueDeliveries: 0,
        dueSoonDeliveries: 0,
        deliveredCount: 0,
        pendingCount: 0,
      };

      const stats = deliveries.reduce((acc, delivery) => {
        acc.totalDeliveries++;
        switch (delivery.status) {
          case 'overdue':
            acc.overdueDeliveries++;
            break;
          case 'due_soon':
            acc.dueSoonDeliveries++;
            break;
          case 'delivered':
            acc.deliveredCount++;
            break;
          case 'pending':
            acc.pendingCount++;
            break;
        }
        return acc;
      }, {
        totalDeliveries: 0,
        overdueDeliveries: 0,
        dueSoonDeliveries: 0,
        deliveredCount: 0,
        pendingCount: 0,
      });

      return stats;
    },
  });
};

// Hook to fetch deliveries with pagination and filtering
export const useDeliveries = (params: DeliverySearchParams = {}) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    filters = {},
    sortBy = 'delivery_date',
    sortOrder = 'asc'
  } = params;

  return useQuery({
    queryKey: ['deliveries', page, limit, search, filters, sortBy, sortOrder],
    queryFn: async (): Promise<{ deliveries: Delivery[]; total: number }> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user's organization
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();

      if (!profile?.org_id) throw new Error('Organization not found');

      // Build query
      let query = supabase
        .from('procurement_deliveries')
        .select('*', { count: 'exact' })
        .eq('org_id', profile.org_id);

      // Apply search
      if (search) {
        query = query.or(`reference.ilike.%${search}%,vendor_name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.vendor) {
        query = query.eq('vendor_name', filters.vendor);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters.dateFrom) {
        query = query.gte('delivery_date', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('delivery_date', filters.dateTo);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        deliveries: (data || []) as Delivery[],
        total: count || 0,
      };
    },
  });
};

// Hook to confirm delivery receipt
export const useConfirmDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ deliveryId, notes }: { deliveryId: string; notes?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('procurement_deliveries')
        .update({
          status: 'delivered',
          confirmed_by: user.id,
          confirmed_at: new Date().toISOString(),
          notes: notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', deliveryId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch deliveries and stats
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['delivery-stats'] });
    },
  });
};

// Hook to update delivery status
export const useUpdateDeliveryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      deliveryId, 
      status, 
      notes 
    }: { 
      deliveryId: string; 
      status: Delivery['status']; 
      notes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (notes) {
        updateData.notes = notes;
      }

      if (status === 'delivered') {
        updateData.confirmed_by = user.id;
        updateData.confirmed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('procurement_deliveries')
        .update(updateData)
        .eq('id', deliveryId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch deliveries and stats
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['delivery-stats'] });
    },
  });
};

// Hook to get unique vendors for filtering
export const useDeliveryVendors = () => {
  return useQuery({
    queryKey: ['delivery-vendors'],
    queryFn: async (): Promise<string[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user's organization
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();

      if (!profile?.org_id) throw new Error('Organization not found');

      const { data, error } = await supabase
        .from('procurement_deliveries')
        .select('vendor_name')
        .eq('org_id', profile.org_id)
        .not('vendor_name', 'is', null);

      if (error) throw error;

      // Get unique vendor names
      const uniqueVendors = [...new Set(data?.map(d => d.vendor_name) || [])];
      return uniqueVendors.sort();
    },
  });
};
