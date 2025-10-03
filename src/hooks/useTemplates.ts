import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Template {
  id: string;
  title: string;
  description?: string;
  category: string;
  template_category?: string;
  department?: string;
  file_name: string;
  file_path: string;
  preview_url?: string;
  office_preview_url?: string;
  mime_type?: string;
  file_size?: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  creator?: {
    full_name?: string;
  };
}

export const useTemplates = (filters?: {
  category?: string;
  search?: string;
}) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['templates', filters],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('documents')
        .select(`
          *,
          profiles!created_by(full_name)
        `)
        .eq('is_template', true)
        .order('updated_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      let filteredData = data || [];

      // Apply filters
      if (filters?.category && filters.category !== 'all') {
        filteredData = filteredData.filter(template =>
          template.template_category === filters.category ||
          template.category === filters.category
        );
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(template =>
          template.title.toLowerCase().includes(searchLower) ||
          template.description?.toLowerCase().includes(searchLower) ||
          template.template_category?.toLowerCase().includes(searchLower)
        );
      }

      // Create signed preview URLs for storage paths (if bucket is private)
      const signedUrls = await Promise.all(
        (filteredData || []).map(async (t: any) => {
          if (!t.file_path) return undefined;
          try {
            const { data: signed } = await supabase.storage
              .from('documents')
              .createSignedUrl(t.file_path, 60 * 10);
            return signed?.signedUrl;
          } catch {
            return undefined;
          }
        })
      );

      return filteredData.map((template: any, idx: number) => {
        const signed = signedUrls[idx];
        const lower = (template.file_name || '').toLowerCase();
        const isOffice = lower.endsWith('.doc') || lower.endsWith('.docx') || lower.endsWith('.ppt') || lower.endsWith('.pptx');
        const officeUrl = signed && isOffice
          ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(signed)}`
          : undefined;
        return ({
          id: template.id,
          title: template.title,
          description: template.description,
          category: template.template_category || template.category,
          template_category: template.template_category,
          file_name: template.file_name,
          file_path: template.file_path,
          preview_url: signed,
          office_preview_url: officeUrl,
          mime_type: template.mime_type,
          file_size: template.file_size,
          created_at: template.created_at,
          updated_at: template.updated_at,
          created_by: template.created_by,
          creator: template.profiles,
        }) as Template;
      }) as Template[];
    },
    enabled: !!user,
  });
};

export const useTemplate = (id?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['template', id],
    queryFn: async () => {
      if (!user || !id) throw new Error('User not authenticated or no ID provided');

      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          profiles!created_by(full_name)
        `)
        .eq('id', id)
        .eq('is_template', true)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.template_category || data.category,
        template_category: data.template_category,
        file_name: data.file_name,
        file_path: data.file_path,
        mime_type: data.mime_type,
        file_size: data.file_size,
        created_at: data.created_at,
        updated_at: data.updated_at,
        created_by: data.created_by,
        creator: data.profiles,
      } as Template;
    },
    enabled: !!user && !!id,
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      description?: string;
      category: string;
      file_name: string;
      file_path: string;
      mime_type?: string;
      file_size?: number;
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Get user's org_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();

      if (!profile) throw new Error('User profile not found');

      const { error } = await supabase
        .from('documents')
        .insert({
          title: params.title,
          description: params.description,
          category: 'templates',
          template_category: params.category,
          file_name: params.file_name,
          file_path: params.file_path,
          mime_type: params.mime_type,
          file_size: params.file_size,
          is_template: true,
          status: 'active',
          org_id: profile.org_id,
          created_by: user.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('Template created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create template: ${error.message}`);
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      title?: string;
      description?: string;
      category?: string;
    }) => {
      const { error } = await supabase
        .from('documents')
        .update({
          title: params.title,
          description: params.description,
          template_category: params.category,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      queryClient.invalidateQueries({ queryKey: ['template'] });
      toast.success('Template updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update template: ${error.message}`);
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('Template deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete template: ${error.message}`);
    },
  });
};

export const useCreateDocumentFromTemplate = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (params: {
      template_id: string;
      title: string;
      description?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Get the template
      const { data: template, error: templateError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', params.template_id)
        .eq('is_template', true)
        .single();

      if (templateError) throw templateError;

      // Get user's org_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();

      if (!profile) throw new Error('User profile not found');

      // Create new document from template
      const { data, error } = await supabase
        .from('documents')
        .insert({
          title: params.title,
          description: params.description,
          category: template.category,
          file_name: `${params.title}.${template.file_name.split('.').pop()}`,
          file_path: template.file_path, // In a real app, you'd copy the file
          mime_type: template.mime_type,
          file_size: template.file_size,
          is_template: false,
          status: 'draft',
          org_id: profile.org_id,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document created from template successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create document from template: ${error.message}`);
    },
  });
};

// Seed a few sample templates for the current org (respects RLS)
export const useSeedSampleTemplates = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();
      if (profileErr) throw profileErr;
      if (!profile?.org_id) throw new Error('Missing org_id');

      const samples = [
        {
          title: 'General Grant Proposal Template',
          description: 'A clean structure for typical grant submissions.',
          category: 'templates',
          template_category: 'proposal',
          file_name: 'general-grant-proposal.docx',
          file_path: '/templates/general-grant-proposal.docx',
          mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          file_size: 102400,
          is_template: true,
          status: 'active' as const,
        },
        {
          title: 'Project Report Template',
          description: 'Standard reporting structure with executive summary and results.',
          category: 'templates',
          template_category: 'report',
          file_name: 'project-report-template.pdf',
          file_path: '/templates/project-report-template.pdf',
          mime_type: 'application/pdf',
          file_size: 204800,
          is_template: true,
          status: 'active' as const,
        },
        {
          title: 'Donor Budget Presentation',
          description: 'PowerPoint deck for donor-facing budget presentations.',
          category: 'templates',
          template_category: 'financial',
          file_name: 'donor-budget-presentation.pptx',
          file_path: '/templates/donor-budget-presentation.pptx',
          mime_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          file_size: 307200,
          is_template: true,
          status: 'active' as const,
        },
      ];

      const payload = samples.map(s => ({
        ...s,
        org_id: profile.org_id,
        created_by: user.id,
      }));

      const { error } = await supabase.from('documents').insert(payload as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('Sample templates added');
    },
    onError: (err: any) => {
      toast.error(`Failed to add samples: ${err.message}`);
    },
  });
};