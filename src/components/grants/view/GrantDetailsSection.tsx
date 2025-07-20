
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
    { label: "Start Date", value: "Jan 15, 2024" },
    { label: "End Date", value: "Dec 31, 2024" },
    { label: "Amount", value: grant.amount },
    { label: "Grant Manager", value: "Sarah Johnson" },
    { label: "Fiduciary Officer", value: "Michael Chen" },
    { label: "Grant Administrator", value: "Emily Davis" },
  ];

  return (
    <Card className="w-full rounded-sm overflow-hidden h-fit flex flex-col shadow-lg border border-purple-200">
      <CardContent className="p-6 flex-1 flex flex-col">
        <h2 className="text-lg font-semibold text-black mb-6">
          Grant Details
        </h2>

        <div className="space-y-4">
          {grantDetails.map((detail, index) => (
            <div key={index} className="flex">
              <div className="w-[185px] text-sm font-semibold text-black">
                {detail.label}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">
                  {detail.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
