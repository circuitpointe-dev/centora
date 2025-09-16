import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DeadlineItem {
  id: string;
  title: string;
  organization: string;
  dueDate: string;
  status: 'Urgent' | 'Due Soon' | 'Upcoming';
  type: 'opportunity' | 'proposal';
}

export const useDeadlines = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['deadlines', user?.org_id],
    queryFn: async (): Promise<DeadlineItem[]> => {
      if (!user?.org_id) throw new Error('No organization');
      
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      // Get opportunity deadlines
      const { data: opportunities } = await supabase
        .from('opportunities')
        .select(`
          id,
          title,
          deadline,
          donor:donors!donor_id(name)
        `)
        .lte('deadline', thirtyDaysFromNow.toISOString().split('T')[0])
        .gte('deadline', today.toISOString().split('T')[0])
        .order('deadline', { ascending: true });

      // Get proposal deadlines
      const { data: proposals } = await supabase
        .from('proposals')
        .select('id, name, due_date, dueDate')
        .eq('org_id', user.org_id)
        .not('status', 'eq', 'Archived')
        .order('due_date', { ascending: true });

      const deadlines: DeadlineItem[] = [];

      // Process opportunities
      (opportunities || []).forEach((opp: any) => {
        const deadline = new Date(opp.deadline);
        const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        let status: 'Urgent' | 'Due Soon' | 'Upcoming';
        let dueDateText: string;
        
        if (daysUntilDeadline <= 1) {
          status = 'Urgent';
          dueDateText = daysUntilDeadline === 0 ? 'Due: Today' : 'Due: Tomorrow';
        } else if (daysUntilDeadline <= 7) {
          status = 'Due Soon';
          dueDateText = `Due in ${daysUntilDeadline} days`;
        } else {
          status = 'Upcoming';
          dueDateText = `Due in ${Math.ceil(daysUntilDeadline / 7)} week${Math.ceil(daysUntilDeadline / 7) > 1 ? 's' : ''}`;
        }

        deadlines.push({
          id: opp.id,
          title: `Opportunity: "${opp.title}"`,
          organization: opp.donor?.name || 'Unknown',
          dueDate: dueDateText,
          status,
          type: 'opportunity'
        });
      });

      // Process proposals
      (proposals || []).forEach((prop: any) => {
        const dueDate = prop.due_date || prop.dueDate;
        if (!dueDate) return;
        
        const deadline = new Date(dueDate);
        const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        // Only include if within 30 days
        if (daysUntilDeadline <= 30 && daysUntilDeadline >= 0) {
          let status: 'Urgent' | 'Due Soon' | 'Upcoming';
          let dueDateText: string;
          
          if (daysUntilDeadline <= 1) {
            status = 'Urgent';
            dueDateText = daysUntilDeadline === 0 ? 'Due: Today' : 'Due: Tomorrow';
          } else if (daysUntilDeadline <= 7) {
            status = 'Due Soon';
            dueDateText = `Due in ${daysUntilDeadline} days`;
          } else {
            status = 'Upcoming';
            dueDateText = `Due in ${Math.ceil(daysUntilDeadline / 7)} week${Math.ceil(daysUntilDeadline / 7) > 1 ? 's' : ''}`;
          }

          deadlines.push({
            id: prop.id,
            title: `Proposal: "${prop.name}"`,
            organization: 'Internal',
            dueDate: dueDateText,
            status,
            type: 'proposal'
          });
        }
      });

      // Sort by urgency and date
      return deadlines.sort((a, b) => {
        const statusOrder = { 'Urgent': 0, 'Due Soon': 1, 'Upcoming': 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      });
    },
    enabled: !!user?.org_id,
  });
};