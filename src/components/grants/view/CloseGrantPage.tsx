
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { toast } from '@/hooks/use-toast';
import { GrantCloseStatistics } from './components/GrantCloseStatistics';
import { CloseGrantTableSection } from './components/CloseGrantTableSection';
import { useCloseGrantData } from './hooks/useCloseGrantData';
import { renderReportRow, renderDisbursementRow, renderComplianceRow } from './utils/closeGrantUtils';

const CloseGrantPage = () => {
  const { grantId } = useParams();
  const navigate = useNavigate();
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);

  const {
    grant,
    statistics,
    paginatedData,
    currentPage,
    handlePageChange,
  } = useCloseGrantData(grantId || '0');
  
  if (!grant) {
    navigate('/dashboard/grants/active-grants');
    return null;
  }

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

  return (
    <div className="space-y-6 p-6">
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
        <h1 className="text-xl font-medium text-gray-900">Close Grant Review</h1>
        <p className="text-lg text-gray-500">{grant.grantName}</p>
      </div>

      <GrantCloseStatistics
        complianceRate={statistics.complianceRate}
        disbursementRate={statistics.disbursementRate}
        burnRate={statistics.burnRate}
      />

      <CloseGrantTableSection
        title="Reporting Schedule"
        headers={['Requirement', 'Status', 'Due Date', 'Submission Date']}
        data={paginatedData.reports.items}
        totalPages={paginatedData.reports.totalPages}
        currentPage={currentPage.reports}
        onPageChange={(page) => handlePageChange('reports', page)}
        renderRow={renderReportRow}
      />

      <CloseGrantTableSection
        title="Disbursement Schedule"
        headers={['Milestone', 'Amount', 'Disbursed On', 'Status']}
        data={paginatedData.disbursements.items}
        totalPages={paginatedData.disbursements.totalPages}
        currentPage={currentPage.disbursements}
        onPageChange={(page) => handlePageChange('disbursements', page)}
        renderRow={renderDisbursementRow}
      />

      <CloseGrantTableSection
        title="Compliance Requirements"
        headers={['Requirement', 'Due Date', 'Status', 'Evidence']}
        data={paginatedData.compliance.items}
        totalPages={paginatedData.compliance.totalPages}
        currentPage={currentPage.compliance}
        onPageChange={(page) => handlePageChange('compliance', page)}
        renderRow={renderComplianceRow}
      />

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
