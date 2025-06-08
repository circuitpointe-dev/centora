
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SideDialog, SideDialogContent, SideDialogHeader, SideDialogTitle, SideDialogTrigger } from "@/components/ui/side-dialog";
import { NewDonorForm } from "./NewDonorForm";

const NewDonorDialog: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (donorData: any) => {
    console.log("New donor data:", donorData);
    // Here you would typically send the data to your backend
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <SideDialog open={open} onOpenChange={setOpen}>
      <SideDialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          New Donor
        </Button>
      </SideDialogTrigger>
      <SideDialogContent className="w-full sm:w-[600px]">
        <SideDialogHeader>
          <SideDialogTitle>Add New Donor</SideDialogTitle>
        </SideDialogHeader>
        <NewDonorForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </SideDialogContent>
    </SideDialog>
  );
};

export default NewDonorDialog;
