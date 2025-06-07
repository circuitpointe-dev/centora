
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { SideDialog, SideDialogContent, SideDialogHeader, SideDialogTitle, SideDialogTrigger } from "@/components/ui/side-dialog";
import { Donor } from "@/types/donor";

interface EditDonorDialogProps {
  donor: Donor;
}

const EditDonorDialog: React.FC<EditDonorDialogProps> = ({ donor }) => {
  return (
    <SideDialog>
      <SideDialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </SideDialogTrigger>
      <SideDialogContent>
        <SideDialogHeader>
          <SideDialogTitle>Edit Donor</SideDialogTitle>
        </SideDialogHeader>
        <div className="p-6">
          <p className="text-gray-600">Edit donor form for {donor.name} will be implemented here.</p>
        </div>
      </SideDialogContent>
    </SideDialog>
  );
};

export default EditDonorDialog;
