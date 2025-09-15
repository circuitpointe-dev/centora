import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

interface EditableGrantDetailsSectionProps {
  grant: {
    id: string;
    grant_name: string;
    donor_name: string;
    status: string;
    amount: number;
    program_area?: string;
    next_report_due?: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export const EditableGrantDetailsSection = ({ grant, onUpdate }: EditableGrantDetailsSectionProps): JSX.Element => {
  // Sample staff data - in real app this would come from API
  const staffMembers = [
    "Sarah Johnson",
    "Michael Chen", 
    "Emily Davis",
    "John Smith",
    "Lisa Anderson"
  ];

  const [grantDetails, setGrantDetails] = useState({
    grantName: grant.grant_name,
    startDate: "2024-01-15",
    endDate: "2024-12-31", 
    amount: `$${grant.amount.toLocaleString()}`,
    grantManager: "Sarah Johnson",
    fiduciaryOfficer: "Michael Chen",
    grantAdministrator: "Emily Davis"
  });

  const handleChange = (field: string, value: string) => {
    setGrantDetails(prev => ({ ...prev, [field]: value }));
    onUpdate(field, value);
  };

  return (
    <Card className="w-full rounded-sm overflow-hidden h-full flex flex-col shadow-lg border border-purple-200">
      <CardContent className="p-6 flex-1 flex flex-col">
        <h2 className="text-lg font-semibold text-black mb-6">
          Grant Details
        </h2>

        <div className="space-y-4">
          <div className="flex">
            <div className="w-[185px] text-sm font-semibold text-black">
              Grant Name
            </div>
            <div className="flex-1">
              <Input
                value={grantDetails.grantName}
                onChange={(e) => handleChange('grantName', e.target.value)}
                className="border-gray-200 rounded-sm h-8"
              />
            </div>
          </div>

          <div className="flex">
            <div className="w-[185px] text-sm font-semibold text-black">
              Start Date
            </div>
            <div className="flex-1">
              <Input
                type="date"
                value={grantDetails.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="border-gray-200 rounded-sm h-8"
              />
            </div>
          </div>

          <div className="flex">
            <div className="w-[185px] text-sm font-semibold text-black">
              End Date
            </div>
            <div className="flex-1">
              <Input
                type="date"
                value={grantDetails.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="border-gray-200 rounded-sm h-8"
              />
            </div>
          </div>

          <div className="flex">
            <div className="w-[185px] text-sm font-semibold text-black">
              Amount
            </div>
            <div className="flex-1">
              <Input
                value={grantDetails.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                className="border-gray-200 rounded-sm h-8"
              />
            </div>
          </div>

          <div className="flex">
            <div className="w-[185px] text-sm font-semibold text-black">
              Grant Manager
            </div>
            <div className="flex-1">
              <Select value={grantDetails.grantManager} onValueChange={(value) => handleChange('grantManager', value)}>
                <SelectTrigger className="border-gray-200 rounded-sm h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 z-50">
                  {staffMembers.map((staff) => (
                    <SelectItem key={staff} value={staff}>
                      {staff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex">
            <div className="w-[185px] text-sm font-semibold text-black">
              Fiduciary Officer
            </div>
            <div className="flex-1">
              <Select value={grantDetails.fiduciaryOfficer} onValueChange={(value) => handleChange('fiduciaryOfficer', value)}>
                <SelectTrigger className="border-gray-200 rounded-sm h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 z-50">
                  {staffMembers.map((staff) => (
                    <SelectItem key={staff} value={staff}>
                      {staff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex">
            <div className="w-[185px] text-sm font-semibold text-black">
              Grant Administrator
            </div>
            <div className="flex-1">
              <Select value={grantDetails.grantAdministrator} onValueChange={(value) => handleChange('grantAdministrator', value)}>
                <SelectTrigger className="border-gray-200 rounded-sm h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 z-50">
                  {staffMembers.map((staff) => (
                    <SelectItem key={staff} value={staff}>
                      {staff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};