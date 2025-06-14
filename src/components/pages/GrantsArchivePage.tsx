
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Archive, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GrantsArchivePage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Grants Archive
          </h1>
          <p className="text-gray-600 mt-2">
            Historical grants database and long-term storage
          </p>
        </div>
        <Button variant="outline" className="flex items-center space-x-2">
          <Search className="h-4 w-4" />
          <span>Search Archive</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Archive className="h-5 w-5 text-gray-600" />
              <span>Archived Grants</span>
            </CardTitle>
            <CardDescription>
              Long-term storage for historical grant records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Archive className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Grants Archive System</h3>
              <p className="text-gray-500">This feature will provide access to historical grant data and records.</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Archive Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Archived</span>
                  <span className="font-semibold">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Years Covered</span>
                  <span className="font-semibold">15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Storage Size</span>
                  <span className="font-semibold">2.3 GB</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GrantsArchivePage;
