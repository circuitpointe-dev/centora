import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SalaryBenchmark {
    id: string;
    org_id: string;
    role_level: string;
    location?: string;
    market_p25?: string;
    market_p50?: string;
    market_p75?: string;
    internal_band?: string;
    created_at: string;
    updated_at: string;
}

export function useSalaryBenchmarks(search?: string) {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-salary-benchmarks', user?.org_id, search],
        queryFn: async (): Promise<SalaryBenchmark[]> => {
            if (!user?.org_id) return [];

            let query = (supabase as any)
                .from('hr_salary_benchmarks')
                .select('*')
                .eq('org_id', user.org_id)
                .order('created_at', { ascending: false });

            if (search) {
                query = query.or(
                    `role_level.ilike.%${search}%,location.ilike.%${search}%`
                );
            }

            const { data, error } = await query;
            if (error && error.code !== 'PGRST116') throw error;
            return (data || []) as SalaryBenchmark[];
        },
        staleTime: 5 * 60 * 1000,
    });
}
