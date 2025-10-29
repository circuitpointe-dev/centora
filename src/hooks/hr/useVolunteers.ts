import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Volunteer {
    id: string;
    org_id: string;
    profile_id?: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    skills?: string[];
    availability?: string[];
    assignments_count: number;
    status: string;
    join_date?: string;
    created_at: string;
    updated_at: string;
}

export function useVolunteers() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-volunteers', user?.org_id],
        queryFn: async (): Promise<Volunteer[]> => {
            if (!user?.org_id) return [];

            const { data, error } = await supabase
                .from('hr_volunteers')
                .select('*')
                .eq('org_id', user.org_id)
                .order('created_at', { ascending: false });

            if (error && error.code !== 'PGRST116') throw error;
            return (data || []) as Volunteer[];
        },
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreateVolunteer() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (volunteer: Omit<Volunteer, 'id' | 'org_id' | 'assignments_count' | 'created_at' | 'updated_at'>) => {
            if (!user?.org_id) throw new Error('No organization');

            const { data, error } = await supabase
                .from('hr_volunteers')
                .insert({
                    ...volunteer,
                    org_id: user.org_id,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-volunteers'] });
            toast({
                title: 'Volunteer added',
                description: 'Volunteer has been added successfully.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to add volunteer',
                variant: 'destructive',
            });
        },
    });
}

export function useUpdateVolunteer() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Volunteer> }) => {
            const { data, error } = await supabase
                .from('hr_volunteers')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-volunteers'] });
            toast({
                title: 'Volunteer updated',
                description: 'Volunteer information has been updated.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update volunteer',
                variant: 'destructive',
            });
        },
    });
}

export function useDeleteVolunteer() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('hr_volunteers')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-volunteers'] });
            toast({
                title: 'Volunteer removed',
                description: 'Volunteer has been removed successfully.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to remove volunteer',
                variant: 'destructive',
            });
        },
    });
}

