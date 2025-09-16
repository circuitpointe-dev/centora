import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface ProposalVersion {
  id: string;
  proposal_id: string;
  version_number: string;
  changes_description: string | null;
  created_by: string;
  created_at: string;
  user?: {
    full_name: string;
    email: string;
  };
}

export const useProposalVersions = (proposalId: string) => {
  return useQuery({
    queryKey: ['proposal-versions', proposalId],
    queryFn: async (): Promise<ProposalVersion[]> => {
      const { data, error } = await supabase
        .from('proposal_versions')
        .select(`
          *,
          profiles!proposal_versions_created_by_fkey(full_name, email)
        `)
        .eq('proposal_id', proposalId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map((version: any) => ({
        ...version,
        user: version.profiles
      }));
    },
    enabled: !!proposalId,
  });
};

export const useCreateProposalVersion = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      proposal_id: string;
      version_number: string;
      changes_description?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data: version, error } = await supabase
        .from('proposal_versions')
        .insert({
          proposal_id: data.proposal_id,
          version_number: data.version_number,
          changes_description: data.changes_description,
          created_by: user.id,
        })
        .select(`
          *,
          profiles!proposal_versions_created_by_fkey(full_name, email)
        `)
        .single();

      if (error) throw error;
      return {
        ...version,
        user: version.profiles
      };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proposal-versions', variables.proposal_id] });
      toast({
        title: "Version created",
        description: "New proposal version has been created.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create version",
        variant: "destructive",
      });
    },
  });
};