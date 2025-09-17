import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FinanceStats {
  totalRevenue: number;
  activeProjects: number;
  teamMembers: number;
  growthRate: number;
  revenueChange: number;
  projectsChange: number;
  teamChange: number;
}

export interface RecentActivity {
  id: string;
  description: string;
  time: string;
  amount?: number;
  category?: string;
}

export const useFinanceStats = () => {
  return useQuery({
    queryKey: ['finance-stats'],
    queryFn: async (): Promise<FinanceStats> => {
      // Get total revenue from revenue accounts
      const { data: revenueData } = await supabase
        .from('financial_accounts')
        .select('balance')
        .eq('account_type', 'revenue');

      // Get active projects count
      const { data: projectsData } = await supabase
        .from('financial_projects')
        .select('id, budget_allocated')
        .eq('status', 'active');

      // Get team members count
      const { data: teamData } = await supabase
        .from('finance_team_members')
        .select('id')
        .eq('status', 'active');

      const totalRevenue = Math.abs(revenueData?.reduce((sum, account) => sum + Number(account.balance), 0) || 0);
      const activeProjects = projectsData?.length || 0;
      const teamMembers = teamData?.length || 0;

      // Mock growth rate calculation (in real app, compare with previous period)
      const growthRate = 12;
      const revenueChange = 20.1;
      const projectsChange = 2;
      const teamChange = 4;

      return {
        totalRevenue,
        activeProjects,
        teamMembers,
        growthRate,
        revenueChange,
        projectsChange,
        teamChange,
      };
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

export const useRecentFinanceActivity = () => {
  return useQuery({
    queryKey: ['recent-finance-activity'],
    queryFn: async (): Promise<RecentActivity[]> => {
      const { data: transactions } = await supabase
        .from('financial_transactions')
        .select('id, description, amount, category, created_at')
        .order('created_at', { ascending: false })
        .limit(4);

      return transactions?.map(transaction => ({
        id: transaction.id,
        description: transaction.description,
        time: new Date(transaction.created_at).toLocaleString(),
        amount: Number(transaction.amount),
        category: transaction.category || 'General',
      })) || [];
    },
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
};