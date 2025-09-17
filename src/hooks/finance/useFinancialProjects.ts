import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface FinancialProject {
  id: string;
  project_name: string;
  project_code: string;
  description?: string;
  budget_allocated: number;
  budget_spent: number;
  start_date: string;
  end_date?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  manager_name?: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export const useFinancialProjects = () => {
  return useQuery({
    queryKey: ['financial-projects'],
    queryFn: async (): Promise<FinancialProject[]> => {
      const { data, error } = await supabase
        .from('financial_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching financial projects:', error);
        throw error;
      }

      return (data || []).map(project => ({
        ...project,
        status: project.status as FinancialProject['status'],
      }));
    },
  });
};

export const useCreateFinancialProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectData: Omit<FinancialProject, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: orgData } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      const { data, error } = await supabase
        .from('financial_projects')
        .insert([
          {
            ...projectData,
            org_id: orgData?.org_id,
            created_by: (await supabase.auth.getUser()).data.user?.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-projects'] });
      queryClient.invalidateQueries({ queryKey: ['finance-stats'] });
      toast({
        title: 'Success',
        description: 'Financial project created successfully',
      });
    },
    onError: (error) => {
      console.error('Error creating financial project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create financial project',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateFinancialProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FinancialProject> }) => {
      const { data, error } = await supabase
        .from('financial_projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-projects'] });
      queryClient.invalidateQueries({ queryKey: ['finance-stats'] });
      toast({
        title: 'Success',
        description: 'Financial project updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error updating financial project:', error);
      toast({
        title: 'Error',
        description: 'Failed to update financial project',
        variant: 'destructive',
      });
    },
  });
};