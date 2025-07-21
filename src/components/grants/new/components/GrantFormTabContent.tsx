
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OverviewTab } from '../tabs/OverviewTab';
import { GranteeDetailsTab } from '../tabs/GranteeDetailsTab';
import { GranteeSubmissionTab } from '../tabs/GranteeSubmissionTab';

import { ComplianceChecklistTab } from '../tabs/ComplianceChecklistTab';
import { DisbursementScheduleTab } from '../tabs/DisbursementScheduleTab';
import { GrantFormData } from '../hooks/useGrantFormData';

interface GrantFormTabContentProps {
  formData: GrantFormData;
  updateFormData: (section: keyof GrantFormData, data: any) => void;
}

export const GrantFormTabContent: React.FC<GrantFormTabContentProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      <TabsContent value="overview" className="space-y-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Grant Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <OverviewTab
              data={formData.overview}
              onUpdate={(data) => updateFormData('overview', data)}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="grantee-details" className="space-y-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Grantee Details</CardTitle>
          </CardHeader>
          <CardContent>
            <GranteeDetailsTab
              data={formData.granteeDetails}
              onUpdate={(data) => updateFormData('granteeDetails', data)}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="grantee-submission" className="space-y-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Submission Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <GranteeSubmissionTab
              data={formData.granteeSubmission}
              onUpdate={(data) => updateFormData('granteeSubmission', data)}
            />
          </CardContent>
        </Card>
      </TabsContent>


      <TabsContent value="compliance-checklist" className="space-y-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <ComplianceChecklistTab
              data={formData.complianceChecklist}
              onUpdate={(data) => updateFormData('complianceChecklist', data)}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="disbursement-schedule" className="space-y-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Disbursement Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <DisbursementScheduleTab
              data={formData.disbursementSchedule}
              onUpdate={(data) => updateFormData('disbursementSchedule', data)}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
};
