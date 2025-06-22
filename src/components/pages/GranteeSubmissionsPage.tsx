
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck, Upload, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GranteeSubmissionsPage = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Grantee Submissions
          </h1>
          <p className="text-gray-600">
            Manage reports and submissions from grantees
          </p>
        </div>
        <Button className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700">
          <Upload className="h-4 w-4" />
          <span>Upload Submission</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileCheck className="h-5 w-5 text-orange-600" />
              <span>Recent Submissions</span>
            </CardTitle>
            <CardDescription>
              Latest reports and documents from grantees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileCheck className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Grantee Submissions Portal</h3>
              <p className="text-gray-500">This feature will manage all submissions from grantees including reports and documentation.</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submission Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="font-semibold">18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending Review</span>
                  <span className="font-semibold">6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Overdue</span>
                  <span className="font-semibold text-red-600">3</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Review Pending
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileCheck className="h-4 w-4 mr-2" />
                  Approve Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GranteeSubmissionsPage;
