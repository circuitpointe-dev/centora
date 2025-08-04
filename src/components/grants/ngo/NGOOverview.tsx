import React from "react";
import { GrantStatsCards } from "./NGOGrantStatsCards";
import { LifecycleTracker } from "../view/LifecycleTracker";
import { NGOGrantDetailsSection } from "./NGOGrantDetailsSection";
import { NGOContactsSection } from "./NGOContactsSection";

interface NGOOverviewProps {
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

export function NGOOverview({ grant }: NGOOverviewProps): JSX.Element {
  return (
    <div className="space-y-6 px-12 py-4">
      {/* Stats Cards */}
      <GrantStatsCards grantId={grant.id} />
      
      {/* Lifecycle Tracker */}
      <LifecycleTracker currentStatus={grant.status} />
      
      {/* Grant Details and Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <NGOGrantDetailsSection grant={grant} />
        <NGOContactsSection />
      </div>
    </div>
  );
}