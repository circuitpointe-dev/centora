import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UserStats {
  active_users: number;
  inactive_users: number;
  deactivated_users: number;
  pending_invitations: number;
}

export const useUserStats = () => {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_stats');
      
      if (error) {
        throw new Error(`Failed to fetch user stats: ${error.message}`);
      }

      return data as unknown as UserStats;
    },
  });
};