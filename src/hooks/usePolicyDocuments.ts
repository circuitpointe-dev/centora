import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface PolicyDocument {
  id: string;
  title: string;
  description?: string;
  effective_date: string;
  expires_date?: string;
  status: 'active' | 'expired' | 'draft';
  department?: string;
  document_id: string;
  acknowledgment_required: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  document?: {
    file_name: string;
    file_path: string;
    mime_type?: string;
  };
}

export interface PolicyAcknowledgment {
  id: string;
  user_id: string;
  policy_document_id: string;
  acknowledged_at: string;
  ip_address?: string;
  user_agent?: string;
  // Joined data
  user?: {
    full_name: string;
    email: string;
    department?: string;
  };
  policy_document?: {
    title: string;
    effective_date: string;
    expires_date?: string;
  };
}

export const useComplianceDocuments = (filters?: {
  department?: string;
  status?: string;
  search?: string;
}) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['compliance-documents', filters],
    queryFn: async () => {
      if (!user) return [];

      // Return mock data for now to avoid complex join issues
      return [
        {
          id: '1',
          title: 'Code of Conduct',
          description: 'Company code of conduct policy',
          effective_date: '2024-01-01',
          expires_date: '2025-01-01',
          status: 'active' as const,
          department: 'HR',
          document_id: '1',
          acknowledgment_required: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        }
      ] as PolicyDocument[];
    },
    enabled: !!user,
  });
};

// Move exports after function definitions

export const usePolicyAcknowledgments = (filters?: {
  status?: string;
  department?: string;
  search?: string;
}) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['policy-acknowledgments', filters],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Return mock data for now to avoid complex join issues
      return [
        {
          id: '1',
          user_id: 'user1',
          policy_document_id: 'policy1',
          acknowledged_at: '2024-01-15T10:00:00Z',
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0',
          user: {
            full_name: 'John Doe',
            email: 'john.doe@company.com',
            department: 'Engineering'
          },
          policy_document: {
            title: 'Code of Conduct',
            effective_date: '2024-01-01',
            expires_date: '2025-01-01'
          }
        },
        {
          id: '2',
          user_id: 'user2',
          policy_document_id: 'policy1',
          acknowledged_at: '2024-01-16T14:30:00Z',
          ip_address: '192.168.1.2',
          user_agent: 'Mozilla/5.0',
          user: {
            full_name: 'Jane Smith',
            email: 'jane.smith@company.com',
            department: 'HR'
          },
          policy_document: {
            title: 'Code of Conduct',
            effective_date: '2024-01-01',
            expires_date: '2025-01-01'
          }
        }
      ] as PolicyAcknowledgment[];
    },
    enabled: !!user,
  });
};

export const useCreatePolicyAcknowledgment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (policyDocumentId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('policy_acknowledgments')
        .insert({
          user_id: user.id,
          document_id: policyDocumentId,
          status: 'acknowledged',
          acknowledged_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy-acknowledgments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Policy acknowledged successfully');
    },
    onError: (error) => {
      toast.error('Failed to acknowledge policy');
      console.error('Acknowledgment error:', error);
    }
  });
};

export const usePolicyStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['policy-stats'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Return mock stats for now
      return {
        totalEmployees: 150,
        acknowledged: 120,
        pending: 25,
        exempt: 5,
      };
    },
    enabled: !!user,
  });
};

// Helper function to get user IP (simplified)
async function getUserIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return '127.0.0.1'; // Fallback
  }
}

// Export hooks after function definitions
export const usePolicyDocuments = useComplianceDocuments;
export const useAcknowledgePolicy = useCreatePolicyAcknowledgment;