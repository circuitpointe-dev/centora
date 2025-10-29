import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface PerformanceGoal {
    id: string;
    org_id: string;
    employee_id?: string;
    title: string;
    type?: string;
    description?: string;
    company_okr?: string;
    owner_name?: string;
    weight?: string;
    target_value?: string;
    current_value?: string;
    progress: number;
    status: string;
    next_check_in?: string;
    cycle?: string;
    created_at: string;
    updated_at: string;
}

export function useGoals(employeeId?: string) {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-performance-goals', user?.org_id, employeeId],
        queryFn: async (): Promise<PerformanceGoal[]> => {
            if (!user?.org_id) return [];

            let query = supabase
                .from('hr_performance_goals')
                .select('*')
                .eq('org_id', user.org_id)
                .order('created_at', { ascending: false });

            if (employeeId) {
                query = query.eq('employee_id', employeeId);
            }

            const { data, error } = await query;
            if (error && error.code !== 'PGRST116') throw error;
            return (data || []) as PerformanceGoal[];
        },
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreateGoal() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (goal: Omit<PerformanceGoal, 'id' | 'org_id' | 'created_at' | 'updated_at'>) => {
            if (!user?.org_id) throw new Error('No organization');

            const { data, error } = await supabase
                .from('hr_performance_goals')
                .insert({
                    ...goal,
                    org_id: user.org_id,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-performance-goals'] });
            toast({
                title: 'Goal created',
                description: 'Performance goal has been created successfully.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to create goal',
                variant: 'destructive',
            });
        },
    });
}

export function useUpdateGoal() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<PerformanceGoal> }) => {
            const { data, error } = await supabase
                .from('hr_performance_goals')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-performance-goals'] });
            toast({
                title: 'Goal updated',
                description: 'Performance goal has been updated.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update goal',
                variant: 'destructive',
            });
        },
    });
}

export function useDeleteGoal() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('hr_performance_goals')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-performance-goals'] });
            toast({
                title: 'Goal deleted',
                description: 'Performance goal has been deleted.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete goal',
                variant: 'destructive',
            });
        },
    });
}

