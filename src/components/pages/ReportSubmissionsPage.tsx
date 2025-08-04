import React from 'react';
import { ReportingTrackerContent } from '@/components/reporting-tracker/ReportingTrackerContent';

const ReportSubmissionsPage = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-medium text-gray-900 mb-2">
          Report Submissions
        </h1>
        <p className="text-gray-600">
          Track and manage grant report submissions across all periods
        </p>
      </div>

      {/* Main Content */}
      <ReportingTrackerContent />
    </div>
  );
};

export default ReportSubmissionsPage;