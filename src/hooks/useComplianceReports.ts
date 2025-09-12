import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ComplianceStats {
  totalPoliciesAssigned: number;
  totalAcknowledged: number;
  acknowledgementRate: number;
  policiesExpired: number;
}

export interface TeamComplianceRate {
  team: string;
  rate: number;
}

export interface PendingUser {
  userName: string;
  department: string;
  pending: number;
  dueDate: string;
}

export interface ExpiredPolicy {
  policyName: string;
  expiredDate: string;
  status: string;
}

export interface AuditLogEntry {
  dateTime: string;
  user: string;
  action: string;
  policy: string;
  status: string;
}

export const useComplianceStats = (metrics?: string[], dateRange?: { start: string; end: string }) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['compliance-stats', metrics, dateRange],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const stats: ComplianceStats = {
        totalPoliciesAssigned: 0,
        totalAcknowledged: 0,
        acknowledgementRate: 0,
        policiesExpired: 0,
      };

      if (metrics?.includes('acknowledgement') || metrics?.includes('compliance')) {
        // Get total policies that require acknowledgment
        const { count: totalPolicies } = await supabase
          .from('policy_documents')
          .select('*', { count: 'exact', head: true })
          .eq('acknowledgment_required', true);

        // Get total acknowledgments
        const { count: totalAcknowledged } = await supabase
          .from('policy_acknowledgments')
          .select('*', { count: 'exact', head: true });

        stats.totalPoliciesAssigned = totalPolicies || 0;
        stats.totalAcknowledged = totalAcknowledged || 0;
        stats.acknowledgementRate = stats.totalPoliciesAssigned > 0 
          ? Math.round((stats.totalAcknowledged / stats.totalPoliciesAssigned) * 100)
          : 0;
      }

      if (metrics?.includes('expired')) {
        const { count: expiredCount } = await supabase
          .from('policy_documents')
          .select('*', { count: 'exact', head: true })
          .lt('expires_date', new Date().toISOString().split('T')[0]);

        stats.policiesExpired = expiredCount || 0;
      }

      return stats;
    },
    enabled: !!user && !!metrics && metrics.length > 0,
  });
};

export const useTeamComplianceRates = (metrics?: string[]) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['team-compliance-rates', metrics],
    queryFn: async () => {
      if (!user || !metrics?.includes('compliance')) return [];

      // Get departments and their acknowledgment rates
      const { data: departments } = await supabase
        .from('departments')
        .select('id, name');

      if (!departments) return [];

      const teamRates: TeamComplianceRate[] = [];

      for (const dept of departments) {
        // Get users in this department
        const { count: departmentUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('department_id', dept.id);

        // Get acknowledgments from users in this department
        const { count: departmentAcks } = await supabase
          .from('policy_acknowledgments')
          .select(`
            *,
            profiles!inner(department_id)
          `, { count: 'exact', head: true })
          .eq('profiles.department_id', dept.id);

        const rate = departmentUsers && departmentUsers > 0 
          ? Math.round(((departmentAcks || 0) / departmentUsers) * 100)
          : 0;

        teamRates.push({
          team: dept.name,
          rate: Math.min(rate, 100), // Cap at 100%
        });
      }

      return teamRates;
    },
    enabled: !!user && !!metrics?.includes('compliance'),
  });
};

export const usePendingUsers = (metrics?: string[]) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['pending-users', metrics],
    queryFn: async () => {
      if (!user || !metrics?.includes('acknowledgement')) return [];

      // Get policies requiring acknowledgment
      const { data: policies } = await supabase
        .from('policy_documents')
        .select('id, expires_date')
        .eq('acknowledgment_required', true);

      if (!policies) return [];

      // Get users who haven't acknowledged all required policies
      const pendingUsers: PendingUser[] = [];

      const { data: users } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          departments(name)
        `);

      if (!users) return [];

      for (const userProfile of users) {
        let pendingCount = 0;
        let earliestDueDate = '';

        for (const policy of policies) {
          const { count: acknowledgedCount } = await supabase
            .from('policy_acknowledgments')
            .select('*', { count: 'exact', head: true })
            .eq('policy_document_id', policy.id)
            .eq('user_id', userProfile.id);

          if (acknowledgedCount === 0) {
            pendingCount++;
            if (!earliestDueDate || (policy.expires_date && policy.expires_date < earliestDueDate)) {
              earliestDueDate = policy.expires_date || '';
            }
          }
        }

        if (pendingCount > 0) {
          pendingUsers.push({
            userName: userProfile.full_name || 'Unknown User',
            department: (userProfile.departments as any)?.name || 'No Department',
            pending: pendingCount,
            dueDate: earliestDueDate || new Date().toISOString().split('T')[0],
          });
        }
      }

      return pendingUsers.slice(0, 10); // Limit to top 10
    },
    enabled: !!user && !!metrics?.includes('acknowledgement'),
  });
};

export const useExpiredPolicies = (metrics?: string[]) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['expired-policies', metrics],
    queryFn: async () => {
      if (!user || !metrics?.includes('expired')) return [];

      const { data: expiredPolicies, error } = await supabase
        .from('policy_documents')
        .select(`
          id,
          expires_date,
          documents(title)
        `)
        .lt('expires_date', new Date().toISOString().split('T')[0])
        .order('expires_date', { ascending: false })
        .limit(10);

      if (error) throw error;

      return (expiredPolicies || []).map(policy => ({
        policyName: (policy.documents as any)?.title || 'Untitled Policy',
        expiredDate: policy.expires_date || '',
        status: 'Expired',
      }));
    },
    enabled: !!user && !!metrics?.includes('expired'),
  });
};

export const useAuditHistory = (metrics?: string[]) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['audit-history', metrics],
    queryFn: async () => {
      if (!user || !metrics?.includes('audit')) return [];

      // Get recent acknowledgments as audit entries
      const { data: acknowledgments, error } = await supabase
        .from('policy_acknowledgments')
        .select(`
          acknowledged_at,
          user_id,
          policy_documents!inner(
            documents!inner(title)
          ),
          profiles!user_id(full_name)
        `)
        .order('acknowledged_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return (acknowledgments || []).map(ack => ({
        dateTime: new Date(ack.acknowledged_at).toLocaleString(),
        user: (ack.profiles as any)?.full_name || 'Unknown User',
        action: 'Acknowledged',
        policy: (ack.policy_documents as any)?.documents?.title || 'Unknown Policy',
        status: 'Completed',
      }));
    },
    enabled: !!user && !!metrics?.includes('audit'),
  });
};