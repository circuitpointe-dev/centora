import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOrgMembers = () => {
  return useQuery({
    queryKey: ['org-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, department:departments(name)')
        .eq('status', 'active')
        .order('full_name', { ascending: true });

      if (error) {
        throw error;
      }

      return data;
    },
  });
};
