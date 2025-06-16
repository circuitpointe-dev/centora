
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Calendar, DollarSign, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const AssignedGrantsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-medium text-gray-900">
          Assigned Grants
        </h1>
        <p className="text-gray-600 mt-2">
          Manage and track grants assigned to your organization
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: '#f0fdf4' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Grants</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: '#fefce8' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Due this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: '#f0f9ff' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1.2M</div>
            <p className="text-xs text-muted-foreground">
              Received to date
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: '#fef2f2' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Next 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grants List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Grants</CardTitle>
            <CardDescription>Your most recently assigned grants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Education Initiative Grant</p>
                    <p className="text-xs text-gray-500">$150,000 • Active</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">Due: Dec 30</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium">Healthcare Access Project</p>
                    <p className="text-xs text-gray-500">$200,000 • Report Due</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">Due: Dec 15</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Women Empowerment Fund</p>
                    <p className="text-xs text-gray-500">$75,000 • Active</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">Due: Jan 15</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for grant management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm">Submit Progress Report</div>
                <div className="text-xs text-gray-500">Upload your latest progress report</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm">Request Budget Modification</div>
                <div className="text-xs text-gray-500">Submit budget change requests</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm">View Grant Requirements</div>
                <div className="text-xs text-gray-500">Review compliance requirements</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssignedGrantsPage;
