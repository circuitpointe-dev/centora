
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

interface ContentSectionProps {
  activeTab: string;
}

const ContentSection = ({ activeTab }: ContentSectionProps): JSX.Element => {
  // Define the form fields data for different tabs
  const getFieldsForTab = (tab: string) => {
    switch (tab) {
      case "overview":
        return [
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
      case "narrative":
        return [
          {
            id: "narrative",
            label: "Project Narrative",
            placeholder: "Enter project narrative...",
          },
          {
            id: "background",
            label: "Background",
            placeholder: "Enter project background...",
          },
        ];
      case "budget":
        return [
          {
            id: "budget-breakdown",
            label: "Budget Breakdown",
            placeholder: "Enter budget breakdown...",
          },
          {
            id: "justification",
            label: "Budget Justification",
            placeholder: "Enter budget justification...",
          },
        ];
      case "logframe":
        return [
          {
            id: "outcome",
            label: "Outcome",
            placeholder: "Enter expected outcome...",
          },
          {
            id: "indicators",
            label: "Indicators",
            placeholder: "Enter indicators...",
          },
          {
            id: "assumptions",
            label: "Assumptions",
            placeholder: "Enter assumptions...",
          },
        ];
      case "attachments":
        return [
          {
            id: "documents",
            label: "Supporting Documents",
            placeholder: "List supporting documents...",
          },
        ];
      case "team":
        return [
          {
            id: "team-members",
            label: "Team Members",
            placeholder: "Enter team member details...",
          },
          {
            id: "roles",
            label: "Roles & Responsibilities",
            placeholder: "Enter roles and responsibilities...",
          },
        ];
      default:
        return [];
    }
  };

  const formFields = getFieldsForTab(activeTab);

  return (
    <div className="flex flex-col w-full max-w-3xl gap-8">
      {formFields.map((field) => (
        <div key={field.id} className="flex flex-col gap-2 w-full">
          <Label
            htmlFor={field.id}
            className="font-medium text-sm text-[#383839]"
          >
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

export default ContentSection;
