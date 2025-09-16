import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { proposals } from '@/components/proposal-management/ProposalData';

export interface Proposal {
  id: string;
  name: string;
  dueDate: string;
  team: ProposalTeamMember[];
  reviewer: string;
  status: 'Draft' | 'In Progress' | 'Under Review' | 'Approved' | 'Rejected';
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

// For now, use mock data until proposals table is fully integrated
export const useProposals = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['proposals', user?.org_id],
    queryFn: async (): Promise<Proposal[]> => {
      // Transform mock data to match expected format
      return proposals.map((proposal: any): Proposal => ({
        id: proposal.id,
        name: proposal.name,
        dueDate: proposal.dueDate,
        team: proposal.team || [],
        reviewer: proposal.reviewer || 'Unassigned',
        status: 'In Progress' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: user?.id || '',
        org_id: user?.org_id || ''
      }));
    },
    enabled: !!user?.org_id,
  });
};

// Mock mutations for now
export const useCreateProposal = () => {
  return {
    mutateAsync: async (data: any) => {
      console.log('Creating proposal:', data);
      return { id: 'new-proposal', ...data };
    }
  };
};

export const useUpdateProposal = () => {
  return {
    mutateAsync: async (data: any) => {
      console.log('Updating proposal:', data);
      return data;
    }
  };
};

export const useDeleteProposal = () => {
  return {
    mutateAsync: async (id: string) => {
      console.log('Deleting proposal:', id);
      return id;
    }
  };
};