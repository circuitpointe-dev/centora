import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDownloadGrantReportFile = () => {
  return useMutation({
    mutationFn: async ({ filePath, fileName }: { filePath: string; fileName: string }) => {
      // Try to download from proposal-attachments bucket first, then documents
      let data, error;
      
      // Try proposal-attachments bucket first
      ({ data, error } = await supabase.storage
        .from("proposal-attachments")
        .download(filePath));

      // If not found, try documents bucket
      if (error) {
        ({ data, error } = await supabase.storage
          .from("documents")
          .download(filePath));
      }

      if (error) throw error;

      // Create download link
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast.success('File download started');
    },
    onError: (error: any) => {
      toast.error(`Failed to download file: ${error.message || 'Please try again'}`);
    },
  });
};

export const useUploadGrantReportFile = () => {
  return useMutation({
    mutationFn: async ({ 
      file, 
      reportId, 
      grantId 
    }: { 
      file: File; 
      reportId: string; 
      grantId: string; 
    }) => {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `${grantId}/${reportId}/${Date.now()}.${fileExt}`;

      // Upload to proposal-attachments bucket
      const { data, error } = await supabase.storage
        .from("proposal-attachments")
        .upload(filePath, file);

      if (error) throw error;

      // Update the grant report with file info
      const { error: updateError } = await supabase
        .from('grant_reports')
        .update({
          file_name: file.name,
          file_path: data.path,
        })
        .eq('id', reportId);

      if (updateError) throw updateError;

      return { filePath: data.path, fileName: file.name };
    },
    onSuccess: () => {
      toast.success('File uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to upload file: ${error.message || 'Please try again'}`);
    },
  });
};