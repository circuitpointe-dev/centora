
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus } from "lucide-react";
import { SideDialog, SideDialogContent, SideDialogHeader, SideDialogTitle, SideDialogTrigger } from "@/components/ui/side-dialog";
import { useToast } from "@/hooks/use-toast";
import { NewDonorForm } from "@/components/fundraising/NewDonorForm";
import { FocusAreaForm } from "@/components/fundraising/FocusAreaForm";

const QuickActions: React.FC = () => {
  const [newDonorOpen, setNewDonorOpen] = useState(false);
  const [focusAreaOpen, setFocusAreaOpen] = useState(false);
  const { toast } = useToast();

  const handleNewDonorSubmit = (donorData: any) => {
    console.log("New donor data:", donorData);
    setNewDonorOpen(false);
    toast({
      title: "New Donor Created",
      description: `${donorData.organization} has been successfully added to your donor list.`,
    });
  };

  const handleFocusAreaSave = () => {
    setFocusAreaOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* New Donor Quick Action */}
      <SideDialog open={newDonorOpen} onOpenChange={setNewDonorOpen}>
        <SideDialogTrigger asChild>
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            New Donor
          </Button>
        </SideDialogTrigger>
        <SideDialogContent className="w-full sm:w-[600px]">
          <SideDialogHeader>
            <SideDialogTitle>Add New Donor</SideDialogTitle>
          </SideDialogHeader>
          <NewDonorForm 
            onSubmit={handleNewDonorSubmit} 
            onCancel={() => setNewDonorOpen(false)} 
          />
        </SideDialogContent>
      </SideDialog>

      {/* Create Focus Area Quick Action */}
      <SideDialog open={focusAreaOpen} onOpenChange={setFocusAreaOpen}>
        <SideDialogTrigger asChild>
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Focus Area
          </Button>
        </SideDialogTrigger>
        <SideDialogContent className="overflow-hidden">
          <SideDialogHeader>
            <SideDialogTitle>Create Focus Area</SideDialogTitle>
          </SideDialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <FocusAreaForm
              onSave={handleFocusAreaSave}
              onCancel={() => setFocusAreaOpen(false)}
            />
          </div>
        </SideDialogContent>
      </SideDialog>
    </div>
  );
};

export default QuickActions;
