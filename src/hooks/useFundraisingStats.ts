import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface FundraisingStats {
  totalProposals: number;
  conversionRate: number;
  activeOpportunities: number;
  fundsRaised: number;
  avgGrantSize: number;
  proposalsInProgress: number;
  pendingReviews: number;
  upcomingDeadlines: number;
  archivedProposals: number;
}

export const useFundraisingStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['fundraising-stats', user?.org_id],
    queryFn: async (): Promise<FundraisingStats> => {
      if (!user?.org_id) throw new Error('No organization');
      
      // Get opportunities count (using as proxy for proposals for now)
      const { count: opportunitiesCount } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true });

      // Get opportunities in progress
      const { count: inProgressCount } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'In Progress');

      // Get opportunities under review
      const { count: pendingReviewsCount } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Submitted');

      // Get active opportunities
      const { count: activeOpportunitiesCount } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .in('status', ['To Review', 'In Progress']);

      // Get grants for funds calculation
      const { data: grants } = await supabase
        .from('grants')
        .select('amount')
        .eq('org_id', user.org_id)
        .eq('status', 'active');

      // Calculate total funds raised and avg grant size
      const totalFunds = grants?.reduce((sum, grant) => sum + (grant.amount || 0), 0) || 0;
      const avgGrantSize = grants && grants.length > 0 ? totalFunds / grants.length : 0;

      // Calculate conversion rate (awarded opportunities / total opportunities)
      const { count: awardedCount } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Awarded');

      const conversionRate = opportunitiesCount && opportunitiesCount > 0 
        ? ((awardedCount || 0) / opportunitiesCount) * 100 
        : 0;

      // Get upcoming deadlines (within next 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const { count: upcomingDeadlinesCount } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .lte('deadline', thirtyDaysFromNow.toISOString().split('T')[0])
        .gte('deadline', new Date().toISOString().split('T')[0]);

      return {
        totalProposals: opportunitiesCount || 0,
        conversionRate,
        activeOpportunities: activeOpportunitiesCount || 0,
        fundsRaised: totalFunds,
        avgGrantSize,
        proposalsInProgress: inProgressCount || 0,
        pendingReviews: pendingReviewsCount || 0,
        upcomingDeadlines: upcomingDeadlinesCount || 0,
        archivedProposals: 0, // Will implement when proposals table is ready
      };
    },
    enabled: !!user?.org_id,
  });
};