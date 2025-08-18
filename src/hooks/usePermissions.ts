import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PermissionMap {
  [moduleKey: string]: {
    _module?: boolean;
    [featureId: string]: string[] | boolean;
  };
}

export const usePermissions = (profileId?: string) => {
  return useQuery({
    queryKey: ['user-permissions', profileId],
    queryFn: async () => {
      if (!profileId) return {};
      
      const { data, error } = await supabase.rpc('get_effective_permissions', {
        _profile_id: profileId,
      });
      
      if (error) {
        throw new Error(`Failed to fetch user permissions: ${error.message}`);
      }
      
      return (data || {}) as PermissionMap;
    },
    enabled: !!profileId,
  });
};

export const useCurrentUserPermissions = () => {
  return useQuery({
    queryKey: ['current-user-permissions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return {};
      
      const { data, error } = await supabase.rpc('get_effective_permissions', {
        _profile_id: user.id,
      });
      
      if (error) {
        throw new Error(`Failed to fetch current user permissions: ${error.message}`);
      }
      
      return (data || {}) as PermissionMap;
    },
  });
};

export const useSetUserAccess = () => {
  return async (profileId: string, accessMap: Record<string, any>) => {
    const { data, error } = await supabase.rpc('set_user_access_map', {
      _profile_id: profileId,
      _access_map: accessMap,
    });
    
    if (error) {
      throw new Error(`Failed to set user access: ${error.message}`);
    }
    
    return data;
  };
};