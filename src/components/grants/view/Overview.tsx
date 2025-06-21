
import React from "react";
import FinalReportSection from "./FinalReportSection";
import { GrantDetailsSection } from "./GrantDetailsSection";

interface OverviewProps {
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

export default function Overview({ grant }: OverviewProps): JSX.Element {
  return (
    <div className="flex w-full items-start gap-[22px] p-4">
      <div className="flex-1">
        <GrantDetailsSection grant={grant} />
      </div>
      <div className="flex-1">
        <FinalReportSection />
      </div>
    </div>
  );
}
