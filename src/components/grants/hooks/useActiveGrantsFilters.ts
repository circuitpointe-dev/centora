
import { useState, useMemo } from 'react';
import { useGrantsWithStats } from '@/hooks/grants/useGrantsWithStats';
import { GrantFilters } from '@/types/grants';

interface FiltersState {
  grant_name: string;
  donor_name: string;
  region: string;
  program_area: string;
}

export const useActiveGrantsFilters = () => {
  const [filters, setFilters] = useState<FiltersState>({
    grant_name: '',
    donor_name: '',
    region: 'all',
    program_area: 'all'
  });

  // Get only active grants
  const activeFilters = { ...filters, status: 'active' };
  const { grants, loading, error } = useGrantsWithStats(activeFilters);

  return {
    filters,
    setFilters,
    filteredData: grants,
    loading,
    error
  };
};
