import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useSendDocumentReminder() {
    const { user } = useAuth();
    const { toast } = useToast();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (payload: { document_id: string }) => {
            if (!user?.org_id) throw new Error('No organization');
            // For now, just update a last_reminded_at timestamp if we add that column
            // Or log the reminder action
            // In future, this could trigger an email via Edge Function
            const { error } = await (supabase as any)
                .from('hr_employee_documents')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', payload.document_id)
                .eq('org_id', user.org_id);
            if (error) throw error;
            return { success: true };
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['hr-employee-documents'] });
            toast({ title: 'Reminder recorded', description: 'Document reminder has been recorded.' });
        },
        onError: (e: any) => {
            toast({ title: 'Error', description: e?.message || 'Failed to record reminder', variant: 'destructive' });
        }
    });
}

