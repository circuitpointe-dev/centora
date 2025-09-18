import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface GranteeSubmission {
  id: string;
  grant_id: string;
  submission_type: string;
  status: string;
  submitted_date: string;
  organization_name: string;
  document_path?: string;
  feedback?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Related grant data
  grant?: {
    grant_name: string;
    donor_name: string;
  };
}

export const useGranteeSubmissions = () => {
  const [submissions, setSubmissions] = useState<GranteeSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('grantee_submissions')
        .select(`
          *,
          grant:grants(grant_name, donor_name)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setSubmissions(data || []);
    } catch (err) {
      console.error('Error fetching grantee submissions:', err);
      setError('Failed to fetch grantee submissions');
      toast({
        title: 'Error',
        description: 'Failed to fetch grantee submissions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (id: string, status: string, feedback?: string) => {
    try {
      const { error } = await supabase
        .from('grantee_submissions')
        .update({ 
          status, 
          feedback,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      await fetchSubmissions();
      toast({
        title: 'Success',
        description: 'Submission status updated successfully',
      });
    } catch (err) {
      console.error('Error updating submission status:', err);
      toast({
        title: 'Error',
        description: 'Failed to update submission status',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteSubmission = async (id: string) => {
    try {
      const { error } = await supabase
        .from('grantee_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchSubmissions();
      toast({
        title: 'Success',
        description: 'Submission deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting submission:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete submission',
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return {
    submissions,
    loading,
    error,
    refetch: fetchSubmissions,
    updateSubmissionStatus,
    deleteSubmission,
  };
};