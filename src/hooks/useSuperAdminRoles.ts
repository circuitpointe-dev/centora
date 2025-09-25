import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { SuperAdminRole } from '@/components/users/super-admin/types';

interface Role {
  id: string;
  name: SuperAdminRole;
  description: string;
}

// Hook to get available roles
export const useSuperAdminRoles = () => {
  return useQuery({
    queryKey: ['super-admin-roles'],
    queryFn: async (): Promise<Role[]> => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('id, name, description')
        .order('name', { ascending: true });

      if (error) throw error;

      return (data || []).map((role: any) => ({
        id: role.id,
        name: role.name as SuperAdminRole,
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