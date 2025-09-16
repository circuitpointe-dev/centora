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
      
      // First get all donor IDs for this organization
      const { data: orgDonors } = await supabase
        .from('donors')
        .select('id')
        .eq('org_id', user.org_id);
      
      const donorIds = orgDonors?.map(donor => donor.id) || [];
      
      // If no donors, return empty stats
      if (donorIds.length === 0) {
        return {
          totalProposals: 0,
          conversionRate: 0,
          activeOpportunities: 0,
          fundsRaised: 0,
          avgGrantSize: 0,
          proposalsInProgress: 0,
          pendingReviews: 0,
          upcomingDeadlines: 0,
          archivedProposals: 0,
        };
      }

      // Get opportunities count for this org's donors
      const { count: opportunitiesCount } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .in('donor_id', donorIds);

      // Get opportunities in progress
      const { count: inProgressCount } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .in('donor_id', donorIds)
        .eq('status', 'In Progress');

      // Get opportunities under review
      const { count: pendingReviewsCount } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .in('donor_id', donorIds)
        .eq('status', 'Submitted');

      // Get active opportunities
      const { count: activeOpportunitiesCount } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .in('donor_id', donorIds)
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
        .in('donor_id', donorIds)
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
        .in('donor_id', donorIds)
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