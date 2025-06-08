
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsSectionProps {
  onCancel: () => void;
}

export const FormActionsSection: React.FC<FormActionsSectionProps> = ({
  onCancel,
}) => {
  return (
    <div className="flex justify-end gap-3 pt-6 border-t">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        Create Donor
      </Button>
    </div>
  );
};
