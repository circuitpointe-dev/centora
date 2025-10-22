import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface ExitDetailViewProps {
  onBack: () => void;
}

const ExitDetailView = ({ onBack }: ExitDetailViewProps) => {
  const handleBack = () => {
    onBack();
  };

  // Mock data for the exit detail
  const exitData = {
    person: 'Jane Doe',
    employeeId: 'EX-1042',
    role: 'Software Engineer II',
    organization: 'Engineering',
    type: 'Voluntary',
    effectiveDate: 'Jul 2, 2025',
    reasons: ['Time conflict', 'Work-life balance'],
    reasonDetails: 'Pursuing advanced degree, needs flexible schedule',
    notes: '',
    overallRating: 4,
    npsScore: 8,
    surveyResponses: {
      roleSatisfaction: '4',
      recommendEmployer: '8',
      improvements: 'More flexible work arrangements'
    },
    checklist: [
      { item: 'Hours Approved', completed: true },
      { item: 'Assignments Closed', completed: true },
      { item: 'Assets Returned', completed: false },
      { item: 'Access Revoked', completed: true },
      { item: 'Certificates Issued', completed: true },
      { item: 'Docs Archived', completed: true }
    ],
    rehireEligible: true
  };

  const completedItems = exitData.checklist.filter(item => item.completed).length;
  const totalItems = exitData.checklist.length;
  const blockers = totalItems - completedItems;

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="p-0 h-auto hover:bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
        </Button>
        <span>Exit feedback / Detail view</span>
      </div>

      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Exits</h1>
      </div>

      {/* Main Content Cards */}
      <div className="space-y-6">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Basic information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <p className="text-gray-900">{exitData.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Organization</label>
                <p className="text-gray-900">{exitData.organization}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Type</label>
                <p className="text-gray-900">{exitData.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Effective date</label>
                <p className="text-gray-900">{exitData.effectiveDate}</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Reason</label>
              <div className="mt-2 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {exitData.reasons.map((reason, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {reason}
                    </Badge>
                  ))}
                </div>
                <p className="text-gray-700">{exitData.reasonDetails}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Notes</label>
              <p className="text-gray-500 italic">{exitData.notes || 'No additional notes provided'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Exit Survey Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Exit survey</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Overall Rating</label>
                <p className="text-lg font-semibold text-gray-900">{exitData.overallRating} /5</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">NPS Score</label>
                <p className="text-lg font-semibold text-gray-900">{exitData.npsScore} /10</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">How satisfied were you with your role?</label>
                <p className="text-gray-900">{exitData.surveyResponses.roleSatisfaction}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Would you recommend us as an employer?</label>
                <p className="text-gray-900">{exitData.surveyResponses.recommendEmployer}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">What could we improve?</label>
                <p className="text-gray-900">{exitData.surveyResponses.improvements}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Close-out Checklist Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Close-out Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {exitData.checklist.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    item.completed ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    item.completed ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {item.item}
                  </span>
                </div>
              ))}
            </div>

            {blockers > 0 && (
              <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  {blockers} blocker{blockers > 1 ? 's' : ''} must be resolved before finalizing.
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rehire Eligibility Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Rehire Eligibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`flex items-center space-x-3 p-3 rounded-lg ${
              exitData.rehireEligible ? 'bg-green-50' : 'bg-red-50'
            }`}>
              {exitData.rehireEligible ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                exitData.rehireEligible ? 'text-green-800' : 'text-red-800'
              }`}>
                {exitData.rehireEligible ? 'Eligible for Rehire' : 'Not Eligible for Rehire'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={handleBack}>
          Cancel
        </Button>
        <Button variant="outline">
          Schedule interview
        </Button>
        <Button className="bg-purple-600 hover:bg-purple-700">
          Finalize exit
        </Button>
      </div>
    </div>
  );
};

export default ExitDetailView;
