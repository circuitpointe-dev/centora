
import { Button } from "@/components/ui/button";
import { BarChart2, Save as SaveIcon } from "lucide-react";
import React from "react";

export default function FooterSection(): JSX.Element {
  // Data for the footer buttons
  const footerActions = [
    {
      id: "tracker",
      label: "Submission Tracker",
      icon: <BarChart2 className="w-4 h-4 mr-1" />,
      variant: "outline" as const,
    },
    {
      id: "save",
      label: "Save",
      icon: <SaveIcon className="w-4 h-4 mr-1" />,
      variant: "outline" as const,
    },
    {
      id: "submit",
      label: "Submit",
      variant: "default" as const,
      className: "bg-violet-600 hover:bg-violet-700",
    },
  ];

  return (
    <div className="flex justify-end items-center gap-3 w-full py-2">
      {footerActions.map((action) => (
        <Button
          key={action.id}
          variant={action.variant}
          className={`h-10 text-sm font-medium ${
            action.variant === "outline"
              ? "text-[#383839a6] border-[#d9d9d9]"
              : ""
          } ${action.className || ""}`}
        >
          {action.icon}
          {action.label}
        </Button>
      ))}
    </div>
  );
}
