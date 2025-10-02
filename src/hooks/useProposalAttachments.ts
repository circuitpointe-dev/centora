import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ProposalAttachment {
  id: string;
  proposal_id: string;
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

export const useProposalAttachments = (proposalId: string | null) => {
  return useQuery({
    queryKey: ["proposal-attachments", proposalId],
    queryFn: async () => {
      if (!proposalId) return [];
      
      const { data, error } = await supabase
        .from("proposal_attachments")
        .select(`
          *,
          profiles:uploaded_by (
            full_name
          )
        `)
        .eq("proposal_id", proposalId)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      return data as ProposalAttachment[];
    },
    enabled: !!proposalId,
  });
};

export const useUploadProposalAttachment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      proposalId, 
      file, 
      description 
    }: { 
      proposalId: string; 
      file: File; 
      description?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error("File size must be less than 10MB");
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${proposalId}/${Date.now()}.${fileExt}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("proposal-attachments")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create database record
      const { data, error } = await supabase
        .from("proposal_attachments")
        .insert({
          proposal_id: proposalId,
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
      queryClient.invalidateQueries({ queryKey: ["proposal-attachments", data.proposal_id] });
      toast({
        title: "File Uploaded",
        description: "Your file has been uploaded successfully.",
      });
    },
    onError: (error) => {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProposalAttachment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attachment: ProposalAttachment) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("proposal-attachments")
        .remove([attachment.file_path]);

      if (storageError) throw storageError;

      // Delete database record
      const { error } = await supabase
        .from("proposal_attachments")
        .delete()
        .eq("id", attachment.id);

      if (error) throw error;
      return attachment.proposal_id;
    },
    onSuccess: (proposalId) => {
      queryClient.invalidateQueries({ queryKey: ["proposal-attachments", proposalId] });
      toast({
        title: "File Deleted",
        description: "The file has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error("Error deleting file:", error);
      toast({
        title: "Error",
        description: "Failed to delete file. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDownloadProposalAttachment = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (attachment: ProposalAttachment) => {
      const { data, error } = await supabase.storage
        .from("proposal-attachments")
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
    onSuccess: () => {
      toast({
        title: "Download Started",
        description: "File download has started.",
      });
    },
    onError: (error) => {
      console.error("Error downloading file:", error);
      toast({
        title: "Download Error",
        description: "Failed to download file. Please try again.",
        variant: "destructive",
      });
    },
  });
};
