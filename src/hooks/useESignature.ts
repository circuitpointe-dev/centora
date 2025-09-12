import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface SignatureRequest {
  id: string;
  document_id: string;
  signer_email: string;
  signer_name?: string;
  status: 'pending' | 'signed' | 'declined' | 'expired';
  expires_at?: string;
  signed_at?: string;
  signature_data?: any;
  created_at: string;
  document?: {
    title: string;
    file_name: string;
  };
}

export interface SignatureStats {
  pending: number;
  overdue: number;
  signed: number;
  declined: number;
}

export const useSignatureRequests = (filters?: {
  status?: string;
  search?: string;
}) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['signature-requests', filters],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('document_signatures')
        .select(`
          *,
          documents(title, file_name)
        `)
        .order('created_at', { ascending: false });

      // Apply org filter through document relationship
      // Since we don't have org_id directly on signatures, we filter through documents
      
      const { data, error } = await query;
      if (error) throw error;

      let filteredData = data || [];

      // Apply filters
      if (filters?.status && filters.status !== 'all') {
        filteredData = filteredData.filter(req => req.status === filters.status);
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(req => 
          (req.documents as any)?.title?.toLowerCase().includes(searchLower) ||
          req.signer_email.toLowerCase().includes(searchLower) ||
          req.signer_name?.toLowerCase().includes(searchLower)
        );
      }

      return filteredData.map(req => ({
        id: req.id,
        document_id: req.document_id,
        signer_email: req.signer_email,
        signer_name: req.signer_name,
        status: req.status,
        expires_at: req.expires_at,
        signed_at: req.signed_at,
        signature_data: req.signature_data,
        created_at: req.created_at,
        document: (req.documents as any) ? {
          title: (req.documents as any).title || 'Untitled Document',
          file_name: (req.documents as any).file_name || 'document.pdf'
        } : undefined,
      })) as SignatureRequest[];
    },
    enabled: !!user,
  });
};

export const useSignatureStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['signature-stats'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('document_signatures')
        .select(`
          status,
          expires_at
        `);

      if (error) throw error;

      const now = new Date();
      const stats = {
        pending: 0,
        overdue: 0,
        signed: 0,
        declined: 0,
      };

      data?.forEach(req => {
        if (req.status === 'signed') {
          stats.signed++;
        } else if (req.status === 'declined') {
          stats.declined++;
        } else if (req.status === 'pending') {
          stats.pending++;
          if (req.expires_at && new Date(req.expires_at) < now) {
            stats.overdue++;
          }
        }
      });

      return stats as SignatureStats;
    },
    enabled: !!user,
  });
};

export const useCreateSignatureRequest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (params: {
      document_id: string;
      signer_email: string;
      signer_name?: string;
      expires_at?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('document_signatures')
        .insert({
          document_id: params.document_id,
          signer_email: params.signer_email,
          signer_name: params.signer_name,
          expires_at: params.expires_at,
          status: 'pending',
          created_by: user.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signature-requests'] });
      queryClient.invalidateQueries({ queryKey: ['signature-stats'] });
      toast.success('Signature request sent successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to send signature request: ${error.message}`);
    },
  });
};

export const useUpdateSignatureRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      status?: 'signed' | 'declined';
      signature_data?: any;
    }) => {
      const updateData: any = {
        status: params.status,
      };

      if (params.status === 'signed') {
        updateData.signed_at = new Date().toISOString();
        updateData.signature_data = params.signature_data;
      }

      const { error } = await supabase
        .from('document_signatures')
        .update(updateData)
        .eq('id', params.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signature-requests'] });
      queryClient.invalidateQueries({ queryKey: ['signature-stats'] });
      toast.success('Signature request updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update signature request: ${error.message}`);
    },
  });
};

export const useDeleteSignatureRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('document_signatures')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signature-requests'] });
      queryClient.invalidateQueries({ queryKey: ['signature-stats'] });
      toast.success('Signature request deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete signature request: ${error.message}`);
    },
  });
};