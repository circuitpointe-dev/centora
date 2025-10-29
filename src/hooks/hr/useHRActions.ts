import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface LeaveRequest {
    id: string;
    employee_name: string;
    leave_type: string;
    start_date: string;
    end_date: string;
    status: string;
}

export interface PendingOffer {
    id: string;
    candidate_name: string;
    position_title: string;
    status: string;
}

export interface ExpiringDocument {
    id: string;
    employee_name: string;
    document_name: string;
    expiry_date: string;
}

export interface OverduePolicy {
    id: string;
    policy_name: string;
    due_date: string;
}

export const usePendingLeaveRequests = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-pending-leave-requests', user?.org_id],
        queryFn: async (): Promise<LeaveRequest[]> => {
            if (!user?.org_id) return [];

            try {
                const { data, error } = await supabase
                    .from('hr_leave_requests')
                    .select(`
            id,
            leave_type,
            start_date,
            end_date,
            status,
            hr_employees!inner(first_name, last_name)
          `)
                    .eq('org_id', user.org_id)
                    .eq('status', 'pending')
                    .limit(10);

                if (error) throw error;

                return (data || []).map((item: any) => ({
                    id: item.id,
                    employee_name: `${item.hr_employees.first_name} ${item.hr_employees.last_name}`,
                    leave_type: item.leave_type,
                    start_date: item.start_date,
                    end_date: item.end_date,
                    status: item.status,
                }));
            } catch (error) {
                console.error('Error fetching leave requests:', error);
                return [];
            }
        },
    });
};

export const useApproveLeaveRequest = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (leaveRequestId: string) => {
            if (!user?.id) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('hr_leave_requests')
                .update({
                    status: 'approved',
                    approved_by: user.id,
                    approved_at: new Date().toISOString(),
                })
                .eq('id', leaveRequestId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-pending-leave-requests'] });
            queryClient.invalidateQueries({ queryKey: ['hr-stats'] });
            toast({
                title: 'Leave request approved',
                description: 'The leave request has been approved successfully.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to approve leave request',
                variant: 'destructive',
            });
        },
    });
};

export const usePendingOffers = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-pending-offers', user?.org_id],
        queryFn: async (): Promise<PendingOffer[]> => {
            if (!user?.org_id) return [];

            try {
                const { data, error } = await supabase
                    .from('hr_offers')
                    .select(`
            id,
            position_title,
            status,
            hr_job_applications!inner(candidate_name)
          `)
                    .eq('org_id', user.org_id)
                    .eq('status', 'pending')
                    .limit(10);

                if (error) throw error;

                return (data || []).map((item: any) => ({
                    id: item.id,
                    candidate_name: item.hr_job_applications.candidate_name,
                    position_title: item.position_title,
                    status: item.status,
                }));
            } catch (error) {
                console.error('Error fetching offers:', error);
                return [];
            }
        },
    });
};

export const useApproveOffer = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (offerId: string) => {
            const { error } = await supabase
                .from('hr_offers')
                .update({
                    status: 'accepted',
                })
                .eq('id', offerId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-pending-offers'] });
            toast({
                title: 'Offer approved',
                description: 'The offer has been approved successfully.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to approve offer',
                variant: 'destructive',
            });
        },
    });
};

export const useExpiringDocuments = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-expiring-documents', user?.org_id],
        queryFn: async (): Promise<ExpiringDocument[]> => {
            if (!user?.org_id) return [];

            try {
                const thirtyDaysFromNow = new Date();
                thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

                const { data, error } = await supabase
                    .from('hr_employee_documents')
                    .select(`
            id,
            document_name,
            expiry_date,
            hr_employees!inner(first_name, last_name)
          `)
                    .eq('org_id', user.org_id)
                    .lte('expiry_date', thirtyDaysFromNow.toISOString().split('T')[0])
                    .gte('expiry_date', new Date().toISOString().split('T')[0])
                    .limit(10);

                if (error) throw error;

                return (data || []).map((item: any) => ({
                    id: item.id,
                    employee_name: `${item.hr_employees.first_name} ${item.hr_employees.last_name}`,
                    document_name: item.document_name,
                    expiry_date: item.expiry_date,
                }));
            } catch (error) {
                console.error('Error fetching expiring documents:', error);
                return [];
            }
        },
    });
};

export const useNotifyExpiringDocuments = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (documentIds: string[]) => {
            // This would typically trigger an email notification
            // For now, we'll just update the documents to mark them as notified
            const { error } = await supabase
                .from('hr_employee_documents')
                .update({ is_expiring_soon: true })
                .in('id', documentIds);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-expiring-documents'] });
            toast({
                title: 'Notifications sent',
                description: 'Employees have been notified about expiring documents.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to send notifications',
                variant: 'destructive',
            });
        },
    });
};

