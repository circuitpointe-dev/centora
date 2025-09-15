import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GrantsDonorDashboard from '@/components/grants/GrantsDonorDashboard';
import GrantsNGODashboard from '@/components/grants/GrantsNGODashboard';
import { ActiveGrantsTable } from '@/components/grants/ActiveGrantsTable';
import { Button } from '@/components/ui/button';
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="active-grants" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Active Grants
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Compliance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <GrantsDonorDashboard />
        </TabsContent>

        <TabsContent value="active-grants" className="space-y-6">
          <ActiveGrantsTable />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="text-center py-12">
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Reports Module</h3>
            <p className="text-muted-foreground mb-4">
              Track and manage grant reporting requirements and submissions
            </p>
            <Button variant="outline">Coming Soon</Button>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Compliance Module</h3>
            <p className="text-muted-foreground mb-4">
              Monitor compliance requirements and track completion status
            </p>
            <Button variant="outline">Coming Soon</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GrantsPage;