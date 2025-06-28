
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface FiltersState {
  grantName: string;
  organization: string;
  reportingStatus: string;
  region: string;
  year: string;
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search Grant Name"
          value={filters.grantName}
          onChange={(e) => updateFilter('grantName', e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search Organization"
          value={filters.organization}
          onChange={(e) => updateFilter('organization', e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={filters.reportingStatus} onValueChange={(value) => updateFilter('reportingStatus', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Reporting Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Reports</SelectItem>
          <SelectItem value="submitted">All Submitted</SelectItem>
          <SelectItem value="due">Reports Due</SelectItem>
          <SelectItem value="none">No Reports</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.region} onValueChange={(value) => updateFilter('region', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Regions</SelectItem>
          <SelectItem value="north-america">North America</SelectItem>
          <SelectItem value="europe">Europe</SelectItem>
          <SelectItem value="asia">Asia</SelectItem>
          <SelectItem value="africa">Africa</SelectItem>
          <SelectItem value="south-america">South America</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.year} onValueChange={(value) => updateFilter('year', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Years</SelectItem>
          <SelectItem value="2024">2024</SelectItem>
          <SelectItem value="2023">2023</SelectItem>
          <SelectItem value="2022">2022</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
