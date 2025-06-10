
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const NarrativeTab: React.FC = () => {
  const formFields = [
    {
      id: "problem-statement",
      label: "Problem Statement",
      placeholder: "Describe the problem this proposal addresses...",
    },
    {
      id: "proposed-solution",
      label: "Proposed Solution",
      placeholder: "Describe your proposed solution...",
    },
    {
      id: "methodology",
      label: "Methodology",
      placeholder: "Explain your approach and methodology...",
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
            className="h-32 resize-none text-sm"
          />
        </div>
      ))}
    </div>
  );
};

export default NarrativeTab;
