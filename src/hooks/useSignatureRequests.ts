import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface SignatureRequest {
  id: string;
  document_id: string;
  signer_name?: string;
  signer_email: string;
  status: 'pending' | 'signed' | 'declined' | 'expired';
  created_at: string;
  signed_at?: string;
  expires_at?: string;
  signature_data?: any;
  documents?: {
    title: string;
    file_name: string;
  };
}

export const useSignatureRequests = (filters?: {
  status?: 'pending' | 'signed' | 'declined' | 'expired';
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

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;
      if (error) throw error;

      let filteredData = data || [];

      // Apply search filter
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(request => 
          request.signer_name?.toLowerCase().includes(searchLower) ||
          request.signer_email?.toLowerCase().includes(searchLower) ||
          request.documents?.title?.toLowerCase().includes(searchLower)
        );
      }

      return filteredData as SignatureRequest[];
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
      signer_name?: string;
      signer_email: string;
      expires_at?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('document_signatures')
        .insert({
          document_id: params.document_id,
          signer_name: params.signer_name,
          signer_email: params.signer_email,
          expires_at: params.expires_at,
          status: 'pending',
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signature-requests'] });
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
        signature_data: params.signature_data,
      };

      if (params.status === 'signed') {
        updateData.signed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('document_signatures')
        .update(updateData)
        .eq('id', params.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signature-requests'] });
      toast.success('Signature request updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update signature request: ${error.message}`);
    },
  });
};