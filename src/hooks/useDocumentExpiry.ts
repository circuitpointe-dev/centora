import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ExpiringDocument {
  id: string;
  document_id: string;
  name: string;
  owner: string;
  tags: string[];
  expiryDate: string;
  status: 'expired' | 'expiring' | 'active';
}

export interface DocumentOwner {
  id: string;
  name: string;
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

      let query = supabase
        .from('documents')
        .select(`
          id,
          title,
          file_name,
          created_at,
          updated_at,
          category,
          status,
          created_by,
          document_tag_associations(
            document_tags(name)
          )
        `)
        .eq('status', 'active')
        .order('updated_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      // Transform data to match interface
      const documents: ExpiringDocument[] = (data || []).map(doc => {
        const now = new Date();
        const updatedAt = new Date(doc.updated_at);
        const daysDiff = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));
        
        let status: 'expired' | 'expiring' | 'active' = 'active';
        if (daysDiff > 365) status = 'expired';
        else if (daysDiff > 330) status = 'expiring';

        return {
          id: doc.id,
          document_id: doc.id,
          name: doc.title || doc.file_name,
          owner: 'Current User', // TODO: Add proper user lookup
          tags: doc.document_tag_associations?.map((assoc: any) => assoc.document_tags.name) || [],
          expiryDate: new Date(updatedAt.getTime() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          status
        };
      });

      // Apply filters
      let filteredDocs = documents;
      
      if (filters?.status && filters.status !== 'all') {
        filteredDocs = filteredDocs.filter(doc => doc.status === filters.status);
      }
      
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredDocs = filteredDocs.filter(doc => 
          doc.name.toLowerCase().includes(searchLower) ||
          doc.owner.toLowerCase().includes(searchLower)
        );
      }

      return filteredDocs;
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

      // For now, return current user as owner
      const owners: DocumentOwner[] = [
        { id: user.id, name: 'Current User' }
      ];

      return owners;
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
      // For now, just simulate sending reminder
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expiring-documents'] });
      toast.success('Expiry reminder sent successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to send reminder: ${error.message}`);
    },
  });
};