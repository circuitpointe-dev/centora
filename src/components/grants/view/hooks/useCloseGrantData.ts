
import { useState, useMemo } from 'react';
import { grantsData } from '../../data/grantsData';
import { complianceData } from '../../data/complianceData';
import { disbursementsData } from '../../data/disbursementsData';
import { reportsData } from '../../data/reportsData';

export const useCloseGrantData = (grantId: string) => {
  const [currentPage, setCurrentPage] = useState({
    reports: 1,
    disbursements: 1,
    compliance: 1,
  });

  const grant = grantsData.find(g => g.id === parseInt(grantId || '0'));
  
  const grantCompliance = complianceData.filter(c => c.grantId === grant?.id);
  const grantDisbursements = disbursementsData.filter(d => d.grantId === grant?.id);
  const grantReports = reportsData.filter(r => r.grantId === grant?.id);

  const statistics = useMemo(() => {
    const completedCompliance = grantCompliance.filter(c => c.status === 'Completed').length;
    const complianceRate = grantCompliance.length > 0 ? Math.round((completedCompliance / grantCompliance.length) * 100) : 0;

    const releasedDisbursements = grantDisbursements.filter(d => d.status === 'Released');
    const totalDisbursed = releasedDisbursements.reduce((sum, d) => sum + d.amount, 0);
    const totalAmount = grantDisbursements.reduce((sum, d) => sum + d.amount, 0);
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
