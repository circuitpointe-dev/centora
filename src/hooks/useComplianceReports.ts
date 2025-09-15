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
        // Get total policy documents (using compliance category)
        const { count: totalPolicies } = await supabase
          .from('documents')
          .select('*', { count: 'exact', head: true })
          .eq('category', 'compliance')
          .eq('status', 'active');

        // Get total acknowledgments
        const { count: totalAcknowledged } = await supabase
          .from('policy_acknowledgments')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'acknowledged');

        stats.totalPoliciesAssigned = totalPolicies || 0;
        stats.totalAcknowledged = totalAcknowledged || 0;
        stats.acknowledgementRate = stats.totalPoliciesAssigned > 0 
          ? Math.round((stats.totalAcknowledged / stats.totalPoliciesAssigned) * 100)
          : 0;
      }

      if (metrics?.includes('expired')) {
        // For now, return 0 as expiry_date column doesn't exist yet
        stats.policiesExpired = 0;
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
            *
          `, { count: 'exact', head: true });

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

      // Get policy documents requiring acknowledgment (simplified)
      const { data: policies } = await supabase
        .from('documents')
        .select('id, created_at')
        .eq('category', 'compliance');

      if (!policies) return [];

      // Get users who haven't acknowledged all required policies
      const pendingUsers: PendingUser[] = [];

      const { data: users } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          department_id
        `);

      if (!users) return [];

      for (const userProfile of users) {
        let pendingCount = 0;
        let earliestDueDate = '';

        for (const policy of policies) {
          const { count: acknowledgedCount } = await supabase
            .from('policy_acknowledgments')
            .select('*', { count: 'exact', head: true })
            .eq('document_id', policy.id)
            .eq('user_id', userProfile.id);

          if (acknowledgedCount === 0) {
            pendingCount++;
            if (!earliestDueDate) {
              // Use a default due date 30 days from now
              earliestDueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            }
          }
        }

        if (pendingCount > 0) {
          pendingUsers.push({
            userName: userProfile.full_name || 'Unknown User',
            department: 'General', // Simplified for now
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

      // Get expired policy documents based on updated_at being older than 1 year
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const { data: expiredPolicies, error } = await supabase
        .from('documents')
        .select('id, title, updated_at, status')
        .eq('category', 'compliance')
        .lt('updated_at', oneYearAgo.toISOString());

      if (error) throw error;

      return (expiredPolicies || []).map(policy => ({
        policyName: policy.title,
        expiredDate: new Date(policy.updated_at).toISOString().split('T')[0],
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
          document_id,
          documents!inner(title),
          profiles!user_id(full_name)
        `)
        .not('acknowledged_at', 'is', null)
        .order('acknowledged_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return (acknowledgments || []).map(ack => ({
        dateTime: new Date(ack.acknowledged_at).toLocaleString(),
        user: (ack.profiles as any)?.full_name || 'Unknown User',
        action: 'Acknowledged',
        policy: (ack.documents as any)?.title || 'Unknown Policy',
        status: 'Completed',
      }));
    },
    enabled: !!user && !!metrics?.includes('audit'),
  });
};