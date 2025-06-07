
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SideDialog, SideDialogContent, SideDialogHeader, SideDialogTitle, SideDialogTrigger } from "@/components/ui/side-dialog";

const NewDonorDialog: React.FC = () => {
  return (
    <SideDialog>
      <SideDialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Donor
        </Button>
      </SideDialogTrigger>
      <SideDialogContent>
        <SideDialogHeader>
          <SideDialogTitle>Add New Donor</SideDialogTitle>
        </SideDialogHeader>
        <div className="p-6">
          <p className="text-gray-600">New donor form will be implemented here.</p>
        </div>
      </SideDialogContent>
    </SideDialog>
  );
};

export default NewDonorDialog;
