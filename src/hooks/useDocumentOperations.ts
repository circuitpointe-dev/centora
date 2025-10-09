import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { downloadFile, getFileUrl } from './useDocumentStorage';

export const useDocumentDownload = () => {
  return useMutation({
    mutationFn: async (documentId: string) => {
      // Get document details first
      const { data: document, error: docError } = await supabase
        .from('documents')
        .select('file_path, file_name, mime_type')
        .eq('id', documentId)
        .single();

      if (docError) throw docError;

      try {
        // Download from storage
        const blob = await downloadFile(document.file_path);

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = window.document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.download = document.file_name;
        window.document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        window.document.body.removeChild(link);
      } catch (storageError) {
        // Fallback: try edge function
        const { data, error } = await supabase.functions.invoke('document-operations', {
          body: { operation: 'download', documentId }
        });

        if (error) throw error;

        const blob = new Blob([data.content], { type: data.mimeType });
        const url = window.URL.createObjectURL(blob);
        const link = window.document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.download = data.fileName;
        window.document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        window.document.body.removeChild(link);
      }
    },
    onSuccess: () => {
      toast.success('Document downloaded successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to download document: ${error.message}`);
    },
  });
};

export const useDocumentDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      const { data, error } = await supabase.functions.invoke('document-operations', {
        body: {
          operation: 'delete',
          documentId
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Document deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete document');
      console.error('Delete error:', error);
    }
  });
};

export const useDocumentPreview = () => {
  return useMutation({
    mutationFn: async (documentId: string) => {
      // Get document details first
      const { data: document, error: docError } = await supabase
        .from('documents')
        .select('file_path, file_name, mime_type, file_size')
        .eq('id', documentId)
        .single();

      if (docError) throw docError;

      try {
        // Download the file as blob and create object URL
        const blob = await downloadFile(document.file_path);
        const url = window.URL.createObjectURL(blob);

        return {
          url,
          fileName: document.file_name,
          mimeType: document.mime_type,
          size: document.file_size
        };
      } catch (error) {
        // Fallback: try edge function
        const { data, error: funcError } = await supabase.functions.invoke('document-operations', {
          body: { operation: 'download', documentId }
        });

        if (funcError) throw funcError;

        const blob = new Blob([data.content], { type: data.mimeType });
        const url = window.URL.createObjectURL(blob);

        return {
          url,
          fileName: data.fileName,
          mimeType: data.mimeType,
          size: data.size
        };
      }
    },
    onError: (error: any) => {
      toast.error(`Failed to preview document: ${error.message}`);
    },
  });
};