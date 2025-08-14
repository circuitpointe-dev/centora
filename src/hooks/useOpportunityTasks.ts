import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface OpportunityTask {
  id: string;
  opportunity_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  assigned_to: string | null;
  priority: "low" | "medium" | "high";
  completed: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
  };
}

export interface CreateTaskData {
  opportunityId: string;
  title: string;
  description?: string;
  dueDate?: string;
  assignedTo?: string;
  priority: "low" | "medium" | "high";
}

export const useOpportunityTasks = (opportunityId: string) => {
  return useQuery({
    queryKey: ["opportunity-tasks", opportunityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunity_tasks")
        .select("*")
        .eq("opportunity_id", opportunityId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as OpportunityTask[];
    },
    enabled: !!opportunityId,
  });
};

export const useCreateOpportunityTask = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData: CreateTaskData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("opportunity_tasks")
        .insert({
          opportunity_id: taskData.opportunityId,
          title: taskData.title,
          description: taskData.description,
          due_date: taskData.dueDate,
          assigned_to: taskData.assignedTo,
          priority: taskData.priority,
          created_by: user.id,
        })
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["opportunity-tasks", data.opportunity_id] });
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    },
    onError: (error) => {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateOpportunityTask = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: string; updates: Partial<OpportunityTask> }) => {
      const { data, error } = await supabase
        .from("opportunity_tasks")
        .update(updates)
        .eq("id", taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["opportunity-tasks", data.opportunity_id] });
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteOpportunityTask = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from("opportunity_tasks")
        .delete()
        .eq("id", taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunity-tasks"] });
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    },
  });
};