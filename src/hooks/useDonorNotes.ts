import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface DonorNote {
  id: string;
  donor_id: string;
  content: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name?: string;
    email?: string;
  };
}

export const useDonorNotes = (donorId: string) => {
  return useQuery({
    queryKey: ["donor-notes", donorId],
    queryFn: async () => {
      // First, fetch all donor notes (excluding initial notes created from donor.notes field)
      const { data: notesData, error: notesError } = await supabase
        .from("donor_notes")
        .select("*")
        .eq("donor_id", donorId)
        .order("created_at", { ascending: true }); // Order by creation time to show initial note first

      if (notesError) throw notesError;
      if (!notesData || notesData.length === 0) return [];

      // Get unique created_by IDs
      const userIds = [...new Set(notesData.map(note => note.created_by))];

      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Create a map of profiles for quick lookup
      const profilesMap = new Map(
        (profilesData || []).map(profile => [profile.id, profile])
      );

      // Combine notes with profile data
      const notesWithProfiles = notesData.map(note => ({
        ...note,
        profiles: profilesMap.get(note.created_by) || null
      }));

      return notesWithProfiles as DonorNote[];
    },
    enabled: !!donorId,
  });
};

export const useCreateDonorNote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ donorId, content }: { donorId: string; content: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("donor_notes")
        .insert({
          donor_id: donorId,
          content,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["donor-notes", variables.donorId] });
      toast({
        title: "Note Added",
        description: "Your note has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteDonorNote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase
        .from("donor_notes")
        .delete()
        .eq("id", noteId);

      if (error) throw error;
    },
    onSuccess: (_, noteId) => {
      queryClient.invalidateQueries({ queryKey: ["donor-notes"] });
      toast({
        title: "Note Deleted",
        description: "The note has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    },
  });
};