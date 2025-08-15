import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type FundingPeriod = Database['public']['Tables']['donor_funding_periods']['Row'];
type FundingPeriodInsert = Database['public']['Tables']['donor_funding_periods']['Insert'];
type FundingPeriodUpdate = Database['public']['Tables']['donor_funding_periods']['Update'];

export const useDonorFundingPeriods = (donorId?: string) => {
  return useQuery({
    queryKey: ['donor-funding-periods', donorId],
    queryFn: async () => {
      let query = supabase
        .from('donor_funding_periods')
        .select('*');

      if (donorId) {
        query = query.eq('donor_id', donorId);
      }

      const { data, error } = await query.order('start_date', { ascending: false });

      if (error) {
        console.error('Error fetching funding periods:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!donorId,
  });
};

export const useCreateDonorFundingPeriod = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: FundingPeriodInsert) => {
      const { data: result, error } = await supabase
        .from('donor_funding_periods')
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error('Error creating funding period:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donor-funding-periods'] });
      toast({
        title: "Success",
        description: "Funding period created successfully",
      });
    },
    onError: (error) => {
      console.error('Create funding period error:', error);
      toast({
        title: "Error",
        description: "Failed to create funding period",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateDonorFundingPeriod = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FundingPeriodUpdate }) => {
      const { data: result, error } = await supabase
        .from('donor_funding_periods')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating funding period:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donor-funding-periods'] });
      toast({
        title: "Success",
        description: "Funding period updated successfully",
      });
    },
    onError: (error) => {
      console.error('Update funding period error:', error);
      toast({
        title: "Error",
        description: "Failed to update funding period",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteDonorFundingPeriod = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('donor_funding_periods')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting funding period:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donor-funding-periods'] });
      toast({
        title: "Success",
        description: "Funding period deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Delete funding period error:', error);
      toast({
        title: "Error",
        description: "Failed to delete funding period",
        variant: "destructive",
      });
    },
  });
};