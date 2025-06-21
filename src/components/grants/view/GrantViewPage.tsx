
import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { grantsData } from '../data/grantsData';
import Overview from './Overview';

const GrantViewPage = () => {
  const { grantId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Find the grant by ID
  const grant = grantsData.find(g => g.id === parseInt(grantId || '0'));

  if (!grant) {
    return <Navigate to="/dashboard/grants/active-grants" replace />;
  }

  const handleCloseGrant = () => {
    console.log('Closing grant:', grant.id);
    // TODO: Implement close grant logic
  };

  return (
    <div className="space-y-6">
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
          <TabsList className="h-auto p-0 bg-transparent">
            <TabsTrigger 
              value="overview" 
              className="border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent rounded-none px-6 py-3"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent rounded-none px-6 py-3"
            >
              Reports
            </TabsTrigger>
            <TabsTrigger 
              value="disbursements" 
              className="border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent rounded-none px-6 py-3"
            >
              Disbursements
            </TabsTrigger>
            <TabsTrigger 
              value="compliance" 
              className="border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent rounded-none px-6 py-3"
            >
              Compliance
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-0">
          <Overview grant={grant} />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Reports tab content coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="disbursements" className="mt-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Disbursements tab content coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Compliance tab content coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GrantViewPage;
