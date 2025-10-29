import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ExitRecord {
    id: string;
    org_id: string;
    employee_id?: string;
    exit_date: string;
    exit_reason?: string;
    exit_type?: string;
    department?: string;
    position?: string;
    notes?: string;
    created_at: string;
}

export function useExits() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-exits', user?.org_id],
        queryFn: async (): Promise<ExitRecord[]> => {
            if (!user?.org_id) return [];

            const { data, error } = await supabase
                .from('hr_attrition')
                .select('*')
                .eq('org_id', user.org_id)
                .order('exit_date', { ascending: false });

            if (error && error.code !== 'PGRST116') throw error;
            return (data || []) as ExitRecord[];
        },
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreateExit() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (exit: Omit<ExitRecord, 'id' | 'org_id' | 'created_at'>) => {
            if (!user?.org_id) throw new Error('No organization');

            const { data, error } = await (supabase as any)
                .from('hr_attrition')
                .insert({
                    ...exit,
                    org_id: user.org_id,
                })
                .select()
                .single();

            if (error) throw error;

            // Update employee status if employee_id is provided
            if (exit.employee_id) {
                await (supabase as any)
                    .from('hr_employees')
                    .update({
                        status: 'terminated',
                        termination_date: exit.exit_date
                    })
                    .eq('id', exit.employee_id);
            }

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-exits'] });
            queryClient.invalidateQueries({ queryKey: ['hr-employees'] });
            queryClient.invalidateQueries({ queryKey: ['hr-stats'] });
            queryClient.invalidateQueries({ queryKey: ['hr-attrition-data'] });
            toast({
                title: 'Exit recorded',
                description: 'Employee exit has been recorded successfully.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to record exit',
                variant: 'destructive',
            });
        },
    });
}

