import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { HREmployee } from './useEmployees';

export function useCreateEmployee() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (employee: Omit<HREmployee, 'id' | 'created_at' | 'updated_at'>) => {
            if (!user?.org_id) throw new Error('No organization');

            const { data, error } = await supabase
                .from('hr_employees')
                .insert({
                    ...employee,
                    org_id: user.org_id,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-employees'] });
            queryClient.invalidateQueries({ queryKey: ['hr-stats'] });
            toast({
                title: 'Employee created',
                description: 'Employee has been added successfully.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to create employee',
                variant: 'destructive',
            });
        },
    });
}

export function useUpdateEmployee() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<HREmployee> }) => {
            const { data, error } = await supabase
                .from('hr_employees')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-employees'] });
            queryClient.invalidateQueries({ queryKey: ['hr-stats'] });
            toast({
                title: 'Employee updated',
                description: 'Employee information has been updated.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update employee',
                variant: 'destructive',
            });
        },
    });
}

export function useDeleteEmployee() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('hr_employees')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-employees'] });
            queryClient.invalidateQueries({ queryKey: ['hr-stats'] });
            toast({
                title: 'Employee deleted',
                description: 'Employee has been removed successfully.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete employee',
                variant: 'destructive',
            });
        },
    });
}

