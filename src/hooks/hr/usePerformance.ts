import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface PerformanceReview {
    id: string;
    org_id: string;
    employee_id: string;
    review_period_start: string;
    review_period_end: string;
    review_type?: string;
    overall_rating?: string;
    reviewer_id?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export function usePerformanceReviews(employeeId?: string) {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-performance-reviews', user?.org_id, employeeId],
        queryFn: async (): Promise<PerformanceReview[]> => {
            if (!user?.org_id) return [];

            let query = supabase
                .from('hr_performance_reviews')
                .select('*')
                .eq('org_id', user.org_id)
                .order('review_period_end', { ascending: false });

            if (employeeId) {
                query = query.eq('employee_id', employeeId);
            }

            const { data, error } = await query;
            if (error && error.code !== 'PGRST116') throw error;
            return (data || []) as PerformanceReview[];
        },
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreatePerformanceReview() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (review: Omit<PerformanceReview, 'id' | 'org_id' | 'created_at' | 'updated_at'>) => {
            if (!user?.org_id) throw new Error('No organization');

            const { data, error } = await supabase
                .from('hr_performance_reviews')
                .insert({
                    ...review,
                    org_id: user.org_id,
                    reviewer_id: user.id,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-performance-reviews'] });
            toast({
                title: 'Performance review created',
                description: 'The performance review has been created successfully.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to create performance review',
                variant: 'destructive',
            });
        },
    });
}

