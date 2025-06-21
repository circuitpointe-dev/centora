
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
    <div className="flex w-full items-stretch gap-[22px] px-12 py-4">
      <div className="flex-1 h-full">
        <GrantDetailsSection grant={grant} />
      </div>
      <div className="flex-1 h-full">
        <FinalReportSection />
      </div>
    </div>
  );
}
