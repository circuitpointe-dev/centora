import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface SubmissionMilestone {
  id: string;
  proposal_id: string;
  milestone_name: string;
  status: string;
  due_date: string | null;
  completed_date: string | null;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  user?: {
    full_name: string;
    email: string;
  };
}

export const useSubmissionTracker = (proposalId: string) => {
  return useQuery({
    queryKey: ['submission-tracker', proposalId],
    queryFn: async (): Promise<SubmissionMilestone[]> => {
      const { data, error } = await supabase
        .from('submission_tracker')
        .select(`
          *,
          profiles!submission_tracker_created_by_fkey(full_name, email)
        `)
        .eq('proposal_id', proposalId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return (data || []).map((milestone: any) => ({
        ...milestone,
        user: milestone.profiles
      }));
    },
    enabled: !!proposalId,
  });
};

export const useCreateSubmissionMilestone = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      proposal_id: string;
      milestone_name: string;
      status?: string;
      due_date?: string;
      notes?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data: milestone, error } = await supabase
        .from('submission_tracker')
        .insert({
          proposal_id: data.proposal_id,
          milestone_name: data.milestone_name,
          status: data.status || 'pending',
          due_date: data.due_date,
          notes: data.notes,
          created_by: user.id,
        })
        .select(`
          *,
          profiles!submission_tracker_created_by_fkey(full_name, email)
        `)
        .single();

      if (error) throw error;
      return {
        ...milestone,
        user: milestone.profiles
      };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submission-tracker', variables.proposal_id] });
      toast({
        title: "Milestone created",
        description: "New submission milestone has been added.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create milestone",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSubmissionMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      proposal_id: string;
      status?: string;
      completed_date?: string;
      notes?: string;
    }) => {
      const updateData: any = {};
      if (data.status) updateData.status = data.status;
      if (data.completed_date !== undefined) updateData.completed_date = data.completed_date;
      if (data.notes !== undefined) updateData.notes = data.notes;

      const { data: milestone, error } = await supabase
        .from('submission_tracker')
        .update(updateData)
        .eq('id', data.id)
        .select(`
          *,
          profiles!submission_tracker_created_by_fkey(full_name, email)
        `)
        .single();

      if (error) throw error;
      return {
        ...milestone,
        user: milestone.profiles
      };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submission-tracker', variables.proposal_id] });
      toast({
        title: "Milestone updated",
        description: "Submission milestone has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update milestone",
        variant: "destructive",
      });
    },
  });
};