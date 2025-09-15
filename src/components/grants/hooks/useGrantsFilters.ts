
import { useState, useMemo } from 'react';
import { useGrantsWithStats } from '@/hooks/grants/useGrantsWithStats';
import { GrantFilters } from '@/types/grants';

interface FiltersState {
  grant_name: string;
  donor_name: string;
  status: string;
  region: string;
  program_area: string;
}

export const useGrantsFilters = () => {
  const [filters, setFilters] = useState<FiltersState>({
    grant_name: '',
    donor_name: '',
    status: 'all',
    region: 'all',
    program_area: 'all'
  });

  const { grants, loading, error } = useGrantsWithStats(filters);

  return {
    filters,
    setFilters,
    filteredData: grants,
    loading,
    error
  };
};
