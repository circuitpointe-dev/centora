import React from 'react';
import { FileCheck } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ComplianceDocuments } from './ComplianceDocuments';
import { ComplianceReports } from './ComplianceReports';
import { PolicyLibrary } from './PolicyLibrary';
import { AcknowledgedDashboard } from './AcknowledgedDashboard';

const CompliancePage = () => {
  const navigationTabs = [
    { id: "documents", label: "Compliance Documents" },
    { id: "reports", label: "Compliance Reports" },
    { id: "policy", label: "Policy Library" },
    { id: "dashboard", label: "Acknowledged Dashboard" },
  ];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-medium text-gray-900">Compliance</h1>
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="bg-white h-auto p-0 border-b w-full justify-start grid grid-cols-4">
          {navigationTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="inline-flex items-center justify-center gap-2.5 p-2.5 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-violet-600 data-[state=active]:text-violet-600 data-[state=inactive]:text-[#38383880] data-[state=inactive]:border-b-0 bg-white shadow-none"
            >
              <span className="font-normal text-sm">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="documents" className="mt-6">
          <ComplianceDocuments />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <ComplianceReports />
        </TabsContent>

        <TabsContent value="policy" className="mt-6">
          <PolicyLibrary />
        </TabsContent>

        <TabsContent value="dashboard" className="mt-6">
          <AcknowledgedDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompliancePage;