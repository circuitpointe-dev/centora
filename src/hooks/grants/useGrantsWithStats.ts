import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Grant, GrantFilters } from '@/types/grants';
import { useToast } from '@/hooks/use-toast';

// Extended grant interface with calculated stats
export interface GrantWithStats extends Grant {
  compliance_rate: number;
  disbursement_rate: number;
  reporting_status: string;
}

export const useGrantsWithStats = (filters?: Partial<GrantFilters>) => {
  const [grants, setGrants] = useState<GrantWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchGrantsWithStats = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('grants')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters if provided
      if (filters) {
        if (filters.grant_name) {
          query = query.ilike('grant_name', `%${filters.grant_name}%`);
        }
        if (filters.donor_name) {
          query = query.ilike('donor_name', `%${filters.donor_name}%`);
        }
        if (filters.status && filters.status !== 'all') {
          query = query.eq('status', filters.status as 'active' | 'pending' | 'closed' | 'cancelled');
        }
        if (filters.region && filters.region !== 'all') {
          query = query.eq('region', filters.region);
        }
        if (filters.program_area && filters.program_area !== 'all') {
          query = query.eq('program_area', filters.program_area);
        }
      }

      const { data: grantsData, error: grantsError } = await query;

      if (grantsError) throw grantsError;

      if (!grantsData || grantsData.length === 0) {
        setGrants([]);
        return;
      }

      // Fetch compliance data for all grants
      const { data: complianceData, error: complianceError } = await supabase
        .from('grant_compliance')
        .select('grant_id, status')
        .in('grant_id', grantsData.map(g => g.id));

      if (complianceError) throw complianceError;

      // Fetch disbursement data for all grants
      const { data: disbursementData, error: disbursementError } = await supabase
        .from('grant_disbursements')
        .select('grant_id, status, amount')
        .in('grant_id', grantsData.map(g => g.id));

      if (disbursementError) throw disbursementError;

      // Fetch reports data for all grants
      const { data: reportsData, error: reportsError } = await supabase
        .from('grant_reports')
        .select('grant_id, submitted, due_date')
        .in('grant_id', grantsData.map(g => g.id));

      if (reportsError) throw reportsError;

      // Calculate stats for each grant
      const grantsWithStats: GrantWithStats[] = grantsData.map(grant => {
        // Calculate compliance rate
        const grantCompliance = complianceData?.filter(c => c.grant_id === grant.id) || [];
        const completedCompliance = grantCompliance.filter(c => c.status === 'completed').length;
        const compliance_rate = grantCompliance.length > 0 
          ? Math.round((completedCompliance / grantCompliance.length) * 100) 
          : 0;

        // Calculate disbursement rate
        const grantDisbursements = disbursementData?.filter(d => d.grant_id === grant.id) || [];
        const totalDisbursements = grantDisbursements.reduce((sum, d) => sum + (d.amount || 0), 0);
        const releasedDisbursements = grantDisbursements
          .filter(d => d.status === 'released')
          .reduce((sum, d) => sum + (d.amount || 0), 0);
        const disbursement_rate = totalDisbursements > 0 
          ? Math.round((releasedDisbursements / totalDisbursements) * 100) 
          : 0;

        // Determine reporting status
        const grantReports = reportsData?.filter(r => r.grant_id === grant.id) || [];
        let reporting_status = 'No Reports';
        
        if (grantReports.length > 0) {
          const submittedReports = grantReports.filter(r => r.submitted).length;
          const overdueReports = grantReports.filter(r => !r.submitted && new Date(r.due_date) < new Date()).length;
          
          if (submittedReports === grantReports.length) {
            reporting_status = 'All Submitted';
          } else if (overdueReports > 0) {
            reporting_status = `${overdueReports} Overdue`;
          } else {
            const pendingReports = grantReports.length - submittedReports;
            reporting_status = `${pendingReports} Due`;
          }
        }

        return {
          ...grant,
          compliance_rate,
          disbursement_rate,
          reporting_status,
        };
      });

      setGrants(grantsWithStats);
    } catch (err) {
      console.error('Error fetching grants with stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch grants');
      toast({
        title: 'Error',
        description: 'Failed to fetch grants. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrantsWithStats();
  }, [filters]);

  return {
    grants,
    loading,
    error,
    refetch: fetchGrantsWithStats,
  };
};