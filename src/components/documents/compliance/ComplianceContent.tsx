import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComplianceDocuments } from './ComplianceDocuments';
import { ComplianceReports } from './ComplianceReports';
import { PolicyLibrary } from './PolicyLibrary';
import { AcknowledgedDashboard } from './AcknowledgedDashboard';

export const ComplianceContent = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Compliance</h1>
      </div>
      
      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="documents">Compliance Documents</TabsTrigger>
          <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
          <TabsTrigger value="policies">Policy Library</TabsTrigger>
          <TabsTrigger value="acknowledged">Acknowledged Dashboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="space-y-6">
          <ComplianceDocuments />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <ComplianceReports />
        </TabsContent>
        
        <TabsContent value="policies" className="space-y-6">
          <PolicyLibrary />
        </TabsContent>
        
        <TabsContent value="acknowledged" className="space-y-6">
          <AcknowledgedDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};