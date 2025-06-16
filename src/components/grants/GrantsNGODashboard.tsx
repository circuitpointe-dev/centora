
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, FileText, Clock, CheckCircle } from 'lucide-react';

const GrantsNGODashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Grants Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your assigned grants and track progress
        </p>
      </div>

      {/* Key Metrics for NGOs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow border border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Grants</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">8</div>
            <p className="text-xs text-muted-foreground">
              +2 new this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">3</div>
            <p className="text-xs text-muted-foreground">
              Due this week
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">5</div>
            <p className="text-xs text-muted-foreground">
              Active implementations
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">12</div>
            <p className="text-xs text-muted-foreground">
              Successfully finished
            </p>
          </CardContent>
        </Card>
      </div>

      {/* NGO Specific Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-600">Upcoming Deadlines</CardTitle>
            <CardDescription>Important dates and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Quarterly Report - Education Program", date: "Due in 5 days", urgent: true },
                { title: "Mid-term Evaluation - Health Initiative", date: "Due in 12 days", urgent: false },
                { title: "Financial Report - Community Development", date: "Due in 18 days", urgent: false },
                { title: "Final Report - Water Project", date: "Due in 25 days", urgent: false },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className={`text-xs ${item.urgent ? 'text-red-500' : 'text-gray-500'}`}>{item.date}</p>
                  </div>
                  {item.urgent && (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-600">Quick Actions</CardTitle>
            <CardDescription>Common tasks for grant management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg border border-orange-200 hover:bg-orange-50 transition-colors">
                <div className="font-medium text-sm">Submit Progress Report</div>
                <div className="text-xs text-gray-500">Upload your latest project update</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-orange-200 hover:bg-orange-50 transition-colors">
                <div className="font-medium text-sm">Request Budget Amendment</div>
                <div className="text-xs text-gray-500">Modify your project budget</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-orange-200 hover:bg-orange-50 transition-colors">
                <div className="font-medium text-sm">Download Templates</div>
                <div className="text-xs text-gray-500">Access reporting templates</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GrantsNGODashboard;
