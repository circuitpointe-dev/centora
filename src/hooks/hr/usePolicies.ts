import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface HRPolicy {
    id: string;
    org_id: string;
    title: string;
    category?: string;
    version?: string;
    updated_at_date?: string;
    document_url?: string;
}

export interface PolicyAck {
    id: string;
    org_id: string;
    policy_id: string;
    employee_id?: string;
    status: 'pending' | 'acknowledged' | 'overdue' | 'exempt';
    acknowledged_at?: string;
    last_reminded_at?: string;
}

export function usePolicies(search?: string) {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['hr-policies', user?.org_id, search],
        queryFn: async (): Promise<HRPolicy[]> => {
            if (!user?.org_id) return [];
            let query = (supabase as any)
                .from('hr_policies')
                .select('*')
                .eq('org_id', user.org_id)
                .order('updated_at_date', { ascending: false });
            if (search) query = query.or(`title.ilike.%${search}%,category.ilike.%${search}%`);
            const { data, error } = await query;
            if (error && error.code !== 'PGRST116') throw error;
            return (data || []) as HRPolicy[];
        },
        staleTime: 5 * 60 * 1000,
    });
}

export function usePolicyAcknowledgments(policyId?: string, employeeId?: string) {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['hr-policy-acks', user?.org_id, policyId, employeeId],
        queryFn: async (): Promise<PolicyAck[]> => {
            if (!user?.org_id) return [];
            let query = (supabase as any)
                .from('hr_policy_acknowledgments')
                .select('*')
                .eq('org_id', user.org_id);
            if (policyId) query = query.eq('policy_id', policyId);
            if (employeeId) query = query.eq('employee_id', employeeId);
            const { data, error } = await query;
            if (error && error.code !== 'PGRST116') throw error;
            return (data || []) as PolicyAck[];
        },
    });
}

export function useAcknowledgePolicy() {
    const { user } = useAuth();
    const { toast } = useToast();
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { policy_id: string; employee_id?: string }) => {
            if (!user?.org_id) throw new Error('No organization');
            const { data, error } = await (supabase as any)
                .from('hr_policy_acknowledgments')
                .upsert({
                    org_id: user.org_id,
                    policy_id: payload.policy_id,
                    employee_id: payload.employee_id || null,
                    status: 'acknowledged',
                    acknowledged_at: new Date().toISOString(),
                }, { onConflict: 'policy_id,employee_id' })
                .select()
                .single();
            if (error) throw error;
            return data as PolicyAck;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['hr-policy-acks'] });
            toast({ title: 'Acknowledged', description: 'Policy acknowledged successfully.' });
        },
        onError: (e: any) => {
            toast({ title: 'Error', description: e?.message || 'Failed to acknowledge policy', variant: 'destructive' });
        }
    });
}

export function useSendPolicyReminder() {
    const { user } = useAuth();
    const { toast } = useToast();
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { id: string }) => {
            if (!user?.org_id) throw new Error('No organization');
            const { error } = await (supabase as any)
                .from('hr_policy_acknowledgments')
                .update({ last_reminded_at: new Date().toISOString() })
                .eq('id', payload.id);
            if (error) throw error;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['hr-policy-acks'] });
            toast({ title: 'Reminder sent', description: 'Reminder timestamp recorded.' });
        },
        onError: (e: any) => {
            toast({ title: 'Error', description: e?.message || 'Failed to record reminder', variant: 'destructive' });
        }
    });
}

export function useEmailPolicyAction() {
    const { toast } = useToast();
    return useMutation({
        mutationFn: async (payload: { policy_id: string; action: 'remind' | 'escalate'; subject?: string; message?: string }) => {
            const { error } = await (supabase as any).functions.invoke('policy-email', {
                body: payload,
            });
            if (error) throw error;
        },
        onSuccess: () => {
            toast({ title: 'Email queued', description: 'Emails will be sent to pending recipients if email is configured.' });
        },
        onError: (e: any) => {
            toast({ title: 'Email failed', description: e?.message || 'Unable to send emails right now.', variant: 'destructive' });
        }
    });
}
