import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ToDoItem {
  id: string;
  type: 'Deadline' | 'Feedback' | 'Revision request' | 'Reminder';
  title: string;
  description: string;
  timeSince: string;
  grantId?: string;
  relatedId?: string;
}

export const useGrantTodos = () => {
  const [todos, setTodos] = useState<ToDoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTodos = async () => {
    if (!user?.org_id) return;
    
    try {
      setLoading(true);
      
      // Fetch overdue compliance requirements
      const { data: overdueCompliance } = await supabase
        .from('grant_compliance')
        .select(`
          *,
          grants!inner(grant_name, org_id)
        `)
        .eq('grants.org_id', user.org_id)
        .eq('status', 'in_progress')
        .lt('due_date', new Date().toISOString());

      // Fetch overdue reports
      const { data: overdueReports } = await supabase
        .from('grant_reports')
        .select(`
          *,
          grants!inner(grant_name, org_id)
        `)
        .eq('grants.org_id', user.org_id)
        .eq('submitted', false)
        .lt('due_date', new Date().toISOString());

      // Fetch upcoming deadlines (next 7 days)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const { data: upcomingDeadlines } = await supabase
        .from('grant_compliance')
        .select(`
          *,
          grants!inner(grant_name, org_id)
        `)
        .eq('grants.org_id', user.org_id)
        .eq('status', 'in_progress')
        .gte('due_date', new Date().toISOString())
        .lt('due_date', nextWeek.toISOString());

      const { data: upcomingReports } = await supabase
        .from('grant_reports')
        .select(`
          *,
          grants!inner(grant_name, org_id)
        `)
        .eq('grants.org_id', user.org_id)
        .eq('submitted', false)
        .gte('due_date', new Date().toISOString())
        .lt('due_date', nextWeek.toISOString());

      // Convert to ToDo items
      const todoItems: ToDoItem[] = [];

      // Add overdue compliance
      overdueCompliance?.forEach(item => {
        const daysPast = Math.floor((new Date().getTime() - new Date(item.due_date).getTime()) / (1000 * 3600 * 24));
        todoItems.push({
          id: `compliance-${item.id}`,
          type: 'Deadline',
          title: `Overdue: ${item.requirement}`,
          description: `${item.grants.grant_name} - ${daysPast} days overdue`,
          timeSince: `${daysPast} days ago`,
          grantId: item.grant_id,
          relatedId: item.id
        });
      });

      // Add overdue reports
      overdueReports?.forEach(item => {
        const daysPast = Math.floor((new Date().getTime() - new Date(item.due_date).getTime()) / (1000 * 3600 * 24));
        todoItems.push({
          id: `report-${item.id}`,
          type: 'Deadline',
          title: `Overdue: ${item.report_type} Report`,
          description: `${item.grants.grant_name} - ${daysPast} days overdue`,
          timeSince: `${daysPast} days ago`,
          grantId: item.grant_id,
          relatedId: item.id
        });
      });

      // Add upcoming deadlines
      upcomingDeadlines?.forEach(item => {
        const daysLeft = Math.ceil((new Date(item.due_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
        todoItems.push({
          id: `upcoming-compliance-${item.id}`,
          type: 'Reminder',
          title: `Due Soon: ${item.requirement}`,
          description: `${item.grants.grant_name} - Due in ${daysLeft} days`,
          timeSince: `${daysLeft} days left`,
          grantId: item.grant_id,
          relatedId: item.id
        });
      });

      // Add upcoming reports
      upcomingReports?.forEach(item => {
        const daysLeft = Math.ceil((new Date(item.due_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
        todoItems.push({
          id: `upcoming-report-${item.id}`,
          type: 'Reminder',
          title: `Due Soon: ${item.report_type} Report`,
          description: `${item.grants.grant_name} - Due in ${daysLeft} days`,
          timeSince: `${daysLeft} days left`,
          grantId: item.grant_id,
          relatedId: item.id
        });
      });

      // Sort by urgency (overdue first, then by days)
      todoItems.sort((a, b) => {
        if (a.type === 'Deadline' && b.type !== 'Deadline') return -1;
        if (a.type !== 'Deadline' && b.type === 'Deadline') return 1;
        return 0;
      });

      setTodos(todoItems);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [user?.org_id]);

  const markAsCompleted = async (todoId: string) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;

    try {
      if (todo.id.startsWith('compliance-')) {
        await supabase
          .from('grant_compliance')
          .update({ status: 'completed' })
          .eq('id', todo.relatedId);
      } else if (todo.id.startsWith('report-')) {
        await supabase
          .from('grant_reports')
          .update({ submitted: true, submitted_date: new Date().toISOString() })
          .eq('id', todo.relatedId);
      }
      
      // Remove from local state
      setTodos(prev => prev.filter(t => t.id !== todoId));
      
      toast({
        title: 'Success',
        description: 'Task marked as completed',
      });
    } catch (error) {
      console.error('Error marking as completed:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark task as completed',
        variant: 'destructive',
      });
    }
  };

  const deleteTodo = async (todoId: string) => {
    await markAsCompleted(todoId);
  };

  return {
    todos,
    loading,
    markAsCompleted,
    deleteTodo,
    refetch: fetchTodos,
  };
};