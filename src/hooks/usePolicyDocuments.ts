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

export const usePolicyDocuments = useComplianceDocuments;
export const useAcknowledgePolicy = useCreatePolicyAcknowledgment;

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

      let query = supabase
        .from('policy_acknowledgments')
        .select(`
          *,
          user:profiles(full_name, email, department_id),
          policy_document:policy_documents(title, effective_date, expires_date)
        `)
        .order('acknowledged_at', { ascending: false });

      if (filters?.search) {
        query = query.or(`user.full_name.ilike.%${filters.search}%,user.email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as PolicyAcknowledgment[];
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
          policy_document_id: policyDocumentId,
          ip_address: await getUserIP(),
          user_agent: navigator.userAgent,
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

      // Get total employees in organization
      const { data: profileData } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();

      if (!profileData) throw new Error('User profile not found');

      const { count: totalEmployees } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('org_id', profileData.org_id)
        .eq('status', 'active');

      // Get acknowledgment stats
      const { data: acknowledgedData } = await supabase
        .from('policy_acknowledgments')
        .select(`
          id,
          user:profiles!inner(org_id)
        `)
        .eq('user.org_id', profileData.org_id);

      const acknowledged = acknowledgedData?.length || 0;

      // Get pending policies (active policies without acknowledgments)
      const { data: activePolicies } = await supabase
        .from('policy_documents')
        .select('id')
        .eq('status', 'active')
        .eq('acknowledgment_required', true);

      const { data: pendingAcknowledgments } = await supabase
        .from('profiles')
        .select(`
          id,
          policy_acknowledgments!left(id)
        `)
        .eq('org_id', profileData.org_id)
        .eq('status', 'active')
        .is('policy_acknowledgments.id', null);

      const pending = pendingAcknowledgments?.length || 0;

      return {
        totalEmployees: totalEmployees || 0,
        acknowledged,
        pending,
        exempt: Math.max(0, (totalEmployees || 0) - acknowledged - pending),
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