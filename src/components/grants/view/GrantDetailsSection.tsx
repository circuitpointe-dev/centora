
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import React from "react";
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
  const grantDetails = [
    { label: "Grant Name", value: grant.grantName },
    { label: "Grantee", value: grant.organization },
    { label: "Status", value: grant.status, hasChevron: true, isColored: true },
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
                {detail.label === "Status" ? (
                  <span className={`text-xs px-2 py-1 rounded-sm ${getStatusColor(detail.value)}`}>
                    {detail.value}
                  </span>
                ) : (
                  <span className="text-sm text-gray-900">
                    {detail.value}
                  </span>
                )}
                {detail.hasChevron && <ChevronDown className="w-3 h-3" />}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
