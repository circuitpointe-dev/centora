import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GrantReport } from '@/types/grants';
import { useToast } from '@/hooks/use-toast';

export const useGrantReports = (grantId?: string) => {
  const [reports, setReports] = useState<GrantReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReports = async () => {
    try {
      setLoading(true);

      // Get current user and their organization
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.user.id)
        .single();

      if (!profile?.org_id) throw new Error('User organization not found');

      let query = supabase
        .from('grant_reports')
        .select(`
          *,
          grant:grants!inner(org_id)
        `)
        .eq('grant.org_id', profile.org_id)
        .order('due_date', { ascending: true });

      if (grantId) {
        query = query.eq('grant_id', grantId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setReports(data || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch reports data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [grantId]);

  const createReport = async (reportData: Omit<GrantReport, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('grant_reports')
        .insert({
          ...reportData,
          created_by: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setReports(prev => [...prev, data]);
      toast({
        title: 'Success',
        description: 'Report added successfully',
      });

      return data;
    } catch (err) {
      console.error('Error creating report:', err);
      toast({
        title: 'Error',
        description: 'Failed to add report',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateReport = async (id: string, updates: Partial<GrantReport>) => {
    try {
      const { data, error } = await supabase
        .from('grant_reports')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setReports(prev => prev.map(item => item.id === id ? data : item));
      toast({
        title: 'Success',
        description: 'Report updated successfully',
      });

      return data;
    } catch (err) {
      console.error('Error updating report:', err);
      toast({
        title: 'Error',
        description: 'Failed to update report',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteReport = async (id: string) => {
    try {
      const { error } = await supabase
        .from('grant_reports')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setReports(prev => prev.filter(item => item.id !== id));
      toast({
        title: 'Success',
        description: 'Report deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting report:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete report',
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    reports,
    loading,
    refetch: fetchReports,
    createReport,
    updateReport,
    deleteReport,
  };
};