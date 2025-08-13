import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface DonorGivingRecord {
  id: string;
  donor_id: string;
  amount: number;
  currency: string;
  month: number;
  year: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useDonorGivingRecords = (donorId: string, year?: number) => {
  return useQuery({
    queryKey: ["donor-giving-records", donorId, year],
    queryFn: async () => {
      let query = supabase
        .from("donor_giving_records")
        .select("*")
        .eq("donor_id", donorId);

      if (year) {
        query = query.eq("year", year);
      }

      const { data, error } = await query.order("year", { ascending: false }).order("month", { ascending: true });

      if (error) throw error;
      return data as DonorGivingRecord[];
    },
    enabled: !!donorId,
  });
};

export const useCreateDonorGivingRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      donorId, 
      amount, 
      month, 
      year,
      currency = "USD"
    }: { 
      donorId: string; 
      amount: number; 
      month: number; 
      year: number;
      currency?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("donor_giving_records")
        .insert({
          donor_id: donorId,
          amount,
          month,
          year,
          currency,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["donor-giving-records", variables.donorId] });
      toast({
        title: "Giving Record Added",
        description: "Giving record has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add giving record. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateDonorGivingRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      id, 
      amount, 
      month, 
      year,
      currency = "USD"
    }: { 
      id: string; 
      amount: number; 
      month: number; 
      year: number;
      currency?: string;
    }) => {
      const { data, error } = await supabase
        .from("donor_giving_records")
        .update({
          amount,
          month,
          year,
          currency,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donor-giving-records"] });
      toast({
        title: "Giving Record Updated",
        description: "Giving record has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update giving record. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteDonorGivingRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (recordId: string) => {
      const { error } = await supabase
        .from("donor_giving_records")
        .delete()
        .eq("id", recordId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donor-giving-records"] });
      toast({
        title: "Giving Record Deleted",
        description: "Giving record has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete giving record. Please try again.",
        variant: "destructive",
      });
    },
  });
};