import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useGrants } from '@/hooks/grants/useGrants';
import { CloseGrantTableSection } from './components/CloseGrantTableSection';
import { GrantCloseStatistics } from './components/GrantCloseStatistics';
import { useCloseGrantData } from './hooks/useCloseGrantData';

const CloseGrantPage = () => {
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
            <h1 className="text-xl font-semibold">Close Grant: {grant.grant_name}</h1>
            <p className="text-sm text-gray-600 mt-1">Review grant completion and prepare for closure</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <FileText className="h-4 w-4 mr-2" />
            Close Grant
          </Button>
        </div>
      </div>

      {/* Grant Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Grant Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-gray-600">Donor</p>
              <p className="font-medium">{grant.donor_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-medium text-green-600">{formatCurrency(grant.amount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-medium">
                {new Date(grant.start_date).toLocaleDateString()} - {new Date(grant.end_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Program Area</p>
              <p className="font-medium">{grant.program_area || 'Not specified'}</p>
            </div>
          </div>
          {grant.description && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Description</p>
              <p className="mt-1">{grant.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Closure Statistics */}
      <GrantCloseStatistics 
        complianceRate={statistics.complianceRate}
        disbursementRate={statistics.disbursementRate} 
        burnRate={statistics.burnRate}
      />

      {/* Detailed Review Tabs */}
      <Tabs defaultValue="reports" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">Final Reports</TabsTrigger>
          <TabsTrigger value="disbursements">Disbursement History</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <CloseGrantTableSection
            title="Final Report Review"
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
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    report.submitted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {report.submitted ? 'Submitted' : 'Missing'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {report.submitted_date ? new Date(report.submitted_date).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                </td>
              </>
            )}
          />
        </TabsContent>

        <TabsContent value="disbursements" className="space-y-4">
          <CloseGrantTableSection
            title="Disbursement Summary"
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
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    disbursement.status === 'released' ? 'bg-green-100 text-green-800' :
                    disbursement.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {disbursement.status}
                  </span>
                </td>
              </>
            )}
          />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <CloseGrantTableSection
            title="Compliance Review"
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
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    compliance.status === 'completed' ? 'bg-green-100 text-green-800' :
                    compliance.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {compliance.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {compliance.evidence_document ? 'Submitted' : 'Missing'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="outline" size="sm">
                    Review
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

export default CloseGrantPage;