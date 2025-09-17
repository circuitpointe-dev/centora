import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UploadComplianceFileParams {
  file: File;
  complianceId: string;
  grantId: string;
}

interface DownloadComplianceFileParams {
  filePath: string;
  fileName: string;
}

export const useUploadComplianceFile = () => {
  return useMutation({
    mutationFn: async ({ file, complianceId, grantId }: UploadComplianceFileParams) => {
      try {
        // Get current user for organization info
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) throw new Error('User not authenticated');

        const { data: profile } = await supabase
          .from('profiles')
          .select('org_id')
          .eq('id', user.user.id)
          .single();

        if (!profile?.org_id) throw new Error('User organization not found');

        // Create file path: org_id/grants/grant_id/compliance/compliance_id/filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${complianceId}_evidence.${fileExt}`;
        const filePath = `${profile.org_id}/grants/${grantId}/compliance/${complianceId}/${fileName}`;

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) throw uploadError;

        // Update compliance record with evidence document path
        const { data: complianceData, error: updateError } = await supabase
          .from('grant_compliance')
          .update({
            evidence_document: filePath
          })
          .eq('id', complianceId)
          .select()
          .single();

        if (updateError) throw updateError;

        return { uploadData, complianceData, fileName, filePath };
      } catch (error) {
        console.error('Error uploading compliance file:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Evidence document uploaded successfully');
    },
    onError: (error) => {
      console.error('Upload failed:', error);
      toast.error('Failed to upload evidence document');
    },
  });
};

export const useDownloadComplianceFile = () => {
  return useMutation({
    mutationFn: async ({ filePath, fileName }: DownloadComplianceFileParams) => {
      try {
        // Download file from Supabase Storage
        const { data, error } = await supabase.storage
          .from('documents')
          .download(filePath);

        if (error) throw error;

        // Create download link
        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        return data;
      } catch (error) {
        console.error('Error downloading compliance file:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('File downloaded successfully');
    },
    onError: (error) => {
      console.error('Download failed:', error);
      toast.error('Failed to download file');
    },
  });
};