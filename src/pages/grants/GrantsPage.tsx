import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GrantsDonorDashboard from '@/components/grants/GrantsDonorDashboard';
import { ReportsSubmissionsPage } from '@/components/grants/pages/ReportsSubmissionsPage';
import { ComplianceChecklistPage } from '@/components/grants/pages/ComplianceChecklistPage';
import { DisbursementSchedulePage } from '@/components/grants/pages/DisbursementSchedulePage';
import { ProfilePage } from '@/components/grants/pages/ProfilePage';
import { FileSpreadsheet, BarChart3, Users, ClipboardList } from 'lucide-react';

const GrantsPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Grants Management</h1>
        <p className="text-muted-foreground">
          Manage your grant portfolio, track compliance, and monitor disbursements
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="reports-submissions" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Reports Submissions
          </TabsTrigger>
          <TabsTrigger value="compliance-checklist" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Compliance Checklist
          </TabsTrigger>
          <TabsTrigger value="disbursement-schedule" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Disbursement Schedule
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <GrantsDonorDashboard />
        </TabsContent>

        <TabsContent value="reports-submissions" className="space-y-6">
          <ReportsSubmissionsPage />
        </TabsContent>

        <TabsContent value="compliance-checklist" className="space-y-6">
          <ComplianceChecklistPage />
        </TabsContent>

        <TabsContent value="disbursement-schedule" className="space-y-6">
          <DisbursementSchedulePage />
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <ProfilePage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GrantsPage;