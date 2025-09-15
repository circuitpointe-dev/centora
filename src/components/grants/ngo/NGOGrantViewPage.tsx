import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Clock } from 'lucide-react';
import { useGrants } from '@/hooks/grants/useGrants';
import { useToast } from "@/hooks/use-toast";
import { NGOOverview } from './NGOOverview';
import { NGOReportSubmissionTable } from './NGOReportSubmissionTable';
import { NGOComplianceTable } from './NGOComplianceTable';
import { NGODisbursementTable } from './NGODisbursementTable';
import { NoiseExtensionDialog } from './NoiseExtensionDialog';

const NGOGrantViewPage = () => {
  const { grantId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isExtensionDialogOpen, setIsExtensionDialogOpen] = useState(false);

  const { grants } = useGrants();

  // Find the grant by ID
  const grant = grants.find(g => g.id === grantId);

  if (!grant) {
    return <Navigate to="/dashboard/grants/dashboard" replace />;
  }

  const handleBack = () => {
    navigate('/dashboard/grants/dashboard');
  };

  const handleRequestExtension = () => {
    setIsExtensionDialogOpen(true);
  };

  const handleExtensionSubmitted = () => {
    toast({
      title: "Extension Request Submitted",
      description: "Your no-cost extension request has been submitted successfully and is under review.",
    });
    setIsExtensionDialogOpen(false);
  };

  return (
    <div>
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
            {grant.grant_name}
          </h1>
          <p className="text-lg text-gray-500 mt-1">
            Funded by {grant.donor_name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRequestExtension}
            className="flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            Request No Cost Extension
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-gray-200">
          <TabsList className="h-auto p-0 bg-transparent w-full justify-start">
            <TabsTrigger 
              value="overview" 
              className="border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent rounded-none flex-1 py-3"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent rounded-none flex-1 py-3"
            >
              Report Submissions
            </TabsTrigger>
            <TabsTrigger 
              value="disbursements" 
              className="border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent rounded-none flex-1 py-3"
            >
              Disbursement Schedule
            </TabsTrigger>
            <TabsTrigger 
              value="compliance" 
              className="border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent rounded-none flex-1 py-3"
            >
              Compliance Requirements
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-0">
          <NGOOverview grant={grant} />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <NGOReportSubmissionTable grantId={grant.id} />
        </TabsContent>

        <TabsContent value="disbursements" className="mt-6">
          <NGODisbursementTable grantId={grant.id} />
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <NGOComplianceTable grantId={grant.id} />
        </TabsContent>
      </Tabs>

      <NoiseExtensionDialog 
        isOpen={isExtensionDialogOpen}
        onClose={() => setIsExtensionDialogOpen(false)}
        onSubmit={handleExtensionSubmitted}
        grant={{
          id: parseInt(grant.id),
          grantName: grant.grant_name,
          organization: grant.donor_name
        }}
      />
    </div>
  );
};

export default NGOGrantViewPage;