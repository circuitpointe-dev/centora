import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DatabaseOpportunity {
  id: string;
  org_id: string;
  title: string;
  donor_id: string;
  contact_email?: string;
  contact_phone?: string;
  amount?: number;
  currency: string;
  type: 'RFP' | 'LOI' | 'CFP';
  deadline: string;
  status: 'To Review' | 'In Progress' | 'Submitted' | 'Awarded' | 'Declined';
  pipeline?: string;
  assigned_to?: string;
  sector?: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  donor?: {
    id: string;
    name: string;
  };
}

export interface CreateOpportunityData {
  title: string;
  donor_id: string;
  contact_email?: string;
  contact_phone?: string;
  amount?: number;
  currency?: string;
  type: 'RFP' | 'LOI' | 'CFP';
  deadline: string;
  status?: 'To Review' | 'In Progress' | 'Submitted' | 'Awarded' | 'Declined';
  pipeline?: string;
  assigned_to?: string;
  sector?: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
}

export interface UpdateOpportunityData extends Partial<CreateOpportunityData> {
  id: string;
}

// Hook to fetch all opportunities for the user's organization
export const useOpportunities = () => {
  return useQuery({
    queryKey: ['opportunities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          donor:donors!donor_id(id, name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    },
  });
};

// Hook to create a new opportunity
export const useCreateOpportunity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (opportunityData: CreateOpportunityData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user's org_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();

      if (!profile) throw new Error('User profile not found');

      const { data, error } = await supabase
        .from('opportunities')
        .insert({
          ...opportunityData,
          org_id: profile.org_id,
          created_by: user.id,
        })
        .select(`
          *,
          donor:donors!donor_id(id, name)
        `)
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (newOpportunity) => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast({
        title: "Opportunity Created",
        description: `${newOpportunity.title} has been added successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create opportunity",
        variant: "destructive",
      });
    },
  });
};

// Hook to update an opportunity
export const useUpdateOpportunity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateOpportunityData) => {
      const { data, error } = await supabase
        .from('opportunities')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          donor:donors!donor_id(id, name)
        `)
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (updatedOpportunity) => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast({
        title: "Opportunity Updated",
        description: `${updatedOpportunity.title} has been updated successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update opportunity",
        variant: "destructive",
      });
    },
  });
};

// Hook to delete an opportunity
export const useDeleteOpportunity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (opportunityId: string) => {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', opportunityId);

      if (error) {
        throw error;
      }

      return opportunityId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast({
        title: "Opportunity Deleted",
        description: "The opportunity has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete opportunity",
        variant: "destructive",
      });
    },
  });
};