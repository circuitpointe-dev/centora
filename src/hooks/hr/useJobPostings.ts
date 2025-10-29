import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface JobPosting {
    id: string;
    org_id: string;
    position_title: string;
    department?: string;
    employment_type?: string;
    status: string;
    posted_date?: string;
    closing_date?: string;
    created_by?: string;
    created_at: string;
    updated_at: string;
}

export interface JobApplication {
    id: string;
    org_id: string;
    job_posting_id: string;
    candidate_name: string;
    candidate_email: string;
    candidate_phone?: string;
    stage: string;
    resume_url?: string;
    cover_letter?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export function useJobPostings(status?: string) {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-job-postings', user?.org_id, status],
        queryFn: async (): Promise<JobPosting[]> => {
            if (!user?.org_id) return [];

            let query = (supabase as any)
                .from('hr_job_postings')
                .select('*')
                .eq('org_id', user.org_id)
                .order('posted_date', { ascending: false });

            if (status) {
                query = query.eq('status', status);
            }

            const { data, error } = await query;
            if (error) throw error;
            return (data || []) as JobPosting[];
        },
        staleTime: 5 * 60 * 1000,
    });
}

export function useJobApplications(jobPostingId?: string) {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-job-applications', user?.org_id, jobPostingId],
        queryFn: async (): Promise<JobApplication[]> => {
            if (!user?.org_id) return [];

            let query = (supabase as any)
                .from('hr_job_applications')
                .select('*')
                .eq('org_id', user.org_id)
                .order('created_at', { ascending: false });

            if (jobPostingId) {
                query = query.eq('job_posting_id', jobPostingId);
            }

            const { data, error } = await query;
            if (error) throw error;
            return (data || []) as JobApplication[];
        },
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreateJobPosting() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (posting: Omit<JobPosting, 'id' | 'org_id' | 'created_at' | 'updated_at'>) => {
            if (!user?.org_id) throw new Error('No organization');

            const { data, error } = await (supabase as any)
                .from('hr_job_postings')
                .insert({
                    ...posting,
                    org_id: user.org_id,
                    created_by: user.id,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-job-postings'] });
            toast({
                title: 'Job posting created',
                description: 'The job posting has been created successfully.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to create job posting',
                variant: 'destructive',
            });
        },
    });
}

export function useUpdateApplicationStage() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ id, stage }: { id: string; stage: string }) => {
            const { error } = await (supabase as any)
                .from('hr_job_applications')
                .update({ stage, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-job-applications'] });
            queryClient.invalidateQueries({ queryKey: ['hr-recruiting-funnel'] });
            toast({
                title: 'Application updated',
                description: 'Application stage has been updated.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update application',
                variant: 'destructive',
            });
        },
    });
}

