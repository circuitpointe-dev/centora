import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ESignatureField {
  id: string;
  document_id: string;
  field_type: 'signature' | 'name' | 'date' | 'email' | 'text';
  field_label: string;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  page_number: number;
  is_required: boolean;
  field_value?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Fetch fields for a document
export const useESignatureFields = (documentId: string) => {
  return useQuery({
    queryKey: ['esignature-fields', documentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('esignature_fields')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as ESignatureField[];
    },
    enabled: !!documentId,
  });
};

// Create a new field
export const useCreateESignatureField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (field: Omit<ESignatureField, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('esignature_fields')
        .insert({
          ...field,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data as ESignatureField;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['esignature-fields', data.document_id] });
      toast.success('Field added successfully');
    },
    onError: (error) => {
      console.error('Failed to create field:', error);
      toast.error('Failed to add field');
    },
  });
};

// Update a field
export const useUpdateESignatureField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ESignatureField> }) => {
      const { data, error } = await supabase
        .from('esignature_fields')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as ESignatureField;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['esignature-fields', data.document_id] });
      toast.success('Field updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update field:', error);
      toast.error('Failed to update field');
    },
  });
};

// Delete a field
export const useDeleteESignatureField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('esignature_fields')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['esignature-fields'] });
      toast.success('Field deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete field:', error);
      toast.error('Failed to delete field');
    },
  });
};

// Save field positions and data
export const useSaveESignatureFields = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentId, fields }: { 
      documentId: string; 
      fields: Array<{
        id?: string;
        field_type: 'signature' | 'name' | 'date' | 'email' | 'text';
        field_label: string;
        position_x: number;
        position_y: number;
        width?: number;
        height?: number;
        page_number?: number;
        is_required?: boolean;
        field_value?: string;
      }> 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fieldsToUpsert = fields.map(field => ({
        id: field.id,
        document_id: documentId,
        field_type: field.field_type,
        field_label: field.field_label,
        position_x: field.position_x,
        position_y: field.position_y,
        width: field.width || 140,
        height: field.height || 32,
        page_number: field.page_number || 1,
        is_required: field.is_required ?? true,
        field_value: field.field_value,
        created_by: user.id
      }));

      const { data, error } = await supabase
        .from('esignature_fields')
        .upsert(fieldsToUpsert)
        .select();

      if (error) throw error;
      return data as ESignatureField[];
    },
    onSuccess: (data) => {
      if (data.length > 0) {
        queryClient.invalidateQueries({ queryKey: ['esignature-fields', data[0].document_id] });
      }
      toast.success('Fields saved successfully');
    },
    onError: (error) => {
      console.error('Failed to save fields:', error);
      toast.error('Failed to save fields');
    },
  });
};