
import { useState, useMemo } from 'react';
import { grantsData } from '../data/grantsData';

interface FiltersState {
  grantName: string;
  organization: string;
  status: string;
  reportingStatus: string;
  region: string;
  year: string;
}

export const useGrantsFilters = () => {
  const [filters, setFilters] = useState<FiltersState>({
    grantName: '',
    organization: '',
    status: 'all',
    reportingStatus: 'all',
    region: 'all',
    year: 'all'
  });

  const filteredData = useMemo(() => {
    return grantsData.filter(grant => {
      const matchesGrantName = filters.grantName === '' || 
        grant.grantName.toLowerCase().includes(filters.grantName.toLowerCase());
      
      const matchesOrganization = filters.organization === '' || 
        grant.organization.toLowerCase().includes(filters.organization.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || 
        grant.status.toLowerCase() === filters.status.toLowerCase();
      
      const matchesReportingStatus = filters.reportingStatus === 'all' || 
        (filters.reportingStatus === 'submitted' && grant.reportingStatus === 'All Submitted') ||
        (filters.reportingStatus === 'due' && grant.reportingStatus.includes('Due')) ||
        (filters.reportingStatus === 'none' && grant.reportingStatus === 'No Reports');
      
      const matchesRegion = filters.region === 'all' || 
        grant.region.toLowerCase().replace(' ', '-') === filters.region;
      
      const matchesYear = filters.year === 'all' || 
        grant.year === filters.year;

      return matchesGrantName && matchesOrganization && matchesStatus && 
             matchesReportingStatus && matchesRegion && matchesYear;
    });
  }, [filters]);

  return {
    filters,
    setFilters,
    filteredData
  };
};
