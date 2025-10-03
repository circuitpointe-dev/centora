import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Proposal {
  id: string;
  name: string;
  title?: string;
  dueDate: string;
  team: ProposalTeamMember[];
  reviewer: string;
  status: 'draft' | 'in_progress' | 'under_review' | 'approved' | 'rejected';
  opportunity_id?: string;
  overview_fields?: any[];
  narrative_fields?: any[];
  budget_currency?: string;
  budget_amount?: number;
  logframe_fields?: any[];
  attachments?: any[];
  submission_status?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  org_id?: string;
}

export interface ProposalTeamMember {
  img?: string;
  label: string;
  bg?: string;
}

export const useProposals = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['proposals', user?.org_id],
    queryFn: async (): Promise<Proposal[]> => {
      if (!user?.org_id) throw new Error('No organization');

      const { data: proposalsData, error } = await supabase
        .from('proposals')
        .select(`
          id,
          name,
          title,
          due_date,
          duedate,
          reviewer,
          status,
          team,
          created_at,
          updated_at,
          created_by,
          org_id
        `)
        .eq('org_id', user.org_id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (proposalsData || []).map((proposal: any): Proposal => ({
        id: proposal.id,
        name: proposal.name || proposal.title || 'Untitled Proposal',
        dueDate: proposal.due_date ? new Date(proposal.due_date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }) : proposal.duedate || 'No due date',
        team: Array.isArray(proposal.team) ? proposal.team.map((member: any) => ({
          label: typeof member === 'string' ? member.substring(0, 2).toUpperCase() :
            member.label || member.name?.substring(0, 2).toUpperCase() || 'NA',
          img: member.img || member.avatar_url,
          bg: member.bg || (member.img || member.avatar_url ? undefined : 'bg-purple-100')
        })) : [],
        reviewer: proposal.reviewer || 'Unassigned',
        status: proposal.status || 'draft',
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
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      title?: string;
      dueDate?: string;
      reviewer?: string;
      opportunity_id?: string;
      overview_fields?: any[];
      narrative_fields?: any[];
      budget_currency?: string;
      budget_amount?: number;
      logframe_fields?: any[];
      attachments?: any[];
      submission_status?: string;
    }) => {
      if (!user?.org_id) throw new Error('No organization');

      const { data: proposal, error } = await supabase
        .from('proposals')
        .insert({
          name: data.name,
          title: data.title,
          org_id: user.org_id,
          due_date: data.dueDate,
          reviewer: data.reviewer,
          opportunity_id: data.opportunity_id,
          overview_fields: data.overview_fields || [],
          narrative_fields: data.narrative_fields || [],
          budget_currency: data.budget_currency || 'USD',
          budget_amount: data.budget_amount,
          logframe_fields: data.logframe_fields || [],
          attachments: data.attachments || [],
          submission_status: data.submission_status || 'draft',
          status: 'draft',
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return proposal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast({
        title: "Success",
        description: "Proposal created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create proposal",
        variant: "destructive",
      });
    }
  });
};

export const useUpdateProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      name?: string;
      title?: string;
      reviewer?: string;
      dueDate?: string;
      status?: string;
      opportunity_id?: string;
      overview_fields?: any[];
      narrative_fields?: any[];
      budget_currency?: string;
      budget_amount?: number;
      logframe_fields?: any[];
      attachments?: any[];
      submission_status?: string;
    }) => {
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.title !== undefined) updateData.title = data.title;
      if (data.reviewer !== undefined) updateData.reviewer = data.reviewer;
      if (data.dueDate !== undefined) updateData.due_date = data.dueDate;
      if (data.status !== undefined) updateData.status = data.status.toLowerCase().replace(' ', '_');
      if (data.opportunity_id !== undefined) updateData.opportunity_id = data.opportunity_id;
      if (data.overview_fields !== undefined) updateData.overview_fields = data.overview_fields;
      if (data.narrative_fields !== undefined) updateData.narrative_fields = data.narrative_fields;
      if (data.budget_currency !== undefined) updateData.budget_currency = data.budget_currency;
      if (data.budget_amount !== undefined) updateData.budget_amount = data.budget_amount;
      if (data.logframe_fields !== undefined) updateData.logframe_fields = data.logframe_fields;
      if (data.attachments !== undefined) updateData.attachments = data.attachments;
      if (data.submission_status !== undefined) updateData.submission_status = data.submission_status;

      const { data: proposal, error } = await supabase
        .from('proposals')
        .update(updateData)
        .eq('id', data.id)
        .select()
        .single();

      if (error) throw error;
      return proposal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast({
        title: "Success",
        description: "Proposal updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update proposal",
        variant: "destructive",
      });
    }
  });
};

export const useDeleteProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast({
        title: "Success",
        description: "Proposal deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete proposal",
        variant: "destructive",
      });
    }
  });
};