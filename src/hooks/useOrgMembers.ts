import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface OrgMember {
  id: string;
  full_name: string;
  email: string;
  status: string;
  department?: string;
}

export const useOrgMembers = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['org-members', user?.org_id],
    queryFn: async (): Promise<OrgMember[]> => {
      if (!user?.org_id) throw new Error('No organization');
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          status,
          departments!profiles_department_id_fkey(name)
        `)
        .eq('org_id', user.org_id)
        .eq('status', 'active')
        .order('full_name', { ascending: true });

      if (error) throw error;

      return (data || []).map((member: any) => ({
        id: member.id,
        full_name: member.full_name || member.email,
        email: member.email,
        status: member.status,
        department: member.departments?.name,
      }));
    },
    enabled: !!user?.org_id,
  });
};