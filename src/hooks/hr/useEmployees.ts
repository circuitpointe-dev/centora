import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface HREmployee {
    id: string;
    employee_id: string;
    first_name: string;
    last_name: string;
    email?: string;
    department?: string;
    position?: string;
    employment_type?: string;
    hire_date?: string;
    status?: string;
}

export function useEmployees(search?: string) {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-employees', user?.org_id, search],
        queryFn: async (): Promise<HREmployee[]> => {
            if (!user?.org_id) return [];

            // Temporary type assertion until Supabase types are fully regenerated
            let query = (supabase as any)
                .from('hr_employees')
                .select('*')
                .eq('org_id', user.org_id)
                .order('hire_date', { ascending: false });

            if (search) {
                query = query.or(
                    `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,department.ilike.%${search}%,position.ilike.%${search}%`
                );
            }

            const { data, error } = await query;
            if (error && error.code !== 'PGRST116') throw error;
            return (data || []) as HREmployee[];
        },
        staleTime: 5 * 60 * 1000,
    });
}

export function useEmployee(employeeId?: string) {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-employee', user?.org_id, employeeId],
        queryFn: async (): Promise<HREmployee | null> => {
            if (!user?.org_id || !employeeId) return null;

            const { data, error } = await (supabase as any)
                .from('hr_employees')
                .select('*')
                .eq('org_id', user.org_id)
                .eq('id', employeeId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return (data || null) as HREmployee | null;
        },
        enabled: !!employeeId && !!user?.org_id,
        staleTime: 5 * 60 * 1000,
    });
}


