
import React, { useState } from "react";
import { X, Upload, File as FileIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUploadOpportunityAttachment } from "@/hooks/useOpportunityAttachments";

interface AddFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityId: string;
}

const AddFileDialog: React.FC<AddFileDialogProps> = ({
  isOpen,
  onClose,
  opportunityId
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDescription, setFileDescription] = useState("");
  const { toast } = useToast();
  const uploadMutation = useUploadOpportunityAttachment();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await uploadMutation.mutateAsync({
        opportunityId,
        file: selectedFile,
        description: fileDescription,
      });
      
      setSelectedFile(null);
      setFileDescription("");
      onClose();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="file">File</Label>
            <Input id="file" type="file" onChange={handleFileChange} />
          </div>
          
          {selectedFile && (
            <div className="bg-gray-50 p-3 rounded-md flex items-center gap-2">
              <FileIcon className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          )}
          
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="description">Description (optional)</Label>
            <Input 
              id="description" 
              value={fileDescription}
              onChange={(e) => setFileDescription(e.target.value)}
              placeholder="Enter a description for this file"
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploadMutation.isPending}>
              <Upload className="h-4 w-4 mr-2" />
              {uploadMutation.isPending ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFileDialog;
