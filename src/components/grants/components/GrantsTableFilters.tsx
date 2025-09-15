
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface FiltersState {
  grant_name: string;
  donor_name: string;
  status: string;
  region: string;
  program_area: string;
}

interface GrantsTableFiltersProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  disabled?: boolean;
}

export const GrantsTableFilters = ({ filters, onFiltersChange, disabled }: GrantsTableFiltersProps) => {
  const updateFilter = (key: keyof FiltersState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search Grant Name"
          value={filters.grant_name}
          onChange={(e) => updateFilter('grant_name', e.target.value)}
          className="pl-10"
          disabled={disabled}
        />
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search Donor Name"
          value={filters.donor_name}
          onChange={(e) => updateFilter('donor_name', e.target.value)}
          className="pl-10"
          disabled={disabled}
        />
      </div>
      <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.region} onValueChange={(value) => updateFilter('region', value)} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Regions</SelectItem>
          <SelectItem value="North America">North America</SelectItem>
          <SelectItem value="Europe">Europe</SelectItem>
          <SelectItem value="Asia">Asia</SelectItem>
          <SelectItem value="Africa">Africa</SelectItem>
          <SelectItem value="South America">South America</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.program_area} onValueChange={(value) => updateFilter('program_area', value)} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Program Area" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Programs</SelectItem>
          <SelectItem value="Health">Health</SelectItem>
          <SelectItem value="Education">Education</SelectItem>
          <SelectItem value="Environment">Environment</SelectItem>
          <SelectItem value="Community Development">Community Development</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
