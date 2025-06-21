
import { useState, useMemo } from 'react';
import { grantsData } from '../data/grantsData';

interface FiltersState {
  grantName: string;
  organization: string;
  reportingStatus: string;
  region: string;
  year: string;
}

export const useActiveGrantsFilters = () => {
  const [filters, setFilters] = useState<FiltersState>({
    grantName: '',
    organization: '',
    reportingStatus: 'all',
    region: 'all',
    year: 'all'
  });

  const filteredData = useMemo(() => {
    return grantsData
      .filter(grant => grant.status === 'Active') // Only show active grants
      .filter(grant => {
        const matchesGrantName = filters.grantName === '' || 
          grant.grantName.toLowerCase().includes(filters.grantName.toLowerCase());
        
        const matchesOrganization = filters.organization === '' || 
          grant.organization.toLowerCase().includes(filters.organization.toLowerCase());
        
        const matchesReportingStatus = filters.reportingStatus === 'all' || 
          (filters.reportingStatus === 'submitted' && grant.reportingStatus === 'All Submitted') ||
          (filters.reportingStatus === 'due' && grant.reportingStatus.includes('Due')) ||
          (filters.reportingStatus === 'none' && grant.reportingStatus === 'No Reports');
        
        const matchesRegion = filters.region === 'all' || 
          grant.region.toLowerCase().replace(' ', '-') === filters.region;
        
        const matchesYear = filters.year === 'all' || 
          grant.year === filters.year;

        return matchesGrantName && matchesOrganization && 
               matchesReportingStatus && matchesRegion && matchesYear;
      });
  }, [filters]);

  return {
    filters,
    setFilters,
    filteredData
  };
};
