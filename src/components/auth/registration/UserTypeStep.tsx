
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { RegistrationData } from '../RegistrationForm';

interface UserTypeStepProps {
  formData: RegistrationData;
  updateFormData: (data: Partial<RegistrationData>) => void;
}

const UserTypeStep = ({ formData, updateFormData }: UserTypeStepProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium text-gray-700">Organization Type</Label>
        <p className="text-xs text-gray-500 mt-1">
          Select the type that best describes your organization
        </p>
      </div>

      <RadioGroup
        value={formData.userType}
        onValueChange={(value) => updateFormData({ userType: value as 'NGO' | 'Donor' })}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
          <RadioGroupItem value="NGO" id="ngo" />
          <div className="flex-1">
            <Label htmlFor="ngo" className="text-sm font-medium cursor-pointer">
              NGO / Non-Profit Organization
            </Label>
            <p className="text-xs text-gray-500">
              Organizations seeking grants and funding
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
          <RadioGroupItem value="Donor" id="donor" />
          <div className="flex-1">
            <Label htmlFor="donor" className="text-sm font-medium cursor-pointer">
              Foundation / Donor Organization
            </Label>
            <p className="text-xs text-gray-500">
              Organizations providing grants and funding
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default UserTypeStep;
