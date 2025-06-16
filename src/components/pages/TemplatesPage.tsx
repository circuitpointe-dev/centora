
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Template, Download, Eye, FileText, Star, Clock } from 'lucide-react';

const TemplatesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-medium text-gray-900">
          Templates
        </h1>
        <p className="text-gray-600 mt-2">
          Access grant proposal and reporting templates
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: '#f0f9ff' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Templates</CardTitle>
            <Template className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              Ready to use
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: '#fefce8' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Used</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Popular templates
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: '#f0fdf4' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" style={{ backgroundColor: '#fef2f2' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recently Updated</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Template Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Proposal Templates</CardTitle>
            <CardDescription>Templates for grant proposals and applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Education Grant Proposal</p>
                    <p className="text-xs text-gray-500">Standard education sector template</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Eye className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                  <Download className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Healthcare Initiative Proposal</p>
                    <p className="text-xs text-gray-500">Healthcare and medical projects</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Eye className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                  <Download className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Community Development</p>
                    <p className="text-xs text-gray-500">Community-focused project template</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Eye className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                  <Download className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reporting Templates</CardTitle>
            <CardDescription>Templates for progress and final reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium">Quarterly Progress Report</p>
                    <p className="text-xs text-gray-500">Standard quarterly reporting format</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Eye className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                  <Download className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium">Financial Report</p>
                    <p className="text-xs text-gray-500">Monthly financial expenditure tracking</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Eye className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                  <Download className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm font-medium">Impact Assessment</p>
                    <p className="text-xs text-gray-500">Measure project outcomes and impact</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Eye className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                  <Download className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-sm font-medium">Final Project Report</p>
                    <p className="text-xs text-gray-500">Comprehensive project completion</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Eye className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                  <Download className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TemplatesPage;
