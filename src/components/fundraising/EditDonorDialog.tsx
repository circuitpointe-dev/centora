
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { Donor } from "@/types/donor";
import { NewDonorForm } from "./NewDonorForm";
import { useToast } from "@/hooks/use-toast";

interface EditDonorDialogProps {
  donor: Donor;
  trigger?: React.ReactNode;
}

const EditDonorDialog: React.FC<EditDonorDialogProps> = ({ donor, trigger }) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleEditSubmit = (donorData: any) => {
    console.log("Edit donor data:", donorData);
    setOpen(false);
    toast({
      title: "Donor Updated",
      description: `${donorData.organization} has been successfully updated.`,
    });
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
      <Edit className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Donor</DialogTitle>
        </DialogHeader>
        <NewDonorForm 
          onSubmit={handleEditSubmit}
          initialData={donor}
          isEditing={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditDonorDialog;
