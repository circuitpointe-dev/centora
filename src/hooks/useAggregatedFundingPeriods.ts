import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AggregatedFundingData {
  month: number;
  year: number;
  monthName: string;
  amount: number;
  count: number;
}

export const useAggregatedFundingPeriods = (year?: number) => {
  return useQuery({
    queryKey: ['aggregatedFundingPeriods', year],
    queryFn: async () => {
      // Get user's org_id first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');
      
      // Get user's profile to access org_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();
      
      if (!profile?.org_id) throw new Error('No organization found');

      let query = supabase
        .from('donor_funding_periods')
        .select(`
          start_date,
          end_date,
          donor_id,
          donors!inner(
            total_donations,
            currency
          )
        `)
        .eq('donors.org_id', profile.org_id);

      if (year) {
        query = query
          .gte('start_date', `${year}-01-01`)
          .lte('start_date', `${year}-12-31`);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      // Group by month and aggregate amounts
      const monthlyData: { [key: string]: AggregatedFundingData } = {};
      
      data?.forEach((period) => {
        const startDate = new Date(period.start_date);
        const monthKey = `${startDate.getFullYear()}-${startDate.getMonth()}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: startDate.getMonth() + 1,
            year: startDate.getFullYear(),
            monthName: startDate.toLocaleDateString('en-US', { month: 'short' }),
            amount: 0,
            count: 0
          };
        }
        
        monthlyData[monthKey].amount += Number((period.donors as any)?.total_donations || 0);
        monthlyData[monthKey].count += 1;
      });

      return Object.values(monthlyData).sort((a, b) => a.month - b.month);
    },
    enabled: true
  });
};