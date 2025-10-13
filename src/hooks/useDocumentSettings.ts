import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface DocumentSettings {
  id?: string;
  org_id?: string;
  auto_save: boolean;
  max_file_size: number;
  allowed_formats: string;
  retention_period: number;
  virus_scanning: boolean;
  file_encryption: boolean;
  audit_logging: boolean;
  default_access_level: string;
  allow_sharing: boolean;
  allow_bulk_operations: boolean;
  allow_template_creation: boolean;
  require_upload_approval: boolean;
  daily_backup: boolean;
  cloud_sync: boolean;
}

export const useDocumentSettings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['document-settings'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get user's org_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();

      if (!profile?.org_id) throw new Error('User org not found');

      const { data, error } = await supabase
        .from('document_settings')
        .select('*')
        .eq('org_id', profile.org_id)
        .maybeSingle();

      if (error) throw error;

      // Return default settings if none exist
      if (!data) {
        return {
          auto_save: true,
          max_file_size: 50,
          allowed_formats: 'pdf,doc,docx,xls,xlsx,ppt,pptx,txt,jpg,png',
          retention_period: 7,
          virus_scanning: true,
          file_encryption: true,
          audit_logging: true,
          default_access_level: 'organization',
          allow_sharing: true,
          allow_bulk_operations: true,
          allow_template_creation: true,
          require_upload_approval: false,
          daily_backup: true,
          cloud_sync: true,
        } as DocumentSettings;
      }

      return data as DocumentSettings;
    },
    enabled: !!user,
  });
};

export const useSaveDocumentSettings = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (settings: DocumentSettings) => {
      if (!user) throw new Error('User not authenticated');

      // Get user's org_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();

      if (!profile?.org_id) throw new Error('User org not found');

      // Check if settings exist
      const { data: existing } = await supabase
        .from('document_settings')
        .select('id')
        .eq('org_id', profile.org_id)
        .maybeSingle();

      if (existing) {
        // Update existing settings
        const { data, error } = await supabase
          .from('document_settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString(),
          })
          .eq('org_id', profile.org_id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Insert new settings
        const { data, error } = await supabase
          .from('document_settings')
          .insert({
            ...settings,
            org_id: profile.org_id,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-settings'] });
      toast.success('Settings saved successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to save settings: ${error.message}`);
    },
  });
};
