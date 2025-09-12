import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface FileUploadOptions {
  bucket?: string;
  folder?: string;
  allowedTypes?: string[];
  maxSize?: number; // in bytes
}

export const useFileUpload = (options: FileUploadOptions = {}) => {
  const { user } = useAuth();
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const {
    bucket = 'documents',
    folder = '',
    allowedTypes = ['application/pdf', 'image/*', 'text/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxSize = 10 * 1024 * 1024, // 10MB default
  } = options;

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('User not authenticated');

      // Validate file type
      const isValidType = allowedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', '/'));
        }
        return file.type === type;
      });

      if (!isValidType) {
        throw new Error(`File type ${file.type} is not allowed`);
      }

      // Validate file size
      if (file.size > maxSize) {
        throw new Error(`File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`);
      }

      // Get user's org_id for folder structure
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();

      if (!profile?.org_id) throw new Error('User org not found');

      // Generate unique filename
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${timestamp}_${safeFileName}`;
      
      // Create file path: org_id/user_id/folder/filename
      const filePath = folder 
        ? `${profile.org_id}/${user.id}/${folder}/${fileName}`
        : `${profile.org_id}/${user.id}/${fileName}`;

      setUploadProgress(0);

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      setUploadProgress(100);

      return {
        path: data.path,
        fullPath: data.fullPath,
        fileName: file.name,
        size: file.size,
        type: file.type,
        url: supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl,
      };
    },
    onError: (error) => {
      setUploadProgress(0);
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const deleteFile = useMutation({
    mutationFn: async (filePath: string) => {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;
    },
    onError: (error) => {
      toast.error(`Delete failed: ${error.message}`);
    },
  });

  const getPublicUrl = (filePath: string) => {
    return supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl;
  };

  const getSignedUrl = async (filePath: string, expiresIn: number = 3600) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn);

    if (error) throw error;
    return data.signedUrl;
  };

  return {
    uploadFile: uploadMutation.mutateAsync,
    deleteFile: deleteFile.mutateAsync,
    getPublicUrl,
    getSignedUrl,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteFile.isPending,
    uploadProgress,
    uploadError: uploadMutation.error,
  };
};

export const useMultipleFileUpload = (options: FileUploadOptions = {}) => {
  const singleUpload = useFileUpload(options);
  const [overallProgress, setOverallProgress] = useState<number>(0);

  const uploadMultiple = async (files: File[]) => {
    const results = [];
    const total = files.length;

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await singleUpload.uploadFile(files[i]);
        results.push({ success: true, file: files[i], result });
        setOverallProgress(((i + 1) / total) * 100);
      } catch (error) {
        results.push({ success: false, file: files[i], error });
      }
    }

    setOverallProgress(0);
    return results;
  };

  return {
    uploadMultiple,
    overallProgress,
    isUploading: singleUpload.isUploading,
  };
};