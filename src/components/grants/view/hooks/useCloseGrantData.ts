import { useState, useMemo } from 'react';
import { useGrants } from '@/hooks/grants/useGrants';
import { useGrantCompliance } from '@/hooks/grants/useGrantCompliance';
import { useGrantDisbursements } from '@/hooks/grants/useGrantDisbursements';
import { useGrantReports } from '@/hooks/grants/useGrantReports';

export const useCloseGrantData = (grantId: string) => {
  const [currentPage, setCurrentPage] = useState({
    reports: 1,
    disbursements: 1,
    compliance: 1,
  });

  const { grants } = useGrants();
  const { compliance: grantCompliance } = useGrantCompliance(grantId);
  const { disbursements: grantDisbursements } = useGrantDisbursements(grantId);
  const { reports: grantReports } = useGrantReports(grantId);

  const grant = grants.find(g => g.id === grantId);

  const statistics = useMemo(() => {
    const completedCompliance = grantCompliance.filter(c => c.status === 'completed').length;
    const complianceRate = grantCompliance.length > 0 ? Math.round((completedCompliance / grantCompliance.length) * 100) : 0;

    const releasedDisbursements = grantDisbursements.filter(d => d.status === 'released');
    const totalDisbursed = releasedDisbursements.reduce((sum, d) => sum + Number(d.amount), 0);
    const totalAmount = grantDisbursements.reduce((sum, d) => sum + Number(d.amount), 0);
    const disbursementRate = totalAmount > 0 ? Math.round((totalDisbursed / totalAmount) * 100) : 0;

    const submittedReports = grantReports.filter(r => r.submitted).length;
    const burnRate = grantReports.length > 0 ? Math.round((submittedReports / grantReports.length) * 100) : 0;

    return { complianceRate, disbursementRate, burnRate };
  }, [grantCompliance, grantDisbursements, grantReports]);

  const itemsPerPage = 5;

  const getPaginatedData = (data: any[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      items: data.slice(startIndex, endIndex),
      totalPages: Math.ceil(data.length / itemsPerPage),
    };
  };

  const paginatedData = {
    reports: getPaginatedData(grantReports, currentPage.reports),
    disbursements: getPaginatedData(grantDisbursements, currentPage.disbursements),
    compliance: getPaginatedData(grantCompliance, currentPage.compliance),
  };

  const handlePageChange = (table: string, page: number) => {
    setCurrentPage(prev => ({ ...prev, [table]: page }));
  };

  return {
    grant,
    statistics,
    paginatedData,
    currentPage,
    handlePageChange,
  };
};