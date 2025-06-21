
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState } from "react";
import { getStatusColor } from "../utils/statusUtils";

interface GrantDetailsSectionProps {
  grant: {
    id: number;
    grantName: string;
    organization: string;
    status: string;
    compliance: number;
    amount: string;
    programArea: string;
    nextReportDue: string;
  };
}

export const GrantDetailsSection = ({ grant }: GrantDetailsSectionProps): JSX.Element => {
  const [currentStatus, setCurrentStatus] = useState(grant.status);
  
  const statusOptions = ["Active", "Pending", "Closed", "On Hold", "Completed"];

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus);
    console.log(`Status updated to: ${newStatus}`);
    // TODO: Implement actual status update logic
  };

  const grantDetails = [
    { label: "Grant Name", value: grant.grantName },
    { label: "Grantee", value: grant.organization },
    { label: "Status", value: currentStatus, isSelectable: true },
    { label: "Compliance", value: `${grant.compliance}% Compliant` },
    { label: "Program Area", value: grant.programArea },
    { label: "Reporting Set Up", value: grant.nextReportDue },
    { label: "Amount", value: grant.amount },
  ];

  return (
    <Card className="w-full rounded-sm overflow-hidden">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-black mb-6">
          Grant Details
        </h2>

        <div className="space-y-4">
          {grantDetails.map((detail, index) => (
            <div key={index} className="flex">
              <div className="w-[185px] text-sm text-gray-700">
                {detail.label}
              </div>
              <div className="flex items-center gap-1">
                {detail.isSelectable ? (
                  <Select value={currentStatus} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-auto h-auto p-0 border-none bg-transparent">
                      <SelectValue asChild>
                        <span className={`text-xs px-2 py-1 rounded-sm ${getStatusColor(currentStatus)}`}>
                          {currentStatus}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 rounded-sm">
                      {statusOptions.map((status) => (
                        <SelectItem 
                          key={status} 
                          value={status}
                          className="hover:bg-gray-50"
                        >
                          <span className={`text-xs px-2 py-1 rounded-sm ${getStatusColor(status)}`}>
                            {status}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-sm text-gray-900">
                    {detail.value}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
