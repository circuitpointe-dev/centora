import { useState, useMemo } from 'react';
import { useGrantsWithStats } from './useGrantsWithStats';

export interface GrantsFilter {
  search: string;
  status: string;
  donor: string;
  sortBy: string;
}

export const useActiveGrantsFilters = () => {
  const [filters, setFilters] = useState<GrantsFilter>({
    search: '',
    status: 'all',
    donor: 'all',
    sortBy: 'newest'
  });

  // Get only active grants
  const { grants, loading, error } = useGrantsWithStats({
    status: 'active'
  });

  const filteredData = useMemo(() => {
    let filtered = grants.filter(grant => grant.status === 'active');

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(grant => 
        grant.grant_name.toLowerCase().includes(searchTerm) ||
        grant.donor_name.toLowerCase().includes(searchTerm) ||
        grant.program_area?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply donor filter
    if (filters.donor !== 'all') {
      filtered = filtered.filter(grant => grant.donor_name === filters.donor);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.grant_name.localeCompare(b.grant_name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.grant_name.localeCompare(a.grant_name));
        break;
      case 'amount-high':
        filtered.sort((a, b) => Number(b.amount) - Number(a.amount));
        break;
      case 'amount-low':
        filtered.sort((a, b) => Number(a.amount) - Number(b.amount));
        break;
    }

    return filtered;
  }, [grants, filters]);

  return {
    filters,
    setFilters,
    filteredData,
    loading,
    error,
    allGrants: grants
  };
};