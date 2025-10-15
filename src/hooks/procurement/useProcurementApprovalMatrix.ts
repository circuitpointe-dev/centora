import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface ApprovalMatrix {
  id: string;
  org_id: string;
  department: string;
  approval_level: number;
  approver_role: string;
  approver_name: string;
  approver_email: string;
  min_amount: number;
  max_amount: number;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApprovalMatrixFilters {
  department?: string;
  approval_level?: number;
  approver_role?: string;
  is_active?: boolean;
}

export interface ApprovalMatrixParams {
  page?: number;
  limit?: number;
  search?: string;
  filters?: ApprovalMatrixFilters;
}

export const useApprovalMatrix = (params: ApprovalMatrixParams = {}) => {
  const { organization } = useAuth();
  const { page = 1, limit = 10, search = '', filters = {} } = params;
  
  return useQuery({
    queryKey: ['approval-matrix', organization?.id, page, limit, search, filters],
    enabled: !!organization?.id,
    queryFn: async () => {
      let query = supabase
        .from('approval_matrix')
        .select('*', { count: 'exact' })
        .eq('org_id', organization!.id)
        .order('approval_level', { ascending: true });

      // Apply search filter
      if (search) {
        query = query.or(`department.ilike.%${search}%,approver_name.ilike.%${search}%,approver_role.ilike.%${search}%`);
      }

      // Apply filters
      if (filters.department) {
        query = query.eq('department', filters.department);
      }
      if (filters.approval_level) {
        query = query.eq('approval_level', filters.approval_level);
      }
      if (filters.approver_role) {
        query = query.eq('approver_role', filters.approver_role);
      }
      if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        data: data as ApprovalMatrix[],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      };
    },
  });
};

export const useCreateApprovalMatrix = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (matrix: Omit<ApprovalMatrix, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('approval_matrix')
        .insert([matrix])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approval-matrix'] });
      toast({
        title: 'Success',
        description: 'Approval matrix created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateApprovalMatrix = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ApprovalMatrix> & { id: string }) => {
      const { data, error } = await supabase
        .from('approval_matrix')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approval-matrix'] });
      toast({
        title: 'Success',
        description: 'Approval matrix updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteApprovalMatrix = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('approval_matrix')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approval-matrix'] });
      toast({
        title: 'Success',
        description: 'Approval matrix deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
