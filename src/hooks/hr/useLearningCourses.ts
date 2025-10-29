import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface LearningCourse {
    id: string;
    org_id: string;
    course_name: string;
    course_type?: string;
    provider?: string;
    description?: string;
    duration_hours?: number;
    category?: string;
    level?: string;
    status: string;
    enrollment_open: boolean;
    created_at: string;
    updated_at: string;
}

export function useLearningCourses() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-learning-courses', user?.org_id],
        queryFn: async (): Promise<LearningCourse[]> => {
            if (!user?.org_id) return [];

            const { data, error } = await supabase
                .from('hr_learning_courses')
                .select('*')
                .eq('org_id', user.org_id)
                .order('created_at', { ascending: false });

            if (error && error.code !== 'PGRST116') throw error;
            return (data || []) as LearningCourse[];
        },
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreateCourse() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (course: Omit<LearningCourse, 'id' | 'org_id' | 'created_at' | 'updated_at'>) => {
            if (!user?.org_id) throw new Error('No organization');

            const { data, error } = await supabase
                .from('hr_learning_courses')
                .insert({
                    ...course,
                    org_id: user.org_id,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-learning-courses'] });
            toast({
                title: 'Course created',
                description: 'Learning course has been created successfully.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to create course',
                variant: 'destructive',
            });
        },
    });
}

export function useUpdateCourse() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<LearningCourse> }) => {
            const { data, error } = await supabase
                .from('hr_learning_courses')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-learning-courses'] });
            toast({
                title: 'Course updated',
                description: 'Learning course has been updated.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update course',
                variant: 'destructive',
            });
        },
    });
}

export function useDeleteCourse() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('hr_learning_courses')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-learning-courses'] });
            toast({
                title: 'Course deleted',
                description: 'Learning course has been deleted.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete course',
                variant: 'destructive',
            });
        },
    });
}

