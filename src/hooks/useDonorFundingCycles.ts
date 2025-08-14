import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type FundingCycle = Database['public']['Tables']['donor_funding_cycles']['Row'];
type FundingCycleInsert = Database['public']['Tables']['donor_funding_cycles']['Insert'];
type FundingCycleUpdate = Database['public']['Tables']['donor_funding_cycles']['Update'];

export const useDonorFundingCycles = (donorId?: string, year?: number) => {
  return useQuery({
    queryKey: ['donor-funding-cycles', donorId, year],
    queryFn: async () => {
      let query = supabase
        .from('donor_funding_cycles')
        .select(`
          *,
          donors!inner(id, name, org_id)
        `);

      if (donorId) {
        query = query.eq('donor_id', donorId);
      }

      if (year) {
        query = query.eq('year', year);
      }

      const { data, error } = await query.order('year', { ascending: false });

      if (error) {
        console.error('Error fetching funding cycles:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useCreateDonorFundingCycle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: FundingCycleInsert) => {
      const { data: result, error } = await supabase
        .from('donor_funding_cycles')
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error('Error creating funding cycle:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donor-funding-cycles'] });
      toast({
        title: "Success",
        description: "Funding cycle created successfully",
      });
    },
    onError: (error) => {
      console.error('Create funding cycle error:', error);
      toast({
        title: "Error",
        description: "Failed to create funding cycle",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateDonorFundingCycle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FundingCycleUpdate }) => {
      const { data: result, error } = await supabase
        .from('donor_funding_cycles')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating funding cycle:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donor-funding-cycles'] });
      toast({
        title: "Success",
        description: "Funding cycle updated successfully",
      });
    },
    onError: (error) => {
      console.error('Update funding cycle error:', error);
      toast({
        title: "Error",
        description: "Failed to update funding cycle",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteDonorFundingCycle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('donor_funding_cycles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting funding cycle:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donor-funding-cycles'] });
      toast({
        title: "Success",
        description: "Funding cycle deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Delete funding cycle error:', error);
      toast({
        title: "Error",
        description: "Failed to delete funding cycle",
        variant: "destructive",
      });
    },
  });
};