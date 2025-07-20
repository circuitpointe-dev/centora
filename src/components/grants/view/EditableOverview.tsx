import React from "react";
import { GrantStatsCards } from "./GrantStatsCards";
import { LifecycleTracker } from "./LifecycleTracker";
import { EditableGrantDetailsSection } from "./EditableGrantDetailsSection";
import { EditableContactsSection } from "./EditableContactsSection";

interface EditableOverviewProps {
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
  onUpdate: (section: string, field: string, value: string) => void;
}

export default function EditableOverview({ grant, onUpdate }: EditableOverviewProps): JSX.Element {
  const handleGrantDetailsUpdate = (field: string, value: string) => {
    onUpdate('grantDetails', field, value);
  };

  const handleContactsUpdate = (field: string, value: string) => {
    onUpdate('contacts', field, value);
  };

  return (
    <div className="space-y-6 px-12 py-4">
      {/* Stats Cards */}
      <GrantStatsCards grantId={grant.id} />
      
      {/* Lifecycle Tracker */}
      <LifecycleTracker currentStatus={grant.status} />
      
      {/* Grant Details and Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <EditableGrantDetailsSection grant={grant} onUpdate={handleGrantDetailsUpdate} />
        <EditableContactsSection onUpdate={handleContactsUpdate} />
      </div>
    </div>
  );
}