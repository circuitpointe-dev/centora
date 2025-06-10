
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const BudgetTab: React.FC = () => {
  const budgetFields = [
    {
      id: "total-budget",
      label: "Total Budget",
      type: "number",
      placeholder: "0.00",
    },
    {
      id: "personnel-costs",
      label: "Personnel Costs",
      type: "number",
      placeholder: "0.00",
    },
    {
      id: "equipment-costs",
      label: "Equipment Costs",
      type: "number",
      placeholder: "0.00",
    },
    {
      id: "operational-costs",
      label: "Operational Costs",
      type: "number",
      placeholder: "0.00",
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-3xl gap-8">
      {budgetFields.map((field) => (
        <div key={field.id} className="flex flex-col gap-2 w-full">
          <Label htmlFor={field.id} className="font-medium text-sm text-[#383839]">
            {field.label}
          </Label>
          <Input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            className="text-sm"
          />
        </div>
      ))}
      
      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="budget-justification" className="font-medium text-sm text-[#383839]">
          Budget Justification
        </Label>
        <Textarea
          id="budget-justification"
          placeholder="Provide justification for budget items..."
          className="h-32 resize-none text-sm"
        />
      </div>
    </div>
  );
};

export default BudgetTab;
