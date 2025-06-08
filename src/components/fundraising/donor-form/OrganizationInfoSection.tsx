
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OrganizationData {
  organization: string;
  affiliation: string;
  organizationUrl: string;
}

interface OrganizationInfoSectionProps {
  formData: OrganizationData;
  onInputChange: (field: string, value: string) => void;
}

export const OrganizationInfoSection: React.FC<OrganizationInfoSectionProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Organization Information</h3>
      
      <div>
        <Label className="text-sm text-gray-600">Name of Organization *</Label>
        <Input
          value={formData.organization}
          onChange={(e) => onInputChange('organization', e.target.value)}
          placeholder="Enter organization name"
          className="mt-1"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-gray-600">Affiliation</Label>
          <Input
            value={formData.affiliation}
            onChange={(e) => onInputChange('affiliation', e.target.value)}
            placeholder="Enter affiliation"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label className="text-sm text-gray-600">Organization URL</Label>
          <Input
            type="url"
            value={formData.organizationUrl}
            onChange={(e) => onInputChange('organizationUrl', e.target.value)}
            placeholder="https://example.org"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};
