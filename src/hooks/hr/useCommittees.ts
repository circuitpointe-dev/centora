import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Committee {
    id: string;
    org_id: string;
    name: string;
    description?: string;
    chairperson_id?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface CommitteeMember {
    id: string;
    committee_id: string;
    member_id: string;
    role: string;
    joined_date?: string;
}

export function useCommittees() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-committees', user?.org_id],
        queryFn: async (): Promise<Committee[]> => {
            if (!user?.org_id) return [];

            const { data, error } = await supabase
                .from('hr_committees')
                .select('*')
                .eq('org_id', user.org_id)
                .order('created_at', { ascending: false });

            if (error && error.code !== 'PGRST116') throw error;
            return (data || []) as Committee[];
        },
        staleTime: 5 * 60 * 1000,
    });
}

export function useCommitteeMembers(committeeId?: string) {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-committee-members', committeeId],
        queryFn: async (): Promise<CommitteeMember[]> => {
            if (!committeeId) return [];

            const { data, error } = await supabase
                .from('hr_committee_members')
                .select('*')
                .eq('committee_id', committeeId);

            if (error && error.code !== 'PGRST116') throw error;
            return (data || []) as CommitteeMember[];
        },
        enabled: !!committeeId,
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreateCommittee() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (committee: Omit<Committee, 'id' | 'org_id' | 'created_at' | 'updated_at'>) => {
            if (!user?.org_id) throw new Error('No organization');

            const { data, error } = await supabase
                .from('hr_committees')
                .insert({
                    ...committee,
                    org_id: user.org_id,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-committees'] });
            toast({
                title: 'Committee created',
                description: 'Committee has been created successfully.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to create committee',
                variant: 'destructive',
            });
        },
    });
}

export function useAddCommitteeMember() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (member: Omit<CommitteeMember, 'id' | 'joined_date'>) => {
            const { data, error } = await supabase
                .from('hr_committee_members')
                .insert(member)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['hr-committee-members', variables.committee_id] });
            toast({
                title: 'Member added',
                description: 'Committee member has been added.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to add member',
                variant: 'destructive',
            });
        },
    });
}

