import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { GrantFormData } from './hooks/useGrantFormData';

interface GrantReviewPageProps {}

const GrantReviewPage: React.FC<GrantReviewPageProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData as GrantFormData;

  const handleCancel = () => {
    navigate('/dashboard/grants');
  };

  const handleBackToEdit = () => {
    navigate('/dashboard/grants/new', { state: { formData } });
  };

  const handleFinish = () => {
    console.log('Creating grant:', formData);
    toast({
      title: "Grant created successfully",
      description: "Your grant has been created and is now active.",
    });
    navigate('/dashboard/grants/active-grants');
  };

  if (!formData) {
    navigate('/dashboard/grants/new');
    return null;
  }

  return (
    <div className="w-full p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Review Grant Details</h1>
          <p className="text-sm text-gray-600 mt-1">Review all information before creating the grant</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Grant Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Grant Name</label>
                <p className="text-sm">{formData.overview.grantName || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Currency</label>
                <p className="text-sm">{formData.overview.currency || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Amount</label>
                <p className="text-sm">{formData.overview.amount || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Grant Period</label>
                <p className="text-sm">
                  {formData.overview.startDate && formData.overview.endDate
                    ? `${formData.overview.startDate.toLocaleDateString()} - ${formData.overview.endDate.toLocaleDateString()}`
                    : 'Not specified'
                  }
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Grant Manager</label>
                <p className="text-sm">{formData.overview.grantManager || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Fiduciary Officer</label>
                <p className="text-sm">{formData.overview.fiduciaryOfficer || 'Not specified'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grantee Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Grantee Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Organization</label>
                <p className="text-sm">{formData.granteeDetails.organization || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Contact Person</label>
                <p className="text-sm">{formData.granteeDetails.contactPerson || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm">{formData.granteeDetails.email || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-sm">{formData.granteeDetails.phoneNumber || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Region</label>
                <p className="text-sm">{formData.granteeDetails.region || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Program Area</label>
                <p className="text-sm">{formData.granteeDetails.programArea || 'Not specified'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submission Setup Card */}
        <Card>
          <CardHeader>
            <CardTitle>Submission Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Frequency</label>
                <p className="text-sm">{formData.granteeSubmission.frequency || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Submission Period</label>
                <p className="text-sm">
                  {formData.granteeSubmission.startDate && formData.granteeSubmission.endDate
                    ? `${formData.granteeSubmission.startDate.toLocaleDateString()} - ${formData.granteeSubmission.endDate.toLocaleDateString()}`
                    : 'Not specified'
                  }
                </p>
              </div>
            </div>
            {formData.granteeSubmission.submissionTypes.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500">Submission Types</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.granteeSubmission.submissionTypes
                    .filter(type => type.enabled)
                    .map((type, index) => (
                      <Badge key={index} variant="secondary">{type.name}</Badge>
                    ))
                  }
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Disbursement Schedule Card */}
        <Card>
          <CardHeader>
            <CardTitle>Disbursement Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {formData.disbursementSchedule.disbursements.length > 0 ? (
              <div className="space-y-3">
                {formData.disbursementSchedule.disbursements.map((disbursement, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{disbursement.milestone}</p>
                      <p className="text-sm text-gray-600">
                        {disbursement.disbursementDate 
                          ? disbursement.disbursementDate.toLocaleDateString()
                          : 'Date not set'
                        }
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{disbursement.currency} {disbursement.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No disbursements scheduled</p>
            )}
          </CardContent>
        </Card>

        {/* Compliance Checklist Card */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            {formData.complianceChecklist.complianceRequirements.length > 0 ? (
              <div className="space-y-3">
                {formData.complianceChecklist.complianceRequirements.map((requirement, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{requirement.name}</p>
                      <p className="text-sm text-gray-600">
                        Due: {requirement.dueDate 
                          ? requirement.dueDate.toLocaleDateString()
                          : 'No due date set'
                        }
                      </p>
                    </div>
                    <Badge variant={requirement.status === 'Completed' ? 'default' : 'secondary'}>
                      {requirement.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No compliance requirements added</p>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBackToEdit}>
              Back to Edit
            </Button>
            <Button 
              onClick={handleFinish}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Finish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrantReviewPage;