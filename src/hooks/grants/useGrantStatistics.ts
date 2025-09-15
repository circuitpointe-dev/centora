import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GrantStatistics } from '@/types/grants';
import { useToast } from '@/hooks/use-toast';

export const useGrantStatistics = () => {
  const [statistics, setStatistics] = useState<GrantStatistics>({
    total_grants: 0,
    active_grants: 0,
    closed_grants: 0,
    total_value: 0,
    disbursement_rate: 0,
    compliance_rate: 0,
    burn_rate: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStatistics = async () => {
    try {
      setLoading(true);

      // Fetch grants data
      const { data: grants, error: grantsError } = await supabase
        .from('grants')
        .select('status, amount');

      if (grantsError) throw grantsError;

      // Calculate grant statistics
      const total_grants = grants?.length || 0;
      const active_grants = grants?.filter(g => g.status === 'active').length || 0;
      const closed_grants = grants?.filter(g => g.status === 'closed').length || 0;
      const total_value = grants?.reduce((sum, g) => sum + (g.amount || 0), 0) || 0;

      // Fetch disbursement data for disbursement rate
      const { data: disbursements, error: disbError } = await supabase
        .from('grant_disbursements')
        .select('status, amount');

      if (disbError) throw disbError;

      const totalDisbursements = disbursements?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;
      const releasedDisbursements = disbursements?.filter(d => d.status === 'released')
        .reduce((sum, d) => sum + (d.amount || 0), 0) || 0;
      const disbursement_rate = totalDisbursements > 0 ? Math.round((releasedDisbursements / totalDisbursements) * 100) : 0;

      // Fetch compliance data for compliance rate
      const { data: compliance, error: compError } = await supabase
        .from('grant_compliance')
        .select('status');

      if (compError) throw compError;

      const totalCompliance = compliance?.length || 0;
      const completedCompliance = compliance?.filter(c => c.status === 'completed').length || 0;
      const compliance_rate = totalCompliance > 0 ? Math.round((completedCompliance / totalCompliance) * 100) : 0;

      // Fetch reports data for burn rate
      const { data: reports, error: reportsError } = await supabase
        .from('grant_reports')
        .select('submitted');

      if (reportsError) throw reportsError;

      const totalReports = reports?.length || 0;
      const submittedReports = reports?.filter(r => r.submitted).length || 0;
      const burn_rate = totalReports > 0 ? Math.round((submittedReports / totalReports) * 100) : 0;

      setStatistics({
        total_grants,
        active_grants,
        closed_grants,
        total_value,
        disbursement_rate,
        compliance_rate,
        burn_rate,
      });
    } catch (err) {
      console.error('Error fetching grant statistics:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch grant statistics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return { statistics, loading, refetch: fetchStatistics };
};