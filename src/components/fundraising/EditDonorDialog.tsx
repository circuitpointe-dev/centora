
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { type Donor } from "@/hooks/useDonors";
import { NewDonorForm } from "./NewDonorForm";
import { useToast } from "@/hooks/use-toast";

interface EditDonorDialogProps {
  donor: Donor;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const EditDonorDialog: React.FC<EditDonorDialogProps> = ({ 
  donor, 
  trigger, 
  open: externalOpen, 
  onOpenChange: externalOnOpenChange 
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const { toast } = useToast();

  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

  const handleEditSubmit = () => {
    // Form submission is now handled internally by NewDonorForm
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
      <Edit className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-black">Edit Donor</DialogTitle>
        </DialogHeader>
        <NewDonorForm 
          onSubmit={handleEditSubmit}
          onCancel={handleCancel}
          initialData={donor}
          isEditing={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditDonorDialog;
