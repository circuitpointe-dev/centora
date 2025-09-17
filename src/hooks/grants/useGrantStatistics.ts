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

      // Fetch all grants for the organization
      const { data: grants, error: grantsError } = await supabase
        .from('grants')
        .select('*');

      if (grantsError) throw grantsError;

      // Fetch compliance data
      const { data: compliance, error: complianceError } = await supabase
        .from('grant_compliance')
        .select('*');

      if (complianceError) throw complianceError;

      // Fetch disbursement data
      const { data: disbursements, error: disbursementsError } = await supabase
        .from('grant_disbursements')
        .select('*');

      if (disbursementsError) throw disbursementsError;

      // Calculate statistics
      const totalGrants = grants?.length || 0;
      const activeGrants = grants?.filter(g => g.status === 'active').length || 0;
      const closedGrants = grants?.filter(g => g.status === 'closed').length || 0;
      const totalValue = grants?.reduce((sum, g) => sum + Number(g.amount), 0) || 0;
      
      const completedCompliance = compliance?.filter(c => c.status === 'completed').length || 0;
      const totalCompliance = compliance?.length || 0;
      const complianceRate = totalCompliance > 0 ? (completedCompliance / totalCompliance) * 100 : 0;
      
      const releasedDisbursements = disbursements?.filter(d => d.status === 'released').reduce((sum, d) => sum + Number(d.amount), 0) || 0;
      const disbursementRate = totalValue > 0 ? (releasedDisbursements / totalValue) * 100 : 0;
      
      // Simple burn rate calculation (could be enhanced with time-based logic)
      const pendingDisbursements = disbursements?.filter(d => d.status === 'pending').reduce((sum, d) => sum + Number(d.amount), 0) || 0;
      const burnRate = totalValue > 0 ? ((totalValue - pendingDisbursements) / totalValue) * 100 : 0;

      setStatistics({
        total_grants: totalGrants,
        active_grants: activeGrants,
        closed_grants: closedGrants,
        total_value: totalValue,
        disbursement_rate: disbursementRate,
        compliance_rate: complianceRate,
        burn_rate: burnRate,
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

  return {
    statistics,
    loading,
    refetch: fetchStatistics,
  };
};