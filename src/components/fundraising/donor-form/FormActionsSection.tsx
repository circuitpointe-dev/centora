
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsSectionProps {
  onCancel: () => void;
  submitText?: string;
}

export const FormActionsSection: React.FC<FormActionsSectionProps> = ({
  onCancel,
  submitText = "Create Donor",
}) => {
  return (
    <div className="flex justify-end gap-3 pt-6 border-t">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        {submitText}
      </Button>
    </div>
  );
};
