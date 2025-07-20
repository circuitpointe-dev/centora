
import React from "react";
import FinalReportSection from "./FinalReportSection";
import { GrantDetailsSection } from "./GrantDetailsSection";
import { ContactsSection } from "./ContactsSection";
import { GrantStatsCards } from "./GrantStatsCards";
import { LifecycleTracker } from "./LifecycleTracker";

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
    <div className="space-y-6 px-12 py-4">
      {/* Stats Cards */}
      <GrantStatsCards grantId={grant.id} />
      
      {/* Lifecycle Tracker */}
      <LifecycleTracker currentStatus={grant.status} />
      
      {/* Grant Details and Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GrantDetailsSection grant={grant} />
        <ContactsSection />
      </div>
      
      {/* Reviewer's Report */}
      <div className="grid grid-cols-1">
        <FinalReportSection />
      </div>
    </div>
  );
}
