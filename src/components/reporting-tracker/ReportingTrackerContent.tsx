import React from 'react';
import { ReportingStatsCards } from './ReportingStatsCards';
import { ReportingTable } from './ReportingTable';

export const ReportingTrackerContent = () => {
  return (
    <div className="space-y-6">
      <ReportingStatsCards />
      <ReportingTable />
    </div>
  );
};