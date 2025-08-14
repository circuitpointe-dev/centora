import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface OpportunityAttachment {
  id: string;
  opportunity_id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  uploaded_by: string;
  uploaded_at: string;
  profiles?: {
    full_name: string | null;
  };
}

export const useOpportunityAttachments = (opportunityId: string) => {
  return useQuery({
    queryKey: ["opportunity-attachments", opportunityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunity_attachments")
        .select("*")
        .eq("opportunity_id", opportunityId)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      return data as OpportunityAttachment[];
    },
    enabled: !!opportunityId,
  });
};

export const useUploadOpportunityAttachment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      opportunityId, 
      file, 
      description 
    }: { 
      opportunityId: string; 
      file: File; 
      description?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${opportunityId}/${Date.now()}.${fileExt}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("opportunity-attachments")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create database record
      const { data, error } = await supabase
        .from("opportunity_attachments")
        .insert({
          opportunity_id: opportunityId,
          file_name: file.name,
          file_path: uploadData.path,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: user.id,
        })
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["opportunity-attachments", data.opportunity_id] });
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    },
    onError: (error) => {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteOpportunityAttachment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attachment: OpportunityAttachment) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("opportunity-attachments")
        .remove([attachment.file_path]);

      if (storageError) throw storageError;

      // Delete database record
      const { error } = await supabase
        .from("opportunity_attachments")
        .delete()
        .eq("id", attachment.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunity-attachments"] });
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting file:", error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    },
  });
};

export const useDownloadOpportunityAttachment = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (attachment: OpportunityAttachment) => {
      const { data, error } = await supabase.storage
        .from("opportunity-attachments")
        .download(attachment.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return data;
    },
    onError: (error) => {
      console.error("Error downloading file:", error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    },
  });
};