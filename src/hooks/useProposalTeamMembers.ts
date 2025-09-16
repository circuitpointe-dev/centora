import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface ProposalTeamMember {
  id: string;
  proposal_id: string;
  user_id?: string;
  name: string;
  role: string;
  created_at: string;
  created_by: string;
}

export const useProposalTeamMembers = (proposalId: string) => {
  return useQuery({
    queryKey: ['proposal-team-members', proposalId],
    queryFn: async (): Promise<ProposalTeamMember[]> => {
      const { data, error } = await supabase
        .from('proposal_team_members')
        .select('*')
        .eq('proposal_id', proposalId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!proposalId,
  });
};

export const useAddProposalTeamMember = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      proposal_id: string;
      user_id?: string;
      name: string;
      role: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data: member, error } = await supabase
        .from('proposal_team_members')
        .insert({
          proposal_id: data.proposal_id,
          user_id: data.user_id,
          name: data.name,
          role: data.role,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return member;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proposal-team-members', variables.proposal_id] });
      toast({
        title: "Team member added",
        description: "Team member has been added to the proposal.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add team member",
        variant: "destructive",
      });
    },
  });
};

export const useRemoveProposalTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; proposal_id: string }) => {
      const { error } = await supabase
        .from('proposal_team_members')
        .delete()
        .eq('id', data.id);

      if (error) throw error;
      return data.id;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proposal-team-members', variables.proposal_id] });
      toast({
        title: "Team member removed",
        description: "Team member has been removed from the proposal.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove team member",
        variant: "destructive",
      });
    },
  });
};