import React from 'react';
import { ComplianceMonitorContent } from '@/components/compliance-monitor/ComplianceMonitorContent';

const ComplianceMonitorPage = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Compliance Monitor</h1>
        <p className="text-muted-foreground">
          Monitor compliance requirements across all grants
        </p>
      </div>
      <ComplianceMonitorContent />
    </div>
  );
};

export default ComplianceMonitorPage;
