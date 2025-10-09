import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

// Types based on database schema
export interface Document {
  id: string;
  title: string;
  file_name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  category: 'policies' | 'finance' | 'contracts' | 'm-e' | 'uncategorized' | 'templates' | 'compliance';
  status: 'draft' | 'active' | 'archived' | 'expired' | 'pending_approval';
  description?: string;
  version: string;
  is_template: boolean;
  template_category?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by?: string;
  org_id: string;
  // Joined data
  tags?: DocumentTag[];
  creator?: {
    full_name: string;
    email: string;
  };
}

export interface DocumentTag {
  id: string;
  name: string;
  color: string;
  bg_color: string;
  text_color: string;
}

export interface CreateDocumentData {
  title: string;
  file_name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  category?: Document['category'];
  description?: string;
  is_template?: boolean;
  template_category?: string;
  tag_ids?: string[];
}

export const useDocuments = (filters?: {
  category?: string;
  search?: string;
  is_template?: boolean;
}) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['documents', filters],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('documents')
        .select(`
          *,
          creator:profiles!documents_created_by_fkey(full_name, email),
          document_tag_associations(
            document_tags(id, name, color, bg_color, text_color)
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category as Document['category']);
      }

      if (filters?.is_template !== undefined) {
        query = query.eq('is_template', filters.is_template);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,file_name.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to match the expected format
      return data.map((doc: any) => ({
        ...doc,
        tags: doc.document_tag_associations?.map((assoc: any) => assoc.document_tags) || [],
        creator: doc.creator || null, // Fix: creator is already an object, not an array
        // Transform for backward compatibility with existing UI
        fileName: doc.file_name,
        addedTime: `Added ${formatTimeAgo(doc.created_at)}`,
        owner: {
          name: doc.creator?.full_name || 'Unknown',
          avatar: 'https://github.com/shadcn.png', // Default avatar
        }
      }));
    },
    enabled: !!user,
  });
};

export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateDocumentData) => {
      if (!user) throw new Error('User not authenticated');

      // Get user's org_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();

      if (!profile?.org_id) throw new Error('User org not found');

      const { data: document, error } = await supabase
        .from('documents')
        .insert({
          ...data,
          org_id: profile.org_id,
          created_by: user.id,
          status: 'active',
          version: '1.0', // Add required version field
        })
        .select()
        .single();

      if (error) throw error;

      // Add tag associations if provided
      if (data.tag_ids?.length) {
        const { error: tagError } = await supabase
          .from('document_tag_associations')
          .insert(
            data.tag_ids.map(tag_id => ({
              document_id: document.id,
              tag_id,
            }))
          );

        if (tagError) throw tagError;
      }

      return document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create document: ${error.message}`);
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete document: ${error.message}`);
    },
  });
};

export const useDocumentTags = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['document-tags'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('document_tags')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useCreateDocumentTag = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (tagData: Omit<DocumentTag, 'id'>) => {
      if (!user) throw new Error('User not authenticated');

      // Get user's org_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();

      if (!profile?.org_id) throw new Error('User org not found');

      const { data, error } = await supabase
        .from('document_tags')
        .insert({
          ...tagData,
          org_id: profile.org_id,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-tags'] });
      toast.success('Tag created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create tag: ${error.message}`);
    },
  });
};

export const useDeleteDocumentTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagId: string) => {
      const { error } = await supabase
        .from('document_tags')
        .delete()
        .eq('id', tagId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-tags'] });
      toast.success('Tag deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete tag: ${error.message}`);
    },
  });
};

// Helper function to format time ago
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2629744) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  return `${Math.floor(diffInSeconds / 2629744)} months ago`;
}