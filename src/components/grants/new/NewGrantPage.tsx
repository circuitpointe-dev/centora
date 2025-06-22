
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { OverviewTab } from './tabs/OverviewTab';
import { GranteeDetailsTab } from './tabs/GranteeDetailsTab';
import { GranteeSubmissionTab } from './tabs/GranteeSubmissionTab';
import { ReportingScheduleTab } from './tabs/ReportingScheduleTab';
import { ComplianceDisbursementTab } from './tabs/ComplianceDisbursementTab';
import { SuccessDialog } from './SuccessDialog';

export interface GrantFormData {
  overview: {
    grantName: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    grantManagers: string[];
    fiduciaryOfficer: string;
    grantAdministrator: string;
  };
  granteeDetails: {
    granteeName: string;
    granteeRefId: string;
    contactPerson: string;
    email: string;
    phoneNumber: string;
  };
  granteeSubmission: {
    narrativeReports: Array<{ title: string; status: string }>;
    financialReports: Array<{ title: string; status: string }>;
    meReports: Array<{ title: string; status: string }>;
    customReportTypes: Array<{
      name: string;
      reports: Array<{ title: string; status: string }>;
    }>;
  };
  reportingSchedule: {
    frequency: string;
    periodStart: Date | undefined;
    periodEnd: Date | undefined;
    reportingPeriods: Array<{
      label: string;
      submissionType: string;
      dueDate: Date | undefined;
      assignedReviewer: string;
    }>;
  };
  complianceDisbursement: {
    complianceRequirements: Array<{
      name: string;
      dueDate: Date | undefined;
      status: string;
    }>;
    disbursements: Array<{
      amount: number;
      disbursementDate: Date | undefined;
    }>;
  };
}

const NewGrantPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [formData, setFormData] = useState<GrantFormData>({
    overview: {
      grantName: '',
      startDate: undefined,
      endDate: undefined,
      grantManagers: [],
      fiduciaryOfficer: '',
      grantAdministrator: '',
    },
    granteeDetails: {
      granteeName: '',
      granteeRefId: 'GR-0001',
      contactPerson: '',
      email: '',
      phoneNumber: '',
    },
    granteeSubmission: {
      narrativeReports: [],
      financialReports: [],
      meReports: [],
      customReportTypes: [],
    },
    reportingSchedule: {
      frequency: '',
      periodStart: undefined,
      periodEnd: undefined,
      reportingPeriods: [],
    },
    complianceDisbursement: {
      complianceRequirements: [],
      disbursements: [],
    },
  });

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'grantee-details', label: 'Grantee Details' },
    { id: 'grantee-submission', label: 'Grantee Submission' },
    { id: 'reporting-schedule', label: 'Reporting Schedule' },
    { id: 'compliance-disbursement', label: 'Compliance & Disbursement Schedule' },
  ];

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabs.length - 1;

  const handleBack = () => {
    if (!isFirstTab) {
      setActiveTab(tabs[currentTabIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (!isLastTab) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData);
    toast({
      title: "Draft saved",
      description: "Your grant draft has been saved successfully.",
    });
  };

  const handleSave = () => {
    console.log('Saving grant:', formData);
    setShowSuccessDialog(true);
  };

  const handleSuccessConfirm = () => {
    setShowSuccessDialog(false);
    navigate('/dashboard/grants/active-grants');
  };

  const updateFormData = (section: keyof GrantFormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold">New Grant</CardTitle>
          <p className="text-sm text-gray-600">Create a new grant with all required details</p>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 h-auto p-1 bg-transparent border-b rounded-none">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="text-xs sm:text-sm data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none pb-3 font-medium"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="max-w-2xl mx-auto">
              <TabsContent value="overview" className="space-y-6 mt-6">
                <OverviewTab
                  data={formData.overview}
                  onUpdate={(data) => updateFormData('overview', data)}
                />
              </TabsContent>

              <TabsContent value="grantee-details" className="space-y-6 mt-6">
                <GranteeDetailsTab
                  data={formData.granteeDetails}
                  onUpdate={(data) => updateFormData('granteeDetails', data)}
                />
              </TabsContent>

              <TabsContent value="grantee-submission" className="space-y-6 mt-6">
                <GranteeSubmissionTab
                  data={formData.granteeSubmission}
                  onUpdate={(data) => updateFormData('granteeSubmission', data)}
                />
              </TabsContent>

              <TabsContent value="reporting-schedule" className="space-y-6 mt-6">
                <ReportingScheduleTab
                  data={formData.reportingSchedule}
                  onUpdate={(data) => updateFormData('reportingSchedule', data)}
                />
              </TabsContent>

              <TabsContent value="compliance-disbursement" className="space-y-6 mt-6">
                <ComplianceDisbursementTab
                  data={formData.complianceDisbursement}
                  onUpdate={(data) => updateFormData('complianceDisbursement', data)}
                />
              </TabsContent>
            </div>
          </Tabs>

          {/* Tab Navigation Footer */}
          <div className="flex justify-between items-center pt-6 mt-8 border-t border-gray-200 max-w-2xl mx-auto">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isFirstTab}
              >
                Back
              </Button>
              <Button
                variant="outline"
                onClick={handleSaveDraft}
              >
                Save Draft
              </Button>
            </div>
            
            <div className="flex gap-3">
              {isLastTab ? (
                <Button 
                  onClick={handleSave}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Save
                </Button>
              ) : (
                <Button 
                  onClick={handleNext}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        onConfirm={handleSuccessConfirm}
      />
    </div>
  );
};

export default NewGrantPage;
