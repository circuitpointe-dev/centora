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
      
      // Query documents with category 'compliance' and join with policy_documents
      let query = typedSupabase
        .from('documents')
        .select(`
          *,
          policy_documents!inner(
            id,
            effective_date,
            expires_date,
            department,
            acknowledgment_required,
            created_at,
            updated_at
          )
        `)
        .eq('category', 'compliance');
      
      // Apply filters
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.department && filters.department !== 'all') {
        query = query.eq('policy_documents.department', filters.department);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching policy documents:', error);
        throw error;
      }
      
      // Transform the data to match the expected interface
      return (data || []).map((doc: any): PolicyDocument => ({
        id: doc.policy_documents[0]?.id || doc.id,
        title: doc.title || 'Untitled Document',
        description: doc.description || '',
        effective_date: doc.policy_documents[0]?.effective_date || doc.created_at.split('T')[0],
        expires_date: doc.policy_documents[0]?.expires_date || undefined,
        status: doc.status as 'active' | 'draft' | 'expired',
        department: doc.policy_documents[0]?.department || undefined,
        document_id: doc.id,
        acknowledgment_required: doc.policy_documents[0]?.acknowledgment_required ?? true,
        created_at: doc.created_at,
        updated_at: doc.updated_at,
        document: {
          file_name: doc.file_name,
          file_path: doc.file_path,
          mime_type: doc.mime_type
        }
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
          *,
          profiles!inner(
            id,
            full_name,
            email,
            department_id
          ),
          documents!inner(
            id,
            title,
            org_id
          )
        `);
      
      if (filters?.status && filters.status !== 'All Status') {
        query = query.eq('status', filters.status.toLowerCase());
      }

      if (filters?.search) {
        query = query.or(`profiles.full_name.ilike.%${filters.search}%,profiles.email.ilike.%${filters.search}%,documents.title.ilike.%${filters.search}%`);
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
        user: ack.profiles ? {
          full_name: ack.profiles.full_name || 'Unknown User',
          email: ack.profiles.email,
          department: 'General'
        } : undefined,
        policy_document: ack.documents ? {
          title: ack.documents.title,
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
        // Get user's organization first
        const { data: profileData } = await typedSupabase
          .from('profiles')
          .select('org_id')
          .eq('id', (await typedSupabase.auth.getUser()).data.user?.id)
          .single();

        if (!profileData?.org_id) {
          return {
            totalEmployees: 0,
            acknowledged: 0,
            pending: 0,
            exempt: 0,
          };
        }
        
        // Get total employees count for the organization
        const { count: totalEmployees, error: totalError } = await typedSupabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('org_id', profileData.org_id);
        
        if (totalError) {
          console.error('Error fetching total employees:', totalError);
        }
        
        // Get acknowledged count for documents in the same org
        const { count: acknowledged, error: ackError } = await typedSupabase
          .from('policy_acknowledgments')
          .select('*, documents!inner(org_id)', { count: 'exact', head: true })
          .eq('status', 'acknowledged')
          .eq('documents.org_id', profileData.org_id);
        
        if (ackError) {
          console.error('Error fetching acknowledged count:', ackError);
        }
        
        // Get pending count
        const { count: pending, error: pendingError } = await typedSupabase
          .from('policy_acknowledgments')
          .select('*, documents!inner(org_id)', { count: 'exact', head: true })
          .eq('status', 'pending')
          .eq('documents.org_id', profileData.org_id);
        
        if (pendingError) {
          console.error('Error fetching pending count:', pendingError);
        }
        
        // Get exempt count
        const { count: exempt, error: exemptError } = await typedSupabase
          .from('policy_acknowledgments')
          .select('*, documents!inner(org_id)', { count: 'exact', head: true })
          .eq('status', 'exempt')
          .eq('documents.org_id', profileData.org_id);
        
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