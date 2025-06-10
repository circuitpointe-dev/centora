
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const LogframeTab: React.FC = () => {
  const logframeFields = [
    {
      id: "goal",
      label: "Goal",
      placeholder: "Enter the overall goal of the project...",
    },
    {
      id: "outcomes",
      label: "Outcomes",
      placeholder: "List the expected outcomes...",
    },
    {
      id: "outputs",
      label: "Outputs",
      placeholder: "Define the specific outputs...",
    },
    {
      id: "activities",
      label: "Activities",
      placeholder: "List the key activities...",
    },
    {
      id: "indicators",
      label: "Indicators",
      placeholder: "Define measurable indicators...",
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-3xl gap-8">
      {logframeFields.map((field) => (
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

export default LogframeTab;
