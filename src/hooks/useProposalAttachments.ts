import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface ProposalAttachment {
  id: string;
  proposal_id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  uploaded_by: string;
  uploaded_at: string;
  user?: {
    full_name: string;
    email: string;
  };
}

export const useProposalAttachments = (proposalId: string) => {
  return useQuery({
    queryKey: ['proposal-attachments', proposalId],
    queryFn: async (): Promise<ProposalAttachment[]> => {
      const { data, error } = await supabase
        .from('proposal_attachments')
        .select(`
          *,
          profiles!proposal_attachments_uploaded_by_fkey(full_name, email)
        `)
        .eq('proposal_id', proposalId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return (data || []).map((attachment: any) => ({
        ...attachment,
        user: attachment.profiles
      }));
    },
    enabled: !!proposalId,
  });
};

export const useUploadProposalAttachment = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      proposal_id: string;
      file: File;
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Upload file to storage
      const fileExt = data.file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${data.proposal_id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('proposal-attachments')
        .upload(filePath, data.file);

      if (uploadError) throw uploadError;

      // Save metadata to database
      const { data: attachment, error: dbError } = await supabase
        .from('proposal_attachments')
        .insert({
          proposal_id: data.proposal_id,
          file_name: data.file.name,
          file_path: filePath,
          file_size: data.file.size,
          mime_type: data.file.type,
          uploaded_by: user.id,
        })
        .select(`
          *,
          profiles!proposal_attachments_uploaded_by_fkey(full_name, email)
        `)
        .single();

      if (dbError) throw dbError;
      return {
        ...attachment,
        user: attachment.profiles
      };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proposal-attachments', variables.proposal_id] });
      toast({
        title: "File uploaded",
        description: "File has been attached to the proposal.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProposalAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { 
      id: string; 
      proposal_id: string; 
      file_path: string; 
    }) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('proposal-attachments')
        .remove([data.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('proposal_attachments')
        .delete()
        .eq('id', data.id);

      if (dbError) throw dbError;
      return data.id;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proposal-attachments', variables.proposal_id] });
      toast({
        title: "File deleted",
        description: "Attachment has been removed from the proposal.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete file",
        variant: "destructive",
      });
    },
  });
};

export const useDownloadProposalAttachment = () => {
  return useMutation({
    mutationFn: async (data: { file_path: string; file_name: string }) => {
      const { data: file, error } = await supabase.storage
        .from('proposal-attachments')
        .download(data.file_path);

      if (error) throw error;
      
      // Create download link
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return true;
    },
    onError: (error: any) => {
      toast({
        title: "Download failed",
        description: error.message || "Failed to download file",
        variant: "destructive",
      });
    },
  });
};