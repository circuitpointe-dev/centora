import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface PolicyDocument {
  id: string;
  title: string;
  version: string;
  status: 'Acknowledged' | 'Pending' | 'Expired';
  description: string;
  department: string;
  effective_date: string;
  expires_date: string;
  last_updated: string;
  document_id: string;
  policy_content: {
    overview: string;
    scope: string;
    keyGuidelines: string[];
    conflictsOfInterest: string;
    consequences: string;
  };
  // Acknowledgment info
  acknowledged_at?: string;
  user_acknowledged?: boolean;
}

export interface ComplianceDocument {
  id: string;
  title: string;
  description: string;
  department: string;
  effective_date: string;
  expires_date: string;
  status: 'Active' | 'Pending' | 'Retired';
  document_id: string;
}

export const usePolicyDocuments = (filters?: {
  status?: string;
  department?: string;
  search?: string;
}) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['policy-documents', filters],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('policy_documents')
        .select(`
          *,
          document:documents(title, version, file_name, created_at, updated_at),
          acknowledgment:policy_acknowledgments(acknowledged_at)
        `)
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      // Transform data to match expected format
      const transformedData = data.map((policy: any) => {
        const document = policy.document;
        const acknowledgment = policy.acknowledgment?.[0];
        
        // Determine status based on dates and acknowledgment
        let status: 'Acknowledged' | 'Pending' | 'Expired' = 'Pending';
        const now = new Date();
        const expiresDate = policy.expires_date ? new Date(policy.expires_date) : null;
        
        if (expiresDate && expiresDate < now) {
          status = 'Expired';
        } else if (acknowledgment?.acknowledged_at) {
          status = 'Acknowledged';
        }

        return {
          id: policy.id,
          title: document?.title || 'Untitled Policy',
          version: document?.version || '1.0',
          status,
          description: policy.description || '',
          department: policy.department || 'General',
          effective_date: policy.effective_date,
          expires_date: policy.expires_date,
          last_updated: document?.updated_at || policy.updated_at,
          document_id: policy.document_id,
          policy_content: policy.policy_content || {
            overview: '',
            scope: '',
            keyGuidelines: [],
            conflictsOfInterest: '',
            consequences: ''
          },
          acknowledged_at: acknowledgment?.acknowledged_at,
          user_acknowledged: !!acknowledgment?.acknowledged_at,
        };
      });

      // Apply filters
      let filteredData = transformedData;

      if (filters?.status && filters.status !== 'all') {
        filteredData = filteredData.filter(policy => policy.status === filters.status);
      }

      if (filters?.department && filters.department !== 'all') {
        filteredData = filteredData.filter(policy => policy.department === filters.department);
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(policy => 
          policy.title.toLowerCase().includes(searchLower) ||
          policy.description.toLowerCase().includes(searchLower) ||
          policy.department.toLowerCase().includes(searchLower)
        );
      }

      return filteredData;
    },
    enabled: !!user,
  });
};

export const useComplianceDocuments = (filters?: {
  status?: string;
  department?: string;
  search?: string;
}) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['compliance-documents', filters],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('policy_documents')
        .select(`
          *,
          document:documents(title, description)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform to compliance document format
      const transformedData = data.map((policy: any) => {
        const document = policy.document;
        
        // Determine status based on dates
        let status: 'Active' | 'Pending' | 'Retired' = 'Active';
        const now = new Date();
        const effectiveDate = new Date(policy.effective_date);
        const expiresDate = policy.expires_date ? new Date(policy.expires_date) : null;
        
        if (effectiveDate > now) {
          status = 'Pending';
        } else if (expiresDate && expiresDate < now) {
          status = 'Retired';
        }

        return {
          id: policy.id,
          title: document?.title || 'Untitled Document',
          description: document?.description || policy.description || '',
          department: policy.department || 'General',
          effective_date: policy.effective_date,
          expires_date: policy.expires_date,
          status,
          document_id: policy.document_id,
        };
      });

      // Apply filters
      let filteredData = transformedData;

      if (filters?.status && filters.status !== 'all') {
        filteredData = filteredData.filter(doc => doc.status === filters.status);
      }

      if (filters?.department && filters.department !== 'all') {
        filteredData = filteredData.filter(doc => doc.department === filters.department);
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(doc => 
          doc.title.toLowerCase().includes(searchLower) ||
          doc.description.toLowerCase().includes(searchLower) ||
          doc.department.toLowerCase().includes(searchLower)
        );
      }

      return filteredData;
    },
    enabled: !!user,
  });
};

export const useAcknowledgePolicy = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (policyDocumentId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('policy_acknowledgments')
        .upsert({
          policy_document_id: policyDocumentId,
          user_id: user.id,
          acknowledged_at: new Date().toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy-documents'] });
      toast.success('Policy acknowledged successfully');
    },
    onError: (error) => {
      toast.error(`Failed to acknowledge policy: ${error.message}`);
    },
  });
};