import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface OpportunityNote {
  id: string;
  opportunity_id: string;
  content: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
  };
}

export const useOpportunityNotes = (opportunityId: string) => {
  return useQuery({
    queryKey: ["opportunity-notes", opportunityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunity_notes")
        .select("*")
        .eq("opportunity_id", opportunityId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as OpportunityNote[];
    },
    enabled: !!opportunityId,
  });
};

export const useCreateOpportunityNote = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ opportunityId, content }: { opportunityId: string; content: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("opportunity_notes")
        .insert({
          opportunity_id: opportunityId,
          content,
          created_by: user.id,
        })
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["opportunity-notes", data.opportunity_id] });
      toast({
        title: "Success",
        description: "Note added successfully",
      });
    },
    onError: (error) => {
      console.error("Error creating note:", error);
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteOpportunityNote = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase
        .from("opportunity_notes")
        .delete()
        .eq("id", noteId);

      if (error) throw error;
    },
    onSuccess: (_, noteId) => {
      queryClient.invalidateQueries({ queryKey: ["opportunity-notes"] });
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    },
  });
};