import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Requisition {
  id: string;
  org_id: string;
  req_id: string;
  item_name: string;
  description?: string;
  quantity: number;
  unit_price?: number;
  estimated_cost: number;
  currency: string;
  date_submitted: string;
  budget_source?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  department?: string;
  requested_by: string;
  approved_by?: string;
  approved_at?: string;
  due_date?: string;
  justification?: string;
  notes?: string;
  attachments: string[];
  created_at: string;
  updated_at: string;
}

export interface RequisitionStats {
  pendingRequisitions: number;
  approvedRequisitions: number;
  averageApprovalTime: number;
  totalRequisitions: number;
}

export interface RequisitionFilters {
  status?: string;
  budget_source?: string;
  priority?: string;
  category?: string;
  department?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface RequisitionSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  filters?: RequisitionFilters;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Hook to fetch requisition statistics
export const useRequisitionStats = () => {
  return useQuery({
    queryKey: ['requisition-stats'],
    queryFn: async (): Promise<RequisitionStats> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user's organization
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();

      if (!profile?.org_id) throw new Error('Organization not found');

      // Get requisition statistics
      const { data: requisitions } = await supabase
        .from('procurement_requisitions')
        .select('status, created_at, approved_at')
        .eq('org_id', profile.org_id);

      if (!requisitions) return {
        pendingRequisitions: 0,
        approvedRequisitions: 0,
        averageApprovalTime: 0,
        totalRequisitions: 0,
      };

      const stats = requisitions.reduce((acc, req) => {
        acc.totalRequisitions++;
        if (req.status === 'pending') {
          acc.pendingRequisitions++;
        } else if (req.status === 'approved' || req.status === 'completed') {
          acc.approvedRequisitions++;
        }
        return acc;
      }, {
        pendingRequisitions: 0,
        approvedRequisitions: 0,
        averageApprovalTime: 0,
        totalRequisitions: 0,
      });

      // Calculate average approval time
      const approvedReqs = requisitions.filter(req => req.approved_at && req.created_at);
      if (approvedReqs.length > 0) {
        const totalDays = approvedReqs.reduce((sum, req) => {
          const created = new Date(req.created_at);
          const approved = new Date(req.approved_at!);
          const diffTime = Math.abs(approved.getTime() - created.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return sum + diffDays;
        }, 0);
        stats.averageApprovalTime = Math.round((totalDays / approvedReqs.length) * 10) / 10;
      }

      return stats;
    },
  });
};

// Hook to fetch requisitions with pagination and filtering
export const useRequisitions = (params: RequisitionSearchParams = {}) => {
  const {
    page = 1,
    limit = 8,
    search = '',
    filters = {},
    sortBy = 'date_submitted',
    sortOrder = 'desc'
  } = params;

  return useQuery({
    queryKey: ['requisitions', page, limit, search, filters, sortBy, sortOrder],
    queryFn: async (): Promise<{ requisitions: Requisition[]; total: number }> => {
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
        .from('procurement_requisitions')
        .select('*', { count: 'exact' })
        .eq('org_id', profile.org_id);

      // Apply search
      if (search) {
        query = query.or(`req_id.ilike.%${search}%,item_name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.budget_source) {
        query = query.eq('budget_source', filters.budget_source);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.department) {
        query = query.eq('department', filters.department);
      }
      if (filters.dateFrom) {
        query = query.gte('date_submitted', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('date_submitted', filters.dateTo);
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
        requisitions: data || [],
        total: count || 0,
      };
    },
  });
};

// Hook to create a new requisition
export const useCreateRequisition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requisitionData: Partial<Requisition>) => {
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
        .from('procurement_requisitions')
        .insert({
          ...requisitionData,
          org_id: profile.org_id,
          requested_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch requisitions and stats
      queryClient.invalidateQueries({ queryKey: ['requisitions'] });
      queryClient.invalidateQueries({ queryKey: ['requisition-stats'] });
    },
  });
};

// Hook to update requisition status
export const useUpdateRequisitionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      requisitionId, 
      status, 
      notes 
    }: { 
      requisitionId: string; 
      status: Requisition['status']; 
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

      if (status === 'approved') {
        updateData.approved_by = user.id;
        updateData.approved_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('procurement_requisitions')
        .update(updateData)
        .eq('id', requisitionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch requisitions and stats
      queryClient.invalidateQueries({ queryKey: ['requisitions'] });
      queryClient.invalidateQueries({ queryKey: ['requisition-stats'] });
    },
  });
};

// Hook to get unique budget sources for filtering
export const useRequisitionBudgetSources = () => {
  return useQuery({
    queryKey: ['requisition-budget-sources'],
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
        .from('procurement_requisitions')
        .select('budget_source')
        .eq('org_id', profile.org_id)
        .not('budget_source', 'is', null);

      if (error) throw error;

      // Get unique budget sources
      const uniqueSources = [...new Set(data?.map(d => d.budget_source) || [])];
      return uniqueSources.sort();
    },
  });
};

// Hook to get unique categories for filtering
export const useRequisitionCategories = () => {
  return useQuery({
    queryKey: ['requisition-categories'],
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
        .from('procurement_requisitions')
        .select('category')
        .eq('org_id', profile.org_id)
        .not('category', 'is', null);

      if (error) throw error;

      // Get unique categories
      const uniqueCategories = [...new Set(data?.map(d => d.category) || [])];
      return uniqueCategories.sort();
    },
  });
};
