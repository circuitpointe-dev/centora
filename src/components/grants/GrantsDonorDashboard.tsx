
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, FileCheck, Archive, TrendingUp } from 'lucide-react';

const GrantsDonorDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Grants Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Monitor and manage your grant portfolio
        </p>
      </div>

      {/* Key Metrics for Donors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow border border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Grants</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">45</div>
            <p className="text-xs text-muted-foreground">
              Across all programs
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Grants</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">18</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <FileCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">7</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
            <Archive className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">$2.4M</div>
            <p className="text-xs text-muted-foreground">
              This fiscal year
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Donor Specific Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-600">Recent Submissions</CardTitle>
            <CardDescription>Latest reports from grantees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { organization: "Health for All NGO", type: "Quarterly Report", date: "2 days ago", status: "New" },
                { organization: "Education First Foundation", type: "Financial Report", date: "5 days ago", status: "Reviewed" },
                { organization: "Clean Water Initiative", type: "Progress Update", date: "1 week ago", status: "Approved" },
                { organization: "Community Development Corp", type: "Mid-term Evaluation", date: "2 weeks ago", status: "Reviewed" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <div>
                    <p className="text-sm font-medium">{item.organization}</p>
                    <p className="text-xs text-gray-500">{item.type} • {item.date}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.status === 'New' ? 'bg-orange-100 text-orange-700' :
                    item.status === 'Reviewed' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-600">Quick Actions</CardTitle>
            <CardDescription>Common donor activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg border border-orange-200 hover:bg-orange-50 transition-colors">
                <div className="font-medium text-sm">Review Submissions</div>
                <div className="text-xs text-gray-500">Check pending grantee reports</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-orange-200 hover:bg-orange-50 transition-colors">
                <div className="font-medium text-sm">Create New Grant</div>
                <div className="text-xs text-gray-500">Launch a new funding opportunity</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-orange-200 hover:bg-orange-50 transition-colors">
                <div className="font-medium text-sm">Generate Report</div>
                <div className="text-xs text-gray-500">Create portfolio overview</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GrantsDonorDashboard;
