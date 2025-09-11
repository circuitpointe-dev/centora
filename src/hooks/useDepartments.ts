import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Department {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_departments');
      
      if (error) {
        console.error('Failed to fetch departments:', error);
        throw new Error(`Failed to fetch departments: ${error.message}`);
      }

      return (data || []) as Department[];
    },
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};