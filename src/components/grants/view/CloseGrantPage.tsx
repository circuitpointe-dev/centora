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

  // Stats calculations
  const completedCompliance = grantCompliance.filter(c => c.status === 'Completed').length;
  const complianceRate = grantCompliance.length
    ? Math.round((completedCompliance / grantCompliance.length) * 100)
    : 0;

  const releasedDisbursements = grantDisbursements.filter(d => d.status === 'Released');
  const totalDisbursed = releasedDisbursements.reduce((sum, d) => sum + d.amount, 0);
  const totalAmount = grantDisbursements.reduce((sum, d) => sum + d.amount, 0);
  const disbursementRate = totalAmount
    ? Math.round((totalDisbursed / totalAmount) * 100)
    : 0;

  const submittedReports = grantReports.filter(r => r.submitted).length;
  const burnRate = grantReports.length
    ? Math.round((submittedReports / grantReports.length) * 100)
    : 0;

  const itemsPerPage = 5;
  const paginate = (data, page) => {
    const start = (page - 1) * itemsPerPage;
    return {
      items: data.slice(start, start + itemsPerPage),
      totalPages: Math.ceil(data.length / itemsPerPage),
    };
  };

  const paginatedReports = paginate(grantReports, currentPage.reports);
  const paginatedDisbursements = paginate(grantDisbursements, currentPage.disbursements);
  const paginatedCompliance = paginate(grantCompliance, currentPage.compliance);

  const changePage = (section, page) => {
    setCurrentPage(prev => ({ ...prev, [section]: page }));
  };

  const openCloseDialog = () => setCloseDialogOpen(true);
  const confirmClose = () => {
    // closure logic
    toast({ title: 'Grant successfully closed', description: `${grant.grantName} has been closed.` });
    setCloseDialogOpen(false);
    navigate('/dashboard/grants/active-grants');
  };
  const cancel = () => navigate(-1);

  const statusIcon = status =>
    status === 'Completed' || status === 'Submitted' ? (
      <div className="h-4 w-4 bg-green-600 rounded-full flex items-center justify-center">
        <div className="h-2 w-2 bg-white rounded-full" />
      </div>
    ) : (
      <div className="h-4 w-4 bg-yellow-600 rounded-full" />
    );

  const statusClass = status => {
    if (['Completed', 'Submitted', 'Released'].includes(status)) return 'text-green-800 bg-green-100';
    if (['In Progress', 'Pending'].includes(status)) return 'text-yellow-800 bg-yellow-100';
    if (status === 'Overdue') return 'text-red-800 bg-red-100';
    return 'text-gray-800 bg-gray-100';
  };

  const formatCurrency = amt => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt);

  const renderPages = (section, totalPages, current) => {
    if (totalPages < 2) return null;
    return (
      <div className="flex justify-center mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => changePage(section, Math.max(1, current - 1))}
                className={current === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => changePage(section, page)}
                  isActive={current === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => changePage(section, Math.min(totalPages, current + 1))}
                className={current === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
        <Button variant="ghost" size="sm" onClick={cancel} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Close Grant Review</h1>
        <p className="text-lg text-gray-500 mt-1">{grant.grantName}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Compliance', value: `${complianceRate}%`, icon: <Shield className="h-6 w-6 text-green-600" />, bg: 'bg-green-100' },
          { label: 'Disbursement Rate', value: `${disbursementRate}%`, icon: <Banknote className="h-6 w-6 text-blue-600" />, bg: 'bg-blue-100' },
          { label: 'Burn Rate', value: `${burnRate}%`, icon: <TrendingDown className="h-6 w-6 text-red-600" />, bg: 'bg-red-100' },
        ].map((card, idx) => (
          <Card key={idx} className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 ${card.bg} rounded-sm`}>{card.icon}</div>
                <div>
                  <p className="text-sm text-gray-600">{card.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tables (Reporting, Disbursement, Compliance) */}
      {/* ... (unchanged table implementations) ... */}

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={cancel} className="border-gray-300 text-gray-700">Cancel</Button>
        <Button onClick={openCloseDialog} className="bg-red-600 hover:bg-red-700">Close Grant</Button>
      </div>

      <ConfirmationDialog
        open={closeDialogOpen}
        onOpenChange={setCloseDialogOpen}
        title="Close Grant"
        description="Are you sure you want to close this grant? This action cannot be undone and will finalize all grant activities."
        onConfirm={confirmClose}
        confirmText="Close Grant"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};

export default CloseGrantPage;
