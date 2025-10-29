import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface TrainingRecord {
    id: string;
    org_id: string;
    employee_id: string;
    training_name: string;
    training_type?: string;
    provider?: string;
    start_date?: string;
    end_date?: string;
    completion_status: string;
    completion_percentage: number;
    certificate_url?: string;
    created_at: string;
    updated_at: string;
}

export function useTrainingRecords(employeeId?: string) {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-training-records', user?.org_id, employeeId],
        queryFn: async (): Promise<TrainingRecord[]> => {
            if (!user?.org_id) return [];

            let query = supabase
                .from('hr_training_records')
                .select('*')
                .eq('org_id', user.org_id)
                .order('start_date', { ascending: false });

            if (employeeId) {
                query = query.eq('employee_id', employeeId);
            }

            const { data, error } = await query;
            if (error && error.code !== 'PGRST116') throw error;
            return (data || []) as TrainingRecord[];
        },
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreateTrainingRecord() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (training: Omit<TrainingRecord, 'id' | 'org_id' | 'created_at' | 'updated_at'>) => {
            if (!user?.org_id) throw new Error('No organization');

            const { data, error } = await supabase
                .from('hr_training_records')
                .insert({
                    ...training,
                    org_id: user.org_id,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-training-records'] });
            queryClient.invalidateQueries({ queryKey: ['hr-training-completion'] });
            toast({
                title: 'Training record created',
                description: 'The training record has been created successfully.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to create training record',
                variant: 'destructive',
            });
        },
    });
}

export function useUpdateTrainingProgress() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ id, completion_percentage, completion_status }: { id: string; completion_percentage?: number; completion_status?: string }) => {
            const updates: any = { updated_at: new Date().toISOString() };
            if (completion_percentage !== undefined) updates.completion_percentage = completion_percentage;
            if (completion_status) updates.completion_status = completion_status;

            const { error } = await supabase
                .from('hr_training_records')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-training-records'] });
            queryClient.invalidateQueries({ queryKey: ['hr-training-completion'] });
            toast({
                title: 'Training progress updated',
                description: 'Training progress has been updated.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update training progress',
                variant: 'destructive',
            });
        },
    });
}

