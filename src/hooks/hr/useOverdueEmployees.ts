import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface OverdueEmployee {
    employee_id: string;
    employee: {
        id: string;
        first_name: string;
        last_name: string;
        email?: string;
    };
    policy_id: string;
    status: string;
    acknowledged_at?: string;
    last_reminded_at?: string;
    daysOverdue: number;
}

export function useOverdueEmployees(policyId?: string) {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-overdue-employees', user?.org_id, policyId],
        queryFn: async (): Promise<OverdueEmployee[]> => {
            if (!user?.org_id) return [];

            let query = (supabase as any)
                .from('hr_policy_acknowledgments')
                .select(`
                    employee_id,
                    policy_id,
                    status,
                    acknowledged_at,
                    last_reminded_at,
                    hr_employees!inner (
                        id,
                        first_name,
                        last_name,
                        email
                    )
                `)
                .eq('org_id', user.org_id)
                .eq('status', 'overdue');

            if (policyId) {
                query = query.eq('policy_id', policyId);
            }

            const { data, error } = await query;
            if (error && error.code !== 'PGRST116') throw error;

            const today = new Date();
            const overdue = (data || []).map((ack: any) => {
                // Calculate days overdue (simplified: assume overdue if status is overdue)
                const lastRemind = ack.last_reminded_at ? new Date(ack.last_reminded_at) : null;
                const daysOverdue = lastRemind ? Math.floor((today.getTime() - lastRemind.getTime()) / (1000 * 60 * 60 * 24)) : 0;

                return {
                    employee_id: ack.employee_id,
                    employee: ack.hr_employees || { id: '', first_name: 'Unknown', last_name: 'Employee' },
                    policy_id: ack.policy_id,
                    status: ack.status,
                    acknowledged_at: ack.acknowledged_at,
                    last_reminded_at: ack.last_reminded_at,
                    daysOverdue: Math.max(daysOverdue, 1), // At least 1 day
                };
            });

            return overdue as OverdueEmployee[];
        },
        staleTime: 5 * 60 * 1000,
    });
}

