import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface DonorDocument {
  id: string;
  donor_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  uploaded_at: string;
}

export const useDonorDocuments = (donorId: string) => {
  return useQuery({
    queryKey: ["donor-documents", donorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donor_documents")
        .select("*")
        .eq("donor_id", donorId)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      return data as DonorDocument[];
    },
    enabled: !!donorId,
  });
};

export const useUploadDonorDocument = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      donorId, 
      file, 
      orgId 
    }: { 
      donorId: string; 
      file: File; 
      orgId: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error("File size must be less than 10MB");
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error("File type not supported. Please upload PDF, DOC, DOCX, JPG, PNG, GIF, or TXT files.");
      }

      // Create file path: orgId/donorId/filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${orgId}/${donorId}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("donor-documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save document metadata to database
      const { data, error } = await supabase
        .from("donor_documents")
        .insert({
          donor_id: donorId,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["donor-documents", variables.donorId] });
      toast({
        title: "File Uploaded",
        description: "Your file has been uploaded successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteDonorDocument = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ documentId, filePath }: { documentId: string; filePath: string }) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("donor-documents")
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error } = await supabase
        .from("donor_documents")
        .delete()
        .eq("id", documentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donor-documents"] });
      toast({
        title: "File Deleted",
        description: "The file has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete file. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDownloadDonorDocument = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ filePath, fileName }: { filePath: string; fileName: string }) => {
      const { data, error } = await supabase.storage
        .from("donor-documents")
        .download(filePath);

      if (error) throw error;

      // Create download link
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({
        title: "Download Started",
        description: "File download has started.",
      });
    },
    onError: (error) => {
      toast({
        title: "Download Error",
        description: "Failed to download file. Please try again.",
        variant: "destructive",
      });
    },
  });
};