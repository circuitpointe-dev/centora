
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const OverviewTab: React.FC = () => {
  const formFields = [
    {
      id: "summary",
      label: "Summary",
      placeholder: "Enter project summary...",
    },
    {
      id: "objectives",
      label: "Objectives",
      placeholder: "Enter project objectives...",
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-3xl gap-8">
      {formFields.map((field) => (
        <div key={field.id} className="flex flex-col gap-2 w-full">
          <Label htmlFor={field.id} className="font-medium text-sm text-[#383839]">
            {field.label}
          </Label>
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            className="h-28 resize-none text-sm"
          />
        </div>
      ))}
    </div>
  );
};

export default OverviewTab;
