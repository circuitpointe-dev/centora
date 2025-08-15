import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDonorTotalGiving = (donorId: string) => {
  return useQuery({
    queryKey: ['donorTotalGiving', donorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donor_giving_records')
        .select('amount, currency')
        .eq('donor_id', donorId);
      
      if (error) throw error;

      const total = data?.reduce((sum, record) => sum + Number(record.amount), 0) || 0;
      const currency = data?.[0]?.currency || 'USD';
      
      return { total, currency };
    },
    enabled: !!donorId
  });
};