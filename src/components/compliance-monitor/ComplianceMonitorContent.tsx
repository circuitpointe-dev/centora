import React from 'react';
import { ComplianceStatsCards } from './ComplianceStatsCards';
import { ComplianceCharts } from './ComplianceCharts';
import { ComplianceTable } from './ComplianceTable';

export const ComplianceMonitorContent = () => {
  return (
    <div className="space-y-6">
      <ComplianceStatsCards />
      <ComplianceCharts />
      <ComplianceTable />
    </div>
  );
};