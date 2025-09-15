import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get the public URL for the uploaded file
    const { data: publicData } = supabase.storage
      .from('documents')
      .getPublicUrl(path);

    return publicData.publicUrl;
  } catch (error: any) {
    toast.error(`Failed to upload file: ${error.message}`);
    throw error;
  }
};

export const downloadFile = async (path: string): Promise<Blob> => {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .download(path);

    if (error) throw error;
    return data;
  } catch (error: any) {
    toast.error(`Failed to download file: ${error.message}`);
    throw error;
  }
};

export const deleteFile = async (path: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from('documents')
      .remove([path]);

    if (error) throw error;
  } catch (error: any) {
    toast.error(`Failed to delete file: ${error.message}`);
    throw error;
  }
};

export const getFileUrl = (path: string): string => {
  const { data } = supabase.storage
    .from('documents')
    .getPublicUrl(path);
  
  return data.publicUrl;
};