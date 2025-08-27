// src/components/users/clients/ClientTableToolbar.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Plus, RotateCcw } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ClientFilters } from './types';

interface Props {
  search: string;
  setSearch: (v: string) => void;
  onOpenAdd: () => void;
  filters: ClientFilters;
  onFiltersChange: (filters: ClientFilters) => void;
  onResetAll: () => void;
}

export const ClientTableToolbar: React.FC<Props> = ({ 
  search, 
  setSearch, 
  onOpenAdd, 
  filters, 
  onFiltersChange, 
  onResetAll 
}) => {
  const [filterOpen, setFilterOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3 w-full md:max-w-md">
        <h1 className="text-lg font-semibold tracking-tight shrink-0">Client Directory</h1>
        <Input
          placeholder="Search Clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onResetAll}
          className="border-purple-600 text-purple-600 hover:bg-purple-50"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset All
        </Button>
        
        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(v) => onFiltersChange({ ...filters, status: v as ClientFilters["status"] })}
                >
                  <SelectTrigger className="w-full focus-visible:ring-purple-600 focus-visible:ring-offset-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Organization Type</Label>
                <Select
                  value={filters.organizationType}
                  onValueChange={(v) => onFiltersChange({ ...filters, organizationType: v as ClientFilters["organizationType"] })}
                >
                  <SelectTrigger className="w-full focus-visible:ring-purple-600 focus-visible:ring-offset-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="NGO">NGO</SelectItem>
                    <SelectItem value="Donor">Donor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Pricing Tier</Label>
                <Select
                  value={filters.pricingTier}
                  onValueChange={(v) => onFiltersChange({ ...filters, pricingTier: v as ClientFilters["pricingTier"] })}
                >
                  <SelectTrigger className="w-full focus-visible:ring-purple-600 focus-visible:ring-offset-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Tier 1">Tier 1</SelectItem>
                    <SelectItem value="Tier 2">Tier 2</SelectItem>
                    <SelectItem value="Tier 3">Tier 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                  onClick={() => {
                    onFiltersChange({ status: "all", organizationType: "all", pricingTier: "all" });
                    setFilterOpen(false);
                  }}
                >
                  Reset
                </Button>
                <Button
                  type="button"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => setFilterOpen(false)}
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button onClick={onOpenAdd} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Add New Client
        </Button>
      </div>
    </div>
  );
};
