import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MonthlyGivingData {
  month: number;
  year: number;
  monthName: string;
  amount: number;
  count: number;
}

export interface FundingPeriod {
  id: string;
  name: string | null;
  start_date: string;
  end_date: string;
  donor_id: string;
}

export const useFundingCyclesData = (selectedYear?: number) => {
  return useQuery({
    queryKey: ['funding-cycles-data', selectedYear],
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

      // Fetch funding periods for year filter
      const { data: fundingPeriods, error: periodsError } = await supabase
        .from('donor_funding_periods')
        .select(`
          id,
          name,
          start_date,
          end_date,
          donor_id,
          donors!inner(org_id)
        `)
        .eq('donors.org_id', profile.org_id);

      if (periodsError) throw periodsError;

      // Get available years from funding periods
      const availableYears = [...new Set(
        fundingPeriods?.map(period => new Date(period.start_date).getFullYear()) || []
      )].sort((a, b) => b - a);

      // Fetch giving records with optional year filtering
      let givingQuery = supabase
        .from('donor_giving_records')
        .select(`
          month,
          year,
          amount,
          currency,
          donors!inner(org_id)
        `)
        .eq('donors.org_id', profile.org_id);

      if (selectedYear) {
        givingQuery = givingQuery.eq('year', selectedYear);
      }

      const { data: givingRecords, error: givingError } = await givingQuery;
      
      if (givingError) throw givingError;

      // Aggregate giving records by month
      const monthlyData: { [key: string]: MonthlyGivingData } = {};
      
      givingRecords?.forEach((record) => {
        const monthKey = `${record.year}-${record.month}`;
        
        if (!monthlyData[monthKey]) {
          const date = new Date(record.year, record.month - 1);
          monthlyData[monthKey] = {
            month: record.month,
            year: record.year,
            monthName: date.toLocaleDateString('en-US', { month: 'short' }),
            amount: 0,
            count: 0
          };
        }
        
        monthlyData[monthKey].amount += Number(record.amount);
        monthlyData[monthKey].count += 1;
      });

      const sortedMonthlyData = Object.values(monthlyData).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      });

      return {
        monthlyData: sortedMonthlyData,
        availableYears,
        fundingPeriods: fundingPeriods || []
      };
    },
    enabled: true
  });
};