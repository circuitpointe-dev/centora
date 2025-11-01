import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface SalarySimulationPayload {
    employee_id?: string;
    role_level?: string;
    location?: string;
    current_salary: number;
    proposed_salary: number;
    market_p50?: string | null;
    internal_band?: string | null;
    compa_ratio?: number;
}

export function useRecordSalarySimulation() {
    const { user } = useAuth();
    const { toast } = useToast();
    return useMutation({
        mutationFn: async (payload: SalarySimulationPayload) => {
            if (!user?.org_id) throw new Error('No organization');
            const { error } = await (supabase as any)
                .from('hr_salary_simulations')
                .insert({
                    org_id: user.org_id,
                    employee_id: payload.employee_id || null,
                    role_level: payload.role_level || null,
                    location: payload.location || null,
                    current_salary: payload.current_salary,
                    proposed_salary: payload.proposed_salary,
                    market_p50: payload.market_p50 || null,
                    internal_band: payload.internal_band || null,
                    compa_ratio: payload.compa_ratio ?? null,
                });
            if (error) throw error;
        },
        onSuccess: () => {
            toast({ title: 'Simulation saved', description: 'The proposed compensation has been recorded.' });
        },
        onError: (e: any) => {
            toast({ title: 'Failed to save', description: e?.message || 'Please try again later', variant: 'destructive' });
        }
    });
}
