import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MONTH_NAMES } from '@/utils/monthConversion';

export interface MonthlyGivingData {
  month: string;
  monthIndex: number;
  amount: number;
  donationCount: number;
  currencies: string[];
}

export interface AggregatedGivingData {
  monthlyData: MonthlyGivingData[];
  totalAmount: number;
  availableYears: number[];
}

export const useAggregatedGivingData = (year?: number) => {
  return useQuery({
    queryKey: ['aggregated-giving-data', year],
    queryFn: async (): Promise<AggregatedGivingData> => {
      // Get user's org_id from profile
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();

      if (!profile) throw new Error('User profile not found');

      // Build base query for giving records
      let query = supabase
        .from('donor_giving_records')
        .select(`
          amount,
          currency,
          month,
          year,
          donors!inner(id, org_id)
        `)
        .eq('donors.org_id', profile.org_id);

      // Filter by year if specified
      if (year) {
        query = query.eq('year', year);
      }

      const { data: givingRecords, error } = await query.order('year', { ascending: false });

      if (error) {
        console.error('Error fetching giving records:', error);
        throw error;
      }

      // Get all available years for filtering
      const availableYears = [...new Set(givingRecords?.map(record => record.year) || [])]
        .sort((a, b) => b - a);

      // Filter records by selected year (if specified)
      const filteredRecords = year 
        ? givingRecords?.filter(record => record.year === year) || []
        : givingRecords || [];

      // Aggregate data by month
      const monthlyAggregation = new Map<number, {
        amount: number;
        count: number;
        currencies: Set<string>;
      }>();

      // Initialize all months with zero values
      for (let i = 1; i <= 12; i++) {
        monthlyAggregation.set(i, {
          amount: 0,
          count: 0,
          currencies: new Set()
        });
      }

      // Aggregate the actual data
      filteredRecords.forEach(record => {
        const existing = monthlyAggregation.get(record.month)!;
        existing.amount += Number(record.amount);
        existing.count += 1;
        existing.currencies.add(record.currency);
      });

      // Convert to array format for chart
      const monthlyData: MonthlyGivingData[] = Array.from(monthlyAggregation.entries())
        .map(([monthIndex, data]) => ({
          month: MONTH_NAMES[monthIndex - 1],
          monthIndex,
          amount: data.amount,
          donationCount: data.count,
          currencies: Array.from(data.currencies)
        }));

      // Calculate total amount for the period
      const totalAmount = monthlyData.reduce((sum, month) => sum + month.amount, 0);

      return {
        monthlyData,
        totalAmount,
        availableYears
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};