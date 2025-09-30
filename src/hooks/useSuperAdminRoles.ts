import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SystemRole {
  id: string;
  name: string;
  description: string;
}

// Hook to get available system roles
export const useSuperAdminRoles = () => {
  return useQuery({
    queryKey: ['super-admin-roles'],
    queryFn: async (): Promise<SystemRole[]> => {
      const { data, error } = await supabase
        .from('system_roles')
        .select('id, name, description')
        .eq('is_system', true)
        .order('name', { ascending: true });

      if (error) throw error;

      return (data || []).map((role: any) => ({
        id: role.id,
        name: role.name,
        description: role.description || '',
      }));
    },
  });
};

// Hook to get departments
export const useSuperAdminDepartments = () => {
  return useQuery({
    queryKey: ['super-admin-departments'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_departments');
      if (error) throw error;

      return data || [];
    },
  });
};