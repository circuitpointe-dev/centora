import React, { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { grantsData } from '../data/grantsData';
import Overview from './Overview';
import { ReportsTable } from './ReportsTable';
import { DisbursementsTable } from './DisbursementsTable';
import { ComplianceTable } from './ComplianceTable';

const GrantViewPage = () => {
  const { grantId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Find the grant by ID
  const grant = grantsData.find(g => g.id === parseInt(grantId || '0'));

  if (!grant) {
    return <Navigate to="/dashboard/grants/active-grants" replace />;
  }

  const handleBack = () => {
    navigate(-1);
  };

  const handleCloseGrant = () => {
    navigate(`/dashboard/grants/close/${grant.id}`);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {grant.grantName}
          </h1>
          <p className="text-lg text-gray-500 mt-1">
            {grant.organization}
          </p>
        </div>
        <Button 
          variant="destructive"
          onClick={handleCloseGrant}
          className="bg-red-600 hover:bg-red-700"
        >
          Close Grant
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-gray-200">
          <TabsList className="h-auto p-0 bg-transparent w-full justify-start">
            <TabsTrigger 
              value="overview" 
              className="border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent rounded-none flex-1 py-3"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent rounded-none flex-1 py-3"
            >
              Reports
            </TabsTrigger>
            <TabsTrigger 
              value="disbursements" 
              className="border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent rounded-none flex-1 py-3"
            >
              Disbursements
            </TabsTrigger>
            <TabsTrigger 
              value="compliance" 
              className="border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent rounded-none flex-1 py-3"
            >
              Compliance
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-0">
          <Overview grant={grant} />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <ReportsTable grantId={grant.id} />
        </TabsContent>

        <TabsContent value="disbursements" className="mt-6">
          <DisbursementsTable grantId={grant.id} />
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <ComplianceTable grantId={grant.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GrantViewPage;
