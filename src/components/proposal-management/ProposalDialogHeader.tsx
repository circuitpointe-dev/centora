
import React from "react";
import { Button } from "@/components/ui/button";
import { LargeSideDialogHeader, LargeSideDialogTitle } from "@/components/ui/large-side-dialog";
import { BarChart3, Save, Send } from "lucide-react";

type Props = {
  proposalTitle: string;
  opportunityName: string;
  onSave?: () => void;
  onSubmit?: () => void;
  isSaving?: boolean;
  isSubmitting?: boolean;
};

const ProposalDialogHeader: React.FC<Props> = ({ 
  proposalTitle, 
  opportunityName, 
  onSave,
  onSubmit,
  isSaving = false,
  isSubmitting = false
}) => {
  return (
    <LargeSideDialogHeader className="border-b border-gray-200 pb-4">
      <div className="flex items-center justify-between">
        <LargeSideDialogTitle className="text-lg font-semibold text-gray-900">
          {proposalTitle} - {opportunityName}
        </LargeSideDialogTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Submission Tracker
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={onSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button 
            size="sm" 
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </LargeSideDialogHeader>
  );
};

export default ProposalDialogHeader;
