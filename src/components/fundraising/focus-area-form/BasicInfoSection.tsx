
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BasicInfoData {
  name: string;
  description: string;
}

interface BasicInfoSectionProps {
  formData: BasicInfoData;
  onInputChange: (field: string, value: string) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Focus Area Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          placeholder="Enter focus area name"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="Enter description"
          rows={3}
        />
      </div>
    </div>
  );
};
