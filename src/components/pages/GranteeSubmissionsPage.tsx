
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GranteeSubmissionsTabNavigation } from '@/components/grantee-submissions/GranteeSubmissionsTabNavigation';
import { SubmissionStatsCards } from '@/components/grantee-submissions/SubmissionStatsCards';
import { SubmissionsTable } from '@/components/grantee-submissions/SubmissionsTable';
import { ReportingTrackerContent } from '@/components/reporting-tracker/ReportingTrackerContent';
import { ComplianceMonitorContent } from '@/components/compliance-monitor/ComplianceMonitorContent';

const GranteeSubmissionsPage = () => {
  const [activeTab, setActiveTab] = useState<"grantee-submissions" | "reporting-tracker" | "compliance-monitor" | "disbursement-monitor">("grantee-submissions");
  const [period, setPeriod] = useState("monthly");

  const getTabTitle = () => {
    switch (activeTab) {
      case "grantee-submissions":
        return "Grantee Submissions";
      case "reporting-tracker":
        return "Reporting Tracker";
      case "compliance-monitor":
        return "Compliance Monitor";
      case "disbursement-monitor":
        return "Disbursement Monitor";
      default:
        return "Grantee Submissions";
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "grantee-submissions":
        return (
          <>
            <SubmissionStatsCards />
            <SubmissionsTable />
          </>
        );
      case "reporting-tracker":
        return <ReportingTrackerContent />;
      case "compliance-monitor":
        return <ComplianceMonitorContent />;
      case "disbursement-monitor":
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Disbursement Monitor</h3>
            <p className="text-gray-500">Monitor disbursement schedules and amounts.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header with Tab Title and Period Filter */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-medium text-gray-900">
          {getTabTitle()}
        </h1>
        {activeTab === "grantee-submissions" && (
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Tab Navigation */}
      <GranteeSubmissionsTabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default GranteeSubmissionsPage;
