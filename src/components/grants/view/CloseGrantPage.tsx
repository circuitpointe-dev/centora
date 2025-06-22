import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, Banknote, TrendingDown, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { toast } from '@/hooks/use-toast';
import { grantsData } from '../data/grantsData';
import { complianceData } from '../data/complianceData';
import { disbursementsData } from '../data/disbursementsData';
import { reportsData } from '../data/reportsData';

const CloseGrantPage = () => {
  const { grantId } = useParams();
  const navigate = useNavigate();
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState({
    reports: 1,
    disbursements: 1,
    compliance: 1,
  });

  const grant = grantsData.find(g => g.id === parseInt(grantId || '0'));
  
  if (!grant) {
    navigate('/dashboard/grants/active-grants');
    return null;
  }

  const grantCompliance = complianceData.filter(c => c.grantId === grant.id);
  const grantDisbursements = disbursementsData.filter(d => d.grantId === grant.id);
  const grantReports = reportsData.filter(r => r.grantId === grant.id);

  // Calculate statistics
  const completedCompliance = grantCompliance.filter(c => c.status === 'Completed').length;
  const complianceRate = grantCompliance.length > 0 ? Math.round((completedCompliance / grantCompliance.length) * 100) : 0;

  const releasedDisbursements = grantDisbursements.filter(d => d.status === 'Released');
  const totalDisbursed = releasedDisbursements.reduce((sum, d) => sum + d.amount, 0);
  const totalAmount = grantDisbursements.reduce((sum, d) => sum + d.amount, 0);
  const disbursementRate = totalAmount > 0 ? Math.round((totalDisbursed / totalAmount) * 100) : 0;

  const submittedReports = grantReports.filter(r => r.submitted).length;
  const burnRate = grantReports.length > 0 ? Math.round((submittedReports / grantReports.length) * 100) : 0;

  const itemsPerPage = 5;

  const getPaginatedData = (data: any[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      items: data.slice(startIndex, endIndex),
      totalPages: Math.ceil(data.length / itemsPerPage),
    };
  };

  const reportsData_paginated = getPaginatedData(grantReports, currentPage.reports);
  const disbursementsData_paginated = getPaginatedData(grantDisbursements, currentPage.disbursements);
  const complianceData_paginated = getPaginatedData(grantCompliance, currentPage.compliance);

  const handlePageChange = (table: string, page: number) => {
    setCurrentPage(prev => ({ ...prev, [table]: page }));
  };

  const handleCloseGrant = () => {
    setCloseDialogOpen(true);
  };

  const confirmCloseGrant = () => {
    // TODO: Implement actual grant closure logic
    console.log('Closing grant:', grant.id);
    
    toast({
      title: "Grant successfully closed",
      description: `${grant.grantName} has been closed.`,
    });
    
    setCloseDialogOpen(false);
    navigate('/dashboard/grants/active-grants');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Completed' || status === 'Submitted') {
      return <div className="h-4 w-4 bg-green-600 rounded-full flex items-center justify-center">
        <div className="h-2 w-2 bg-white rounded-full"></div>
      </div>;
    }
    return <div className="h-4 w-4 bg-yellow-600 rounded-full"></div>;
  };

  const getStatusColor = (status: string) => {
    if (status === 'Completed' || status === 'Submitted' || status === 'Released') {
      return 'text-green-800 bg-green-100';
    }
    if (status === 'In Progress' || status === 'Pending') {
      return 'text-yellow-800 bg-yellow-100';
    }
    if (status === 'Overdue') {
      return 'text-red-800 bg-red-100';
    }
    return 'text-gray-800 bg-gray-100';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const renderPagination = (tableType: string, totalPages: number, currentPageNum: number) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-4 px-6 py-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(tableType, Math.max(1, currentPageNum - 1))}
                className={currentPageNum === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(tableType, page)}
                  isActive={currentPageNum === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(tableType, Math.min(totalPages, currentPageNum + 1))}
                className={currentPageNum === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Close Grant Review</h1>
        <p className="text-lg text-gray-500">{grant.grantName}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-sm">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Compliance</p>
                <p className="text-2xl font-semibold text-gray-900">{complianceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-sm">
                <Banknote className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Disbursement Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{disbursementRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-sm">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Burn Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{burnRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reporting Schedule Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Reporting Schedule</h2>
        <div className="border border-gray-200 rounded-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-black">Requirement</TableHead>
                <TableHead className="font-semibold text-black">Status</TableHead>
                <TableHead className="font-semibold text-black">Due Date</TableHead>
                <TableHead className="font-semibold text-black">Submission Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportsData_paginated.items.map((report) => (
                <TableRow key={report.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-black">{report.reportType}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(report.status)}
                      <span className={`text-xs px-2 py-1 rounded-sm ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(report.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {report.submittedDate ? new Date(report.submittedDate).toLocaleDateString() : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {renderPagination('reports', reportsData_paginated.totalPages, currentPage.reports)}
      </div>

      {/* Disbursement Schedule Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Disbursement Schedule</h2>
        <div className="border border-gray-200 rounded-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-black">Milestone</TableHead>
                <TableHead className="font-semibold text-black">Amount</TableHead>
                <TableHead className="font-semibold text-black">Disbursed On</TableHead>
                <TableHead className="font-semibold text-black">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disbursementsData_paginated.items.map((disbursement) => (
                <TableRow key={disbursement.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-black">{disbursement.milestone}</TableCell>
                  <TableCell className="text-gray-600">{formatCurrency(disbursement.amount)}</TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(disbursement.disbursedOn).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-sm ${getStatusColor(disbursement.status)}`}>
                      {disbursement.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {renderPagination('disbursements', disbursementsData_paginated.totalPages, currentPage.disbursements)}
      </div>

      {/* Compliance Requirements Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Compliance Requirements</h2>
        <div className="border border-gray-200 rounded-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-black">Requirement</TableHead>
                <TableHead className="font-semibold text-black">Due Date</TableHead>
                <TableHead className="font-semibold text-black">Status</TableHead>
                <TableHead className="font-semibold text-black">Evidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complianceData_paginated.items.map((requirement) => (
                <TableRow key={requirement.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-black">{requirement.requirement}</TableCell>
                  <TableCell className="text-gray-600">
                    <span className={requirement.status === 'Completed' ? 'line-through' : ''}>
                      {new Date(requirement.dueDate).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(requirement.status)}
                      <span className={`text-xs px-2 py-1 rounded-sm ${getStatusColor(requirement.status)}`}>
                        {requirement.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {requirement.status === 'Completed' && requirement.evidenceDocument ? (
                      <span className="text-blue-600">{requirement.evidenceDocument}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {renderPagination('compliance', complianceData_paginated.totalPages, currentPage.compliance)}
      </div>

      {/* Final Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="border-gray-300 text-gray-700"
        >
          Cancel
        </Button>
        <Button
          onClick={handleCloseGrant}
          className="bg-red-600 hover:bg-red-700"
        >
          Close Grant
        </Button>
      </div>

      <ConfirmationDialog
        open={closeDialogOpen}
        onOpenChange={setCloseDialogOpen}
        title="Close Grant"
        description="Are you sure you want to close this grant? This action cannot be undone and will finalize all grant activities."
        onConfirm={confirmCloseGrant}
        confirmText="Close Grant"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};

export default CloseGrantPage;
