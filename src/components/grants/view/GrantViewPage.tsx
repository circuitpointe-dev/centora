import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useGrants } from '@/hooks/grants/useGrants';
import { CloseGrantTableSection } from './components/CloseGrantTableSection';
import { GrantCloseStatistics } from './components/GrantCloseStatistics';
import { useCloseGrantData } from './hooks/useCloseGrantData';

const GrantViewPage = () => {
  const { grantId } = useParams<{ grantId: string }>();
  const navigate = useNavigate();
  const { grants, loading: grantsLoading } = useGrants();
  
  const grant = grants.find(g => g.id === grantId);

  const {
    statistics,
    paginatedData,
    currentPage,
    handlePageChange
  } = useCloseGrantData(grantId || '');

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

  if (grantsLoading) {
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
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
            <p className="text-sm text-gray-600 mt-1">Grant Management and Oversight</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(grant.status)}>
            {grant.status.charAt(0).toUpperCase() + grant.status.slice(1)}
          </Badge>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Grant
          </Button>
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
            <CardTitle>Grant Information</CardTitle>
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
            <CardTitle>Grant Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              {grant.description || 'No description provided for this grant.'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <GrantCloseStatistics 
        complianceRate={statistics.complianceRate}
        disbursementRate={statistics.disbursementRate} 
        burnRate={statistics.burnRate}
      />

      {/* Detailed Tabs */}
      <Tabs defaultValue="reports" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="disbursements">Disbursements</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <CloseGrantTableSection
            title="Grant Reports"
            headers={['Report Type', 'Due Date', 'Status', 'Submitted Date', 'Actions']}
            data={paginatedData.reports.items}
            totalPages={paginatedData.reports.totalPages}
            currentPage={currentPage.reports}
            onPageChange={(page) => handlePageChange('reports', page)}
            renderRow={(report) => (
              <>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {report.report_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(report.due_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={report.submitted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {report.submitted ? 'Submitted' : report.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {report.submitted_date ? new Date(report.submitted_date).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </td>
              </>
            )}
          />
        </TabsContent>

        <TabsContent value="disbursements" className="space-y-4">
          <CloseGrantTableSection
            title="Disbursements"
            headers={['Milestone', 'Amount', 'Due Date', 'Disbursed On', 'Status']}
            data={paginatedData.disbursements.items}
            totalPages={paginatedData.disbursements.totalPages}
            currentPage={currentPage.disbursements}
            onPageChange={(page) => handlePageChange('disbursements', page)}
            renderRow={(disbursement) => (
              <>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {disbursement.milestone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(disbursement.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(disbursement.due_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {disbursement.disbursed_on ? new Date(disbursement.disbursed_on).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={
                    disbursement.status === 'released' ? 'bg-green-100 text-green-800' :
                    disbursement.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {disbursement.status}
                  </Badge>
                </td>
              </>
            )}
          />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <CloseGrantTableSection
            title="Compliance Requirements"
            headers={['Requirement', 'Due Date', 'Status', 'Evidence', 'Actions']}
            data={paginatedData.compliance.items}
            totalPages={paginatedData.compliance.totalPages}
            currentPage={currentPage.compliance}
            onPageChange={(page) => handlePageChange('compliance', page)}
            renderRow={(compliance) => (
              <>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {compliance.requirement}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(compliance.due_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={
                    compliance.status === 'completed' ? 'bg-green-100 text-green-800' :
                    compliance.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {compliance.status.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {compliance.evidence_document ? 'Yes' : 'No'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </td>
              </>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GrantViewPage;