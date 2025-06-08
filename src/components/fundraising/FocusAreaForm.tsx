
import React, { useState } from "react";
import { FocusArea } from "@/types/donor";
import { useToast } from "@/hooks/use-toast";
import { BasicInfoSection } from "./focus-area-form/BasicInfoSection";
import { ColorSelectionSection } from "./focus-area-form/ColorSelectionSection";
import { FundingDatesSection } from "./donor-form/FundingDatesSection";
import { AmountCurrencySection } from "./focus-area-form/AmountCurrencySection";
import { InterestTagsSection } from "./focus-area-form/InterestTagsSection";
import { FormActionsSection } from "./donor-form/FormActionsSection";

interface FocusAreaFormProps {
  focusArea?: FocusArea;
  onSave: (focusArea: Omit<FocusArea, 'id'>) => void;
  onCancel: () => void;
}

export const FocusAreaForm: React.FC<FocusAreaFormProps> = ({
  focusArea,
  onSave,
  onCancel,
}) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: focusArea?.name || "",
    description: focusArea?.description || "",
    color: focusArea?.color || "bg-blue-100 text-blue-800",
    fundingStartDate: focusArea?.fundingStartDate || "",
    fundingEndDate: focusArea?.fundingEndDate || "",
    amount: focusArea?.amount || 0,
    currency: focusArea?.currency || "USD",
    interestTags: focusArea?.interestTags || [],
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      interestTags: [...prev.interestTags, tag]
    }));
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      interestTags: prev.interestTags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    
    toast({
      title: focusArea ? "Focus Area Updated" : "Focus Area Created",
      description: focusArea 
        ? `${formData.name} has been updated successfully.`
        : `${formData.name} has been created successfully.`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <BasicInfoSection
          formData={{ name: formData.name, description: formData.description }}
          onInputChange={handleInputChange}
        />

        <ColorSelectionSection
          selectedColor={formData.color}
          onColorChange={(color) => handleInputChange('color', color)}
        />

        <FundingDatesSection
          formData={{ fundingStartDate: formData.fundingStartDate, fundingEndDate: formData.fundingEndDate }}
          onInputChange={handleInputChange}
        />

        <AmountCurrencySection
          formData={{ amount: formData.amount, currency: formData.currency }}
          onInputChange={handleInputChange}
        />

        <InterestTagsSection
          interestTags={formData.interestTags}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />
      </div>

      <FormActionsSection 
        onCancel={onCancel} 
        submitText={focusArea ? 'Update Focus Area' : 'Create Focus Area'}
      />
    </form>
  );
};
