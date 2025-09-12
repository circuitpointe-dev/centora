import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ExpiringDocument {
  id: string;
  name: string;
  owner: string;
  tags: string[];
  expiryDate: string;
  status: 'expired' | 'expiring' | 'active';
  created_by?: string;
  document_id: string;
}

export const useExpiringDocuments = (filters?: {
  status?: string;
  owner?: string;
  search?: string;
}) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['expiring-documents', filters],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('policy_documents')
        .select(`
          id,
          expires_date,
          document_id,
          documents!inner(
            title,
            created_by,
            org_id,
            profiles!created_by(full_name)
          ),
          document_tag_associations!left(
            document_tags!inner(name, color)
          )
        `)
        .not('expires_date', 'is', null)
        .order('expires_date', { ascending: true });

      if (error) throw error;

      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      let transformedData = (data || []).map((policy: any) => {
        const expiryDate = new Date(policy.expires_date);
        let status: 'expired' | 'expiring' | 'active' = 'active';

        if (expiryDate < now) {
          status = 'expired';
        } else if (expiryDate <= thirtyDaysFromNow) {
          status = 'expiring';
        }

        // Extract tags from associations
        const tags = policy.document_tag_associations?.map((assoc: any) => 
          assoc.document_tags?.name || 'General'
        ) || ['General'];

        return {
          id: policy.id,
          name: policy.documents?.title || 'Untitled Document',
          owner: policy.documents?.profiles?.full_name || 'Unknown',
          tags: tags.slice(0, 3), // Limit to first 3 tags
          expiryDate: policy.expires_date,
          status,
          created_by: policy.documents?.created_by,
          document_id: policy.document_id,
        };
      });

      // Apply filters
      if (filters?.status && filters.status !== 'all') {
        transformedData = transformedData.filter(doc => doc.status === filters.status);
      }

      if (filters?.owner && filters.owner !== 'all') {
        transformedData = transformedData.filter(doc => doc.owner === filters.owner);
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        transformedData = transformedData.filter(doc => 
          doc.name.toLowerCase().includes(searchLower) ||
          doc.owner.toLowerCase().includes(searchLower) ||
          doc.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      return transformedData as ExpiringDocument[];
    },
    enabled: !!user,
  });
};

export const useDocumentOwners = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['document-owners'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .not('full_name', 'is', null)
        .order('full_name');

      if (error) throw error;

      return (data || []).map(profile => ({
        id: profile.id,
        name: profile.full_name || 'Unknown User',
      }));
    },
    enabled: !!user,
  });
};

export const useSendExpiryReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      document_id: string;
      recipient_email: string;
      message: string;
    }) => {
      // In a real implementation, this would call an edge function to send email
      console.log('Sending expiry reminder:', params);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true };
    },
    onSuccess: () => {
      toast.success('Expiry reminder sent successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to send reminder: ${error.message}`);
    },
  });
};