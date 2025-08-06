import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { ActiveGrantsTable } from '@/components/grants/ActiveGrantsTable';
import { ActiveGrantsStatCards } from '@/components/grants/ActiveGrantsStatCards';

const ActiveGrantsPage = () => {
  const { user } = useAuth();
  const userType = user?.userType;

  // Show donor-specific view for donors
  if (userType === 'Donor') {
    return (
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-medium text-gray-900 mb-2">
            Active Grants
          </h1>
          <p className="text-gray-600">
            Overview of currently active grants and their progress
          </p>
        </div>

        {/* Statistics Cards */}
        <ActiveGrantsStatCards />

        {/* Active Grants Table */}
        <ActiveGrantsTable />
      </div>
    );
  }

  // Default view for NGOs (keep existing content)
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-medium text-gray-900 mb-2">
          Active Grants
        </h1>
        <p className="text-gray-600">
          Manage currently active grants and their progress
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Active Grants List</span>
            </CardTitle>
            <CardDescription>
              All currently active grants requiring monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Active Grants Management</h3>
              <p className="text-gray-500">This feature will display and manage all active grants.</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Grants</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Value</span>
                  <span className="font-semibold">$2.1M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ending Soon</span>
                  <span className="font-semibold">3</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ActiveGrantsPage;
