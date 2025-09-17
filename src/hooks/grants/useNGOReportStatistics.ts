import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NGOReportStatistics {
  totalDue: number;
  submitted: number;
  overdue: number;
  upcoming: number;
}

export const useNGOReportStatistics = () => {
  const [reportsData, setReportsData] = useState<NGOReportStatistics>({
    totalDue: 0,
    submitted: 0,
    overdue: 0,
    upcoming: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReportStatistics = async () => {
    try {
      setLoading(true);

      // Fetch all reports for the organization
      const { data: reports, error } = await supabase
        .from('grant_reports')
        .select('*');

      if (error) throw error;

      // Calculate statistics
      const currentDate = new Date();
      const thisMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const totalDue = reports?.filter(r => {
        const dueDate = new Date(r.due_date);
        return dueDate <= thisMonthEnd && !r.submitted;
      }).length || 0;
      
      const submitted = reports?.filter(r => r.submitted).length || 0;
      const overdue = reports?.filter(r => r.status === 'overdue').length || 0;
      const upcoming = reports?.filter(r => r.status === 'upcoming').length || 0;

      setReportsData({
        totalDue,
        submitted,
        overdue,
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

  return {
    reportsData,
    loading,
    refetch: fetchReportStatistics,
  };
};