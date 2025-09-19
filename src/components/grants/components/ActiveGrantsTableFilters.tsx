
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface FiltersState {
  search: string;
  status: string;
  donor: string;
  sortBy: string;
}

interface ActiveGrantsTableFiltersProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
}

export const ActiveGrantsTableFilters = ({ filters, onFiltersChange }: ActiveGrantsTableFiltersProps) => {
  const updateFilter = (key: keyof FiltersState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search grants, donors..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={filters.donor} onValueChange={(value) => updateFilter('donor', value)}>
        <SelectTrigger>
          <SelectValue placeholder="All Donors" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Donors</SelectItem>
          <SelectItem value="Gates Foundation">Gates Foundation</SelectItem>
          <SelectItem value="Ford Foundation">Ford Foundation</SelectItem>
          <SelectItem value="Open Society">Open Society</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="name-asc">Name A-Z</SelectItem>
          <SelectItem value="name-desc">Name Z-A</SelectItem>
          <SelectItem value="amount-high">Amount High-Low</SelectItem>
          <SelectItem value="amount-low">Amount Low-High</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
