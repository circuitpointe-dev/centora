import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

interface EditableContactsSectionProps {
  onUpdate: (field: string, value: string) => void;
}

export const EditableContactsSection = ({ onUpdate }: EditableContactsSectionProps): JSX.Element => {
  const [granteeDetails, setGranteeDetails] = useState({
    granteeName: "Education for All Foundation",
    granteeRefId: "EDU-2024-001",
    contactPerson: "Dr. Maria Rodriguez",
    email: "maria.rodriguez@educationforall.org",
    phoneNumber: "+1 (555) 123-4567"
  });

  const handleChange = (field: string, value: string) => {
    setGranteeDetails(prev => ({ ...prev, [field]: value }));
    onUpdate(field, value);
  };

  return (
    <Card className="w-full rounded-sm overflow-hidden h-full flex flex-col shadow-lg border border-purple-200">
      <CardContent className="p-6 flex-1 flex flex-col">
        <h2 className="text-lg font-semibold text-black mb-6">
          Grantee Details
        </h2>

        <div className="space-y-4">
          <div className="flex">
            <div className="w-[185px] text-sm font-semibold text-black">
              Grantee Name
            </div>
            <div className="flex-1">
              <Input
                value={granteeDetails.granteeName}
                onChange={(e) => handleChange('granteeName', e.target.value)}
                className="border-gray-200 rounded-sm h-8"
              />
            </div>
          </div>

          <div className="flex">
            <div className="w-[185px] text-sm font-semibold text-black">
              Grantee Ref ID
            </div>
            <div className="flex-1">
              <Input
                value={granteeDetails.granteeRefId}
                onChange={(e) => handleChange('granteeRefId', e.target.value)}
                className="border-gray-200 rounded-sm h-8"
              />
            </div>
          </div>

          <div className="flex">
            <div className="w-[185px] text-sm font-semibold text-black">
              Contact Person
            </div>
            <div className="flex-1">
              <Input
                value={granteeDetails.contactPerson}
                onChange={(e) => handleChange('contactPerson', e.target.value)}
                className="border-gray-200 rounded-sm h-8"
              />
            </div>
          </div>

          <div className="flex">
            <div className="w-[185px] text-sm font-semibold text-black">
              Email
            </div>
            <div className="flex-1">
              <Input
                type="email"
                value={granteeDetails.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="border-gray-200 rounded-sm h-8"
              />
            </div>
          </div>

          <div className="flex">
            <div className="w-[185px] text-sm font-semibold text-black">
              Phone Number
            </div>
            <div className="flex-1">
              <Input
                value={granteeDetails.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                className="border-gray-200 rounded-sm h-8"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};