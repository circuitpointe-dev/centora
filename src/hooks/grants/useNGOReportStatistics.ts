import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NGOReportStatistics {
  totalDue: number;
  overdue: number;
  submitted: number;
  upcoming: number;
}

export const useNGOReportStatistics = () => {
  const [reportsData, setReportsData] = useState<NGOReportStatistics>({
    totalDue: 0,
    overdue: 0,
    submitted: 0,
    upcoming: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReportStatistics = async () => {
    try {
      setLoading(true);

      // Get current date for comparison
      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      // Fetch all reports
      const { data: reports, error: reportsError } = await supabase
        .from('grant_reports')
        .select('due_date, submitted')
        .gte('due_date', currentMonth.toISOString().split('T')[0])
        .lt('due_date', nextMonth.toISOString().split('T')[0]);

      if (reportsError) throw reportsError;

      const totalDue = reports?.length || 0;
      const submitted = reports?.filter(r => r.submitted).length || 0;
      const overdue = reports?.filter(r => !r.submitted && new Date(r.due_date) < now).length || 0;
      const upcoming = totalDue - submitted - overdue;

      setReportsData({
        totalDue,
        overdue,
        submitted,
        upcoming,
      });
    } catch (err) {
      console.error('Error fetching report statistics:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch report statistics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportStatistics();
  }, []);

  return { reportsData, loading, refetch: fetchReportStatistics };
};