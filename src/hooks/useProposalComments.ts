import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface ProposalComment {
  id: string;
  proposal_id: string;
  content: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  user?: {
    full_name: string;
    email: string;
  };
}

export const useProposalComments = (proposalId: string) => {
  return useQuery({
    queryKey: ['proposal-comments', proposalId],
    queryFn: async (): Promise<ProposalComment[]> => {
      const { data, error } = await supabase
        .from('proposal_comments')
        .select(`
          *,
          profiles!proposal_comments_created_by_fkey(full_name, email)
        `)
        .eq('proposal_id', proposalId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map((comment: any) => ({
        ...comment,
        user: comment.profiles
      }));
    },
    enabled: !!proposalId,
  });
};

export const useAddProposalComment = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      proposal_id: string;
      content: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data: comment, error } = await supabase
        .from('proposal_comments')
        .insert({
          proposal_id: data.proposal_id,
          content: data.content,
          created_by: user.id,
        })
        .select(`
          *,
          profiles!proposal_comments_created_by_fkey(full_name, email)
        `)
        .single();

      if (error) throw error;
      return {
        ...comment,
        user: comment.profiles
      };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proposal-comments', variables.proposal_id] });
      toast({
        title: "Comment added",
        description: "Your comment has been added to the proposal.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add comment",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProposalComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; proposal_id: string }) => {
      const { error } = await supabase
        .from('proposal_comments')
        .delete()
        .eq('id', data.id);

      if (error) throw error;
      return data.id;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proposal-comments', variables.proposal_id] });
      toast({
        title: "Comment deleted",
        description: "Comment has been deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete comment",
        variant: "destructive",
      });
    },
  });
};