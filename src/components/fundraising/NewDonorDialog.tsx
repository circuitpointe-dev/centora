
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SideDialog, SideDialogContent, SideDialogHeader, SideDialogTitle, SideDialogTrigger } from "@/components/ui/side-dialog";
import { useToast } from "@/hooks/use-toast";
import { NewDonorForm } from "./NewDonorForm";

interface NewDonorDialogProps {
  triggerButton?: React.ReactNode;
}

const NewDonorDialog: React.FC<NewDonorDialogProps> = ({ triggerButton }) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (donorData: any) => {
    console.log("New donor data:", donorData);
    // Here you would typically send the data to your backend
    setOpen(false);
    toast({
      title: "New Donor Created",
      description: `${donorData.organization} has been successfully added to your donor list.`,
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <SideDialog open={open} onOpenChange={setOpen}>
      <SideDialogTrigger asChild>
        {triggerButton || (
          <Button size="sm" className="flex items-center gap-2 bg-violet-600 text-primary-foreground hover:bg-violet-700">
            <Plus className="h-4 w-4" />
            New Donor
          </Button>
        )}
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
