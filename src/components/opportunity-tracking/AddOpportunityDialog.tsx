
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  SideDialog,
  SideDialogContent,
  SideDialogHeader,
  SideDialogTitle,
} from "@/components/ui/side-dialog";
import { Opportunity } from "@/types/opportunity";
import { useToast } from "@/hooks/use-toast";
import OpportunityForm from "./OpportunityForm";

interface AddOpportunityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOpportunity: (opportunity: Opportunity) => void;
  donors: Array<{ id: string; name: string }>;
}

interface OpportunityFormData {
  title: string;
  donorId: string;
  amount: string;
  currency: string;
  type: "RFP" | "LOI" | "CFP";
  deadline: Date | undefined;
  assignedTo: string;
  sector: string;
}

const TYPE_OPTIONS = [
  { value: "RFP", label: "RFP - Request for Proposal" },
  { value: "LOI", label: "LOI - Letter of Interest" },
  { value: "CFP", label: "CFP - Call for Proposal" },
];

const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "NGN", label: "NGN" },
  { value: "CAD", label: "CAD" },
  { value: "AUD", label: "AUD" },
  { value: "JPY", label: "JPY" },
  { value: "CHF", label: "CHF" },
];

const AddOpportunityDialog: React.FC<AddOpportunityDialogProps> = ({
  isOpen,
  onClose,
  onAddOpportunity,
  donors,
}) => {
  const { toast } = useToast();
  
  const form = useForm<OpportunityFormData>({
    defaultValues: {
      title: "",
      donorId: "",
      amount: "",
      currency: "USD",
      type: "RFP",
      deadline: undefined,
      assignedTo: "",
      sector: "",
    },
  });

  const handleSubmit = (data: OpportunityFormData) => {
    if (!data.title || !data.donorId || !data.type || !data.deadline) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newOpportunity: Opportunity = {
      id: `opp-${Date.now()}`,
      title: data.title,
      donorId: data.donorId,
      donorName: donors.find((d) => d.id === data.donorId)?.name || "",
      amount: parseFloat(data.amount) || 0,
      type: data.type,
      deadline: data.deadline.toISOString(),
      status: "To Review",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: data.assignedTo,
      sector: data.sector,
    };

    onAddOpportunity(newOpportunity);
    onClose();
    form.reset();
  };

  return (
    <SideDialog open={isOpen} onOpenChange={onClose}>
      <SideDialogContent className="w-full sm:w-[600px] bg-white">
        <SideDialogHeader>
          <SideDialogTitle className="text-xl font-bold text-black">
            Add New Opportunity
          </SideDialogTitle>
        </SideDialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex-1 overflow-y-auto p-6">
          <OpportunityForm
            form={form}
            donors={donors}
            typeOptions={TYPE_OPTIONS}
            currencyOptions={CURRENCY_OPTIONS}
          />
          
          <div className="flex justify-end gap-2 pt-6">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-black text-white hover:bg-gray-900"
            >
              Add Opportunity
            </Button>
          </div>
        </form>
      </SideDialogContent>
    </SideDialog>
  );
};

export default AddOpportunityDialog;
