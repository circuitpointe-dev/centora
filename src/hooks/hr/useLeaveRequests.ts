import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface LeaveRequest {
    id: string;
    org_id: string;
    employee_id: string;
    leave_type: string;
    start_date: string;
    end_date: string;
    days_requested: number;
    reason?: string;
    status: string;
    approved_by?: string;
    approved_at?: string;
    created_at: string;
    updated_at: string;
}

export function useLeaveRequests(employeeId?: string, status?: string) {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-leave-requests', user?.org_id, employeeId, status],
        queryFn: async (): Promise<LeaveRequest[]> => {
            if (!user?.org_id) return [];

            let query = supabase
                .from('hr_leave_requests')
                .select('*')
                .eq('org_id', user.org_id)
                .order('start_date', { ascending: false });

            if (employeeId) {
                query = query.eq('employee_id', employeeId);
            }

            if (status) {
                query = query.eq('status', status);
            }

            const { data, error } = await query;
            if (error && error.code !== 'PGRST116') throw error;
            return (data || []) as LeaveRequest[];
        },
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreateLeaveRequest() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (request: Omit<LeaveRequest, 'id' | 'org_id' | 'created_at' | 'updated_at' | 'approved_by' | 'approved_at'>) => {
            if (!user?.org_id) throw new Error('No organization');

            const { data, error } = await supabase
                .from('hr_leave_requests')
                .insert({
                    ...request,
                    org_id: user.org_id,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-leave-requests'] });
            toast({
                title: 'Leave request submitted',
                description: 'Your leave request has been submitted for approval.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to submit leave request',
                variant: 'destructive',
            });
        },
    });
}

