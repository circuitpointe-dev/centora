import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FundingCycleData {
  id: string;
  name: string;
  year: number;
  startMonth: number;
  endMonth: number;
  status: string;
  color: string;
}

export const useFundingCyclesData = (selectedYear?: number) => {
  return useQuery({
    queryKey: ['funding-cycles-data', selectedYear],
    queryFn: async () => {
      // Get user's org_id first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();
      
      if (!profile?.org_id) throw new Error('No organization found');

      // Fetch funding cycles from donor_funding_cycles table
      let query = supabase
        .from('donor_funding_cycles')
        .select(`
          *,
          donors!inner(org_id)
        `)
        .eq('donors.org_id', profile.org_id);

      if (selectedYear) {
        query = query.eq('year', selectedYear);
      }

      const { data: fundingCycles, error } = await query.order('year', { ascending: false });
      
      if (error) throw error;

      // Get available years for the filter
      const availableYears = [...new Set(
        fundingCycles?.map(cycle => cycle.year) || []
      )].sort((a, b) => b - a);

      // Transform data to match component expectations
      const cycleData: FundingCycleData[] = fundingCycles?.map(cycle => ({
        id: cycle.id,
        name: cycle.name,
        year: cycle.year,
        startMonth: cycle.start_month,
        endMonth: cycle.end_month,
        status: cycle.status,
        color: cycle.color,
      })) || [];

      return {
        fundingCycles: cycleData,
        availableYears,
      };
    },
    enabled: true
  });
};