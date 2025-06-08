
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FundingDatesData {
  fundingStartDate: string;
  fundingEndDate: string;
}

interface FundingDatesSectionProps {
  formData: FundingDatesData;
  onInputChange: (field: string, value: string) => void;
}

export const FundingDatesSection: React.FC<FundingDatesSectionProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Funding Period</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-gray-600">Funding Start Date</Label>
          <Input
            type="date"
            value={formData.fundingStartDate}
            onChange={(e) => onInputChange('fundingStartDate', e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label className="text-sm text-gray-600">Funding End Date</Label>
          <Input
            type="date"
            value={formData.fundingEndDate}
            onChange={(e) => onInputChange('fundingEndDate', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};
