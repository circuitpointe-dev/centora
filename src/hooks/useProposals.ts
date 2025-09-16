import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Proposal {
  id: string;
  name: string;
  dueDate: string;
  team: ProposalTeamMember[];
  reviewer: string;
  status: 'Draft' | 'In Progress' | 'Under Review' | 'Approved' | 'Rejected';
  created_at: string;
  updated_at: string;
  created_by: string;
  org_id: string;
}

export interface ProposalTeamMember {
  img?: string;
  label: string;
  bg?: string;
}

export interface CreateProposalData {
  name: string;
  dueDate: string;
  reviewer: string;
  team?: ProposalTeamMember[];
  status?: 'Draft' | 'In Progress' | 'Under Review' | 'Approved' | 'Rejected';
}

export const useProposals = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['proposals', user?.org_id],
    queryFn: async () => {
      if (!user?.org_id) throw new Error('No organization');
      
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('org_id', user.org_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to match expected format
      return (data || []).map((proposal: any): Proposal => ({
        id: proposal.id,
        name: proposal.name || proposal.title,
        dueDate: proposal.due_date || proposal.dueDate,
        team: proposal.team ? JSON.parse(proposal.team) : [],
        reviewer: proposal.reviewer || 'Unassigned',
        status: proposal.status || 'Draft',
        created_at: proposal.created_at,
        updated_at: proposal.updated_at,
        created_by: proposal.created_by,
        org_id: proposal.org_id
      }));
    },
    enabled: !!user?.org_id,
  });
};

export const useCreateProposal = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (proposalData: CreateProposalData) => {
      if (!user?.org_id || !user?.id) {
        throw new Error('User not authenticated or no organization');
      }

      const { data, error } = await supabase
        .from('proposals')
        .insert({
          name: proposalData.name,
          title: proposalData.name,
          due_date: proposalData.dueDate,
          dueDate: proposalData.dueDate,
          reviewer: proposalData.reviewer,
          team: JSON.stringify(proposalData.team || []),
          status: proposalData.status || 'Draft',
          org_id: user.org_id,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast({
        title: "Success",
        description: "Proposal created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create proposal",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProposal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string } & Partial<CreateProposalData>) => {
      const { data, error } = await supabase
        .from('proposals')
        .update({
          name: updateData.name,
          title: updateData.name,
          due_date: updateData.dueDate,
          dueDate: updateData.dueDate,
          reviewer: updateData.reviewer,
          team: updateData.team ? JSON.stringify(updateData.team) : undefined,
          status: updateData.status,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast({
        title: "Success",
        description: "Proposal updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update proposal",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProposal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (proposalId: string) => {
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', proposalId);

      if (error) throw error;
      return proposalId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast({
        title: "Success",
        description: "Proposal deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete proposal",
        variant: "destructive",
      });
    },
  });
};