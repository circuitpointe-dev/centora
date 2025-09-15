import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDocumentDownload = () => {
  return useMutation({
    mutationFn: async (documentId: string) => {
      const { data, error } = await supabase.functions.invoke('document-operations', {
        body: {
          operation: 'download',
          documentId
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Create blob and download
      const byteCharacters = atob(data.content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: data.mimeType });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Document downloaded successfully');
    },
    onError: (error) => {
      toast.error('Failed to download document');
      console.error('Download error:', error);
    }
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
      const { data, error } = await supabase.functions.invoke('document-operations', {
        body: {
          operation: 'download',
          documentId
        }
      });

      if (error) throw error;
      
      // Create blob URL for preview
      const byteCharacters = atob(data.content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: data.mimeType });
      
      return {
        url: window.URL.createObjectURL(blob),
        fileName: data.fileName,
        mimeType: data.mimeType
      };
    },
    onError: (error) => {
      toast.error('Failed to preview document');
      console.error('Preview error:', error);
    }
  });
};