import React from 'react';
import { DisbursementStatsCards } from './DisbursementStatsCards';
import { DisbursementCharts } from './DisbursementCharts';
import { DisbursementTable } from './DisbursementTable';

export const DisbursementMonitorContent = () => {
  return (
    <div className="space-y-6">
      <DisbursementStatsCards />
      <DisbursementCharts />
      <DisbursementTable />
    </div>
  );
};