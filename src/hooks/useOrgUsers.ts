import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface OrgUser {
  id: string;
  full_name: string;
  email: string;
  status: 'active' | 'inactive' | 'deactivated';
  department: string;
  modules: string[];
  roles: string[];
}

interface UseOrgUsersParams {
  search?: string;
  department?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export const useOrgUsers = ({ 
  search, 
  department, 
  status, 
  page = 1, 
  pageSize = 8 
}: UseOrgUsersParams = {}) => {
  return useQuery({
    queryKey: ['org-users', search, department, status, page, pageSize],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('list_org_users', {
        _search: search || null,
        _status: status || null,
        _department: department || null,
        _page: page,
        _page_size: pageSize,
      });
      
      if (error) {
        throw new Error(`Failed to fetch organization users: ${error.message}`);
      }

      return data as OrgUser[];
    },
  });
};

export const useOrgUsersCount = (search?: string, department?: string, status?: string) => {
  return useQuery({
    queryKey: ['org-users-count', search, department, status],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('count_org_users', {
        _search: search || null,
        _status: status || null,
        _department: department || null,
      });
      
      if (error) {
        throw new Error(`Failed to count organization users: ${error.message}`);
      }

      return data as number;
    },
  });
};