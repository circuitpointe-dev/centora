
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface FiltersState {
  grant_name: string;
  donor_name: string;
  region: string;
  program_area: string;
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
          placeholder="Search Grant Name"
          value={filters.grant_name}
          onChange={(e) => updateFilter('grant_name', e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search Donor Name"
          value={filters.donor_name}
          onChange={(e) => updateFilter('donor_name', e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={filters.region} onValueChange={(value) => updateFilter('region', value)}>
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
      <Select value={filters.program_area} onValueChange={(value) => updateFilter('program_area', value)}>
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
