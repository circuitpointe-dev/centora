import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, DollarSign, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useGrants } from '@/hooks/grants/useGrants';
import { useGrantCompliance } from '@/hooks/grants/useGrantCompliance';
import { useGrantDisbursements } from '@/hooks/grants/useGrantDisbursements';
import { useGrantReports } from '@/hooks/grants/useGrantReports';
import { GrantStatsCards } from './NGOGrantStatsCards';
import { NGODisbursementTable } from './NGODisbursementTable';

const NGOGrantViewPage = () => {
  const { grantId } = useParams<{ grantId: string }>();
  const navigate = useNavigate();
  const { grants, loading: grantsLoading } = useGrants();
  const { compliance, loading: complianceLoading } = useGrantCompliance(grantId);
  const { disbursements, loading: disbursementsLoading } = useGrantDisbursements(grantId);
  const { reports, loading: reportsLoading } = useGrantReports(grantId);

  const grant = grants.find(g => g.id === grantId);
  const loading = grantsLoading || complianceLoading || disbursementsLoading || reportsLoading;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: amount >= 1000000 ? 'compact' : 'standard',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!grant) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Grant Not Found</h1>
            <p className="text-sm text-gray-600 mt-1">The requested grant could not be found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{grant.grant_name}</h1>
            <p className="text-sm text-gray-600 mt-1">Grant Details and Monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(grant.status)}>
            {grant.status.charAt(0).toUpperCase() + grant.status.slice(1)}
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Grant Overview */}
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Grant Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Donor</span>
              <span className="font-medium">{grant.donor_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount</span>
              <span className="font-medium text-green-600">{formatCurrency(grant.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Start Date</span>
              <span className="font-medium">{new Date(grant.start_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">End Date</span>
              <span className="font-medium">{new Date(grant.end_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Program Area</span>
              <span className="font-medium">{grant.program_area || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Region</span>
              <span className="font-medium">{grant.region || 'Not specified'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Project Timeline</span>
                <span>
                  {Math.round(
                    ((new Date().getTime() - new Date(grant.start_date).getTime()) /
                      (new Date(grant.end_date).getTime() - new Date(grant.start_date).getTime())) * 100
                  )}% Complete
                </span>
              </div>
              <Progress 
                value={Math.round(
                  ((new Date().getTime() - new Date(grant.start_date).getTime()) /
                    (new Date(grant.end_date).getTime() - new Date(grant.start_date).getTime())) * 100
                )}
                className="h-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{new Date(grant.start_date).toLocaleDateString()}</span>
                <span>{new Date(grant.end_date).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Cards */}
      <GrantStatsCards grantId={grantId!} />

      {/* Detailed Tabs */}
      <Tabs defaultValue="disbursements" className="mt-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="disbursements">Disbursements</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="disbursements" className="space-y-4">
          <NGODisbursementTable grantId={grantId!} />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              {compliance.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No compliance requirements found for this grant.
                </div>
              ) : (
                <div className="space-y-3">
                  {compliance.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getComplianceStatusIcon(item.status)}
                        <div>
                          <p className="font-medium">{item.requirement}</p>
                          <p className="text-sm text-gray-600">Due: {new Date(item.due_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Badge className={
                        item.status === 'completed' ? 'bg-green-100 text-green-800' :
                        item.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No reports found for this grant.
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{report.report_type}</p>
                        <p className="text-sm text-gray-600">Due: {new Date(report.due_date).toLocaleDateString()}</p>
                        {report.submitted_date && (
                          <p className="text-sm text-green-600">Submitted: {new Date(report.submitted_date).toLocaleDateString()}</p>
                        )}
                      </div>
                      <Badge className={
                        report.submitted ? 'bg-green-100 text-green-800' :
                        report.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {report.submitted ? 'Submitted' : report.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grant Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Document management functionality will be implemented here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NGOGrantViewPage;