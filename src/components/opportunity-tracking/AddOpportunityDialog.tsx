
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  SideDialog,
  SideDialogContent,
  SideDialogHeader,
  SideDialogTitle,
} from "@/components/ui/side-dialog";
import { useCreateOpportunity, CreateOpportunityData } from "@/hooks/useOpportunities";
import { useNavigate } from "react-router-dom";
import OpportunityForm from "./OpportunityForm";

interface AddOpportunityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  donors: Array<{ id: string; name: string }>;
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
  donors,
}) => {
  const navigate = useNavigate();
  const createOpportunityMutation = useCreateOpportunity();
  
  const form = useForm<CreateOpportunityData>({
    defaultValues: {
      title: "",
      donor_id: "",
      contact_email: "",
      contact_phone: "",
      amount: undefined,
      currency: "USD",
      type: "RFP",
      deadline: "",
      assigned_to: "",
      sector: "",
    },
  });

  const handleSubmit = async (data: CreateOpportunityData) => {
    if (!data.title || !data.donor_id || !data.type || !data.deadline) {
      return;
    }

    try {
      await createOpportunityMutation.mutateAsync(data);
      onClose();
      form.reset();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleCreateDonor = () => {
    onClose();
    navigate('/dashboard/fundraising/donors');
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
            onCreateDonor={handleCreateDonor}
          />
          
          <div className="flex justify-end gap-2 pt-6">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-black text-white hover:bg-gray-900"
              disabled={createOpportunityMutation.isPending}
            >
              {createOpportunityMutation.isPending ? "Adding..." : "Add Opportunity"}
            </Button>
          </div>
        </form>
      </SideDialogContent>
    </SideDialog>
  );
};

export default AddOpportunityDialog;
