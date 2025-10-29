import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface BoardMember {
    id: string;
    org_id: string;
    profile_id?: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    role: string;
    independence?: string;
    tenure_years?: number;
    attendance_percentage?: number;
    compliance_status: string;
    status: string;
    appointment_date?: string;
    term_end_date?: string;
    created_at: string;
    updated_at: string;
}

export function useBoardMembers() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-board-members', user?.org_id],
        queryFn: async (): Promise<BoardMember[]> => {
            if (!user?.org_id) return [];

            const { data, error } = await supabase
                .from('hr_board_members')
                .select('*')
                .eq('org_id', user.org_id)
                .order('created_at', { ascending: false });

            if (error && error.code !== 'PGRST116') throw error;
            return (data || []) as BoardMember[];
        },
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreateBoardMember() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (member: Omit<BoardMember, 'id' | 'org_id' | 'created_at' | 'updated_at'>) => {
            if (!user?.org_id) throw new Error('No organization');

            const { data, error } = await supabase
                .from('hr_board_members')
                .insert({
                    ...member,
                    org_id: user.org_id,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-board-members'] });
            toast({
                title: 'Board member added',
                description: 'Board member has been added successfully.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to add board member',
                variant: 'destructive',
            });
        },
    });
}

export function useUpdateBoardMember() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<BoardMember> }) => {
            const { data, error } = await supabase
                .from('hr_board_members')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-board-members'] });
            toast({
                title: 'Board member updated',
                description: 'Board member information has been updated.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update board member',
                variant: 'destructive',
            });
        },
    });
}

export function useDeleteBoardMember() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('hr_board_members')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-board-members'] });
            toast({
                title: 'Board member removed',
                description: 'Board member has been removed successfully.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to remove board member',
                variant: 'destructive',
            });
        },
    });
}

