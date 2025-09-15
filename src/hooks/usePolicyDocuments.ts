import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { typedSupabase } from '@/lib/supabase-client';
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
  return useQuery({
    queryKey: ['compliance-documents', filters],
    queryFn: async () => {
      console.log('Fetching compliance documents from database...');
      
      let query = typedSupabase
        .from('policy_documents')
        .select(`
          id,
          effective_date,
          expires_date,
          department,
          acknowledgment_required,
          created_at,
          updated_at,
          document:documents(
            id,
            title,
            description,
            file_path,
            file_name,
            mime_type,
            status,
            created_by,
            updated_at
          )
        `);
      
      // Apply filters
      if (filters?.department && filters.department !== 'all') {
        query = query.eq('department', filters.department);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching policy documents:', error);
        throw error;
      }
      
      // Transform the data to match the expected interface
      return (data || []).map((policy: any): PolicyDocument => ({
        id: policy.id,
        title: policy.document?.title || 'Untitled Document',
        description: policy.document?.description || '',
        effective_date: policy.effective_date,
        expires_date: policy.expires_date || undefined,
        status: policy.document?.status === 'active' ? 'active' : 
               policy.document?.status === 'draft' ? 'draft' : 'expired',
        department: policy.department || undefined,
        document_id: policy.document?.id || '',
        acknowledgment_required: policy.acknowledgment_required || false,
        created_at: policy.created_at,
        updated_at: policy.updated_at,
        document: policy.document ? {
          file_name: policy.document.file_name,
          file_path: policy.document.file_path,
          mime_type: policy.document.mime_type
        } : undefined
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePolicyAcknowledgments = (filters?: {
  status?: string;
  department?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['policy-acknowledgments', filters],
    queryFn: async () => {
      console.log('Fetching policy acknowledgments from database...');
      
      let query = typedSupabase
        .from('policy_acknowledgments')
        .select(`
          id,
          user_id,
          document_id,
          status,
          acknowledged_at,
          created_at,
          updated_at,
          ip_address,
          user:profiles(
            id,
            full_name,
            email
          ),
          policy_document:documents(
            id,
            title
          )
        `);
      
      if (filters?.status && filters.status !== 'All Status') {
        query = query.eq('status', filters.status.toLowerCase());
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching policy acknowledgments:', error);
        throw error;
      }
      
      return (data || []).map((ack: any): PolicyAcknowledgment => ({
        id: ack.id,
        user_id: ack.user_id,
        policy_document_id: ack.document_id,
        acknowledged_at: ack.acknowledged_at || '',
        ip_address: ack.ip_address || undefined,
        user_agent: 'Browser',
        user: ack.user ? {
          full_name: ack.user.full_name || 'Unknown User',
          email: ack.user.email,
          department: 'General'
        } : undefined,
        policy_document: ack.policy_document ? {
          title: ack.policy_document.title,
          effective_date: new Date().toISOString().split('T')[0],
          expires_date: undefined
        } : undefined
      }));
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreatePolicyAcknowledgment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (policyDocumentId: string) => {
      console.log('Creating policy acknowledgment for:', policyDocumentId);
      
      const { data, error } = await typedSupabase
        .from('policy_acknowledgments')
        .insert({
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
      queryClient.invalidateQueries({ queryKey: ['policy-stats'] });
      queryClient.invalidateQueries({ queryKey: ['compliance-documents'] });
      toast.success('Policy acknowledged successfully');
    },
    onError: (error) => {
      toast.error('Failed to acknowledge policy');
      console.error('Acknowledgment error:', error);
    }
  });
};

export const usePolicyStats = () => {
  return useQuery({
    queryKey: ['policy-stats'],
    queryFn: async () => {
      console.log('Fetching policy statistics from database...');
      
      try {
        // Get total employees count
        const { count: totalEmployees, error: totalError } = await typedSupabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (totalError) {
          console.error('Error fetching total employees:', totalError);
        }
        
        // Get acknowledged count
        const { count: acknowledged, error: ackError } = await typedSupabase
          .from('policy_acknowledgments')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'acknowledged');
        
        if (ackError) {
          console.error('Error fetching acknowledged count:', ackError);
        }
        
        // Get pending count
        const { count: pending, error: pendingError } = await typedSupabase
          .from('policy_acknowledgments')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');
        
        if (pendingError) {
          console.error('Error fetching pending count:', pendingError);
        }
        
        // Get exempt count
        const { count: exempt, error: exemptError } = await typedSupabase
          .from('policy_acknowledgments')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'exempt');
        
        if (exemptError) {
          console.error('Error fetching exempt count:', exemptError);
        }
        
        return {
          totalEmployees: totalEmployees || 0,
          acknowledged: acknowledged || 0,
          pending: pending || 0,
          exempt: exempt || 0,
        };
      } catch (error) {
        console.error('Error in usePolicyStats:', error);
        // Return fallback data
        return {
          totalEmployees: 0,
          acknowledged: 0,
          pending: 0,
          exempt: 0,
        };
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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