import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface OnboardingChecklist {
    id: string;
    org_id: string;
    employee_id: string | null;
    role?: string | null;
    start_date?: string | null;
    manager?: string | null;
    progress: number;
    blockers: number;
    status: 'in_progress' | 'completed' | 'blocked';
    created_at: string;
    updated_at: string;
    employee?: { first_name: string; last_name: string; email?: string | null } | null;
}

export function useOnboardingChecklists(search?: string) {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['hr-onboarding-checklists', user?.org_id, search],
        queryFn: async (): Promise<OnboardingChecklist[]> => {
            if (!user?.org_id) return [];
            let query = (supabase as any)
                .from('hr_onboarding_checklists')
                .select('*, hr_employees!left(id, first_name, last_name, email)')
                .eq('org_id', user.org_id)
                .order('start_date', { ascending: false });
            if (search && search.trim()) {
                const s = search.trim();
                query = query.or(
                    `role.ilike.%${s}%,manager.ilike.%${s}%,hr_employees.first_name.ilike.%${s}%,hr_employees.last_name.ilike.%${s}%,hr_employees.email.ilike.%${s}%`
                );
            }
            const { data, error } = await query;
            if (error && error.code !== 'PGRST116') throw error;
            return (data || []).map((row: any) => ({
                ...row,
                employee: row.hr_employees ? {
                    first_name: row.hr_employees.first_name,
                    last_name: row.hr_employees.last_name,
                    email: row.hr_employees.email,
                } : null,
            })) as OnboardingChecklist[];
        },
    });
}

export function useCreateOnboarding() {
    const { user } = useAuth();
    const { toast } = useToast();
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: Partial<OnboardingChecklist>) => {
            if (!user?.org_id) throw new Error('No organization');
            const { data, error } = await (supabase as any)
                .from('hr_onboarding_checklists')
                .insert({
                    org_id: user.org_id,
                    employee_id: payload.employee_id || null,
                    role: payload.role || null,
                    start_date: payload.start_date || null,
                    manager: payload.manager || null,
                    progress: payload.progress ?? 0,
                    blockers: payload.blockers ?? 0,
                    status: payload.status || 'in_progress',
                })
                .select()
                .single();
            if (error) throw error;
            return data as OnboardingChecklist;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['hr-onboarding-checklists'] });
            toast({ title: 'Created', description: 'Onboarding checklist created.' });
        },
        onError: (e: any) => {
            toast({ title: 'Error', description: e?.message || 'Failed to create checklist', variant: 'destructive' });
        }
    });
}

export function useUpdateOnboarding() {
    const { toast } = useToast();
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<OnboardingChecklist> }) => {
            const { error } = await (supabase as any)
                .from('hr_onboarding_checklists')
                .update(updates)
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['hr-onboarding-checklists'] });
            toast({ title: 'Updated', description: 'Onboarding checklist updated.' });
        },
        onError: (e: any) => {
            toast({ title: 'Error', description: e?.message || 'Failed to update checklist', variant: 'destructive' });
        }
    });
}

export function useDeleteOnboarding() {
    const { toast } = useToast();
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await (supabase as any)
                .from('hr_onboarding_checklists')
                .delete()
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['hr-onboarding-checklists'] });
            toast({ title: 'Deleted', description: 'Onboarding checklist deleted.' });
        },
        onError: (e: any) => {
            toast({ title: 'Error', description: e?.message || 'Failed to delete checklist', variant: 'destructive' });
        }
    });
}
