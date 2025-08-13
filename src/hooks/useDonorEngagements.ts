import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface DonorEngagement {
  id: string;
  donor_id: string;
  description: string;
  engagement_date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useDonorEngagements = (donorId: string) => {
  return useQuery({
    queryKey: ["donor-engagements", donorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donor_engagements")
        .select("*")
        .eq("donor_id", donorId)
        .order("engagement_date", { ascending: false });

      if (error) throw error;
      return data as DonorEngagement[];
    },
    enabled: !!donorId,
  });
};

export const useCreateDonorEngagement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      donorId, 
      description, 
      engagementDate 
    }: { 
      donorId: string; 
      description: string; 
      engagementDate?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("donor_engagements")
        .insert({
          donor_id: donorId,
          description,
          engagement_date: engagementDate || new Date().toISOString().split('T')[0],
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["donor-engagements", variables.donorId] });
      toast({
        title: "Engagement Added",
        description: "Engagement entry has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add engagement entry. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateDonorEngagement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      id, 
      description,
      engagementDate 
    }: { 
      id: string; 
      description: string;
      engagementDate?: string;
    }) => {
      const { data, error } = await supabase
        .from("donor_engagements")
        .update({
          description,
          engagement_date: engagementDate,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donor-engagements"] });
      toast({
        title: "Engagement Updated",
        description: "Engagement entry has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update engagement entry. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteDonorEngagement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (engagementId: string) => {
      const { error } = await supabase
        .from("donor_engagements")
        .delete()
        .eq("id", engagementId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donor-engagements"] });
      toast({
        title: "Engagement Deleted",
        description: "Engagement entry has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete engagement entry. Please try again.",
        variant: "destructive",
      });
    },
  });
};