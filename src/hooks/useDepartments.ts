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
      console.log('useDepartments - Fetching departments...');
      const { data, error } = await supabase.rpc('get_departments');
      
      console.log('useDepartments - Response data:', data);
      console.log('useDepartments - Response error:', error);
      
      if (error) {
        console.error('Failed to fetch departments:', error);
        throw new Error(`Failed to fetch departments: ${error.message}`);
      }

      const departments = (data || []) as Department[];
      console.log('useDepartments - Processed departments:', departments);
      return departments;
    },
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};