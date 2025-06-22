
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GranteeDetailsTabProps {
  data: {
    granteeName: string;
    granteeRefId: string;
    contactPerson: string;
    email: string;
    phoneNumber: string;
  };
  onUpdate: (data: any) => void;
}

export const GranteeDetailsTab: React.FC<GranteeDetailsTabProps> = ({ data, onUpdate }) => {
  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="granteeName" className="text-sm font-medium">
            Grantee Name *
          </Label>
          <Input
            id="granteeName"
            value={data.granteeName}
            onChange={(e) => handleInputChange('granteeName', e.target.value)}
            placeholder="Enter grantee name"
            className="rounded-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="granteeRefId" className="text-sm font-medium">
            Grantee Reference ID *
          </Label>
          <Input
            id="granteeRefId"
            value={data.granteeRefId}
            onChange={(e) => handleInputChange('granteeRefId', e.target.value)}
            placeholder="GR-0001"
            className="rounded-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPerson" className="text-sm font-medium">
            Contact Person *
          </Label>
          <Input
            id="contactPerson"
            value={data.contactPerson}
            onChange={(e) => handleInputChange('contactPerson', e.target.value)}
            placeholder="Enter contact person name"
            className="rounded-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter email address"
            className="rounded-sm"
          />
        </div>

        <div className="space-y-2 md:col-span-1">
          <Label htmlFor="phoneNumber" className="text-sm font-medium">
            Phone Number *
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={data.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            placeholder="Enter phone number"
            className="rounded-sm"
          />
        </div>
      </div>
    </div>
  );
};
