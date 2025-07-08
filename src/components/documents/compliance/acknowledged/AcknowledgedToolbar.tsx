import React from 'react';
import { Search, Download, Filter, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface AcknowledgedToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  selectedCount: number;
  onSendBulkReminder: () => void;
  filterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
}

export const AcknowledgedToolbar: React.FC<AcknowledgedToolbarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  selectedCount,
  onSendBulkReminder,
  filterOpen,
  onFilterOpenChange
}) => {
  return (
    <div className="flex items-center justify-between">
      {/* Search Input */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* Send Bulk Reminder Button */}
        <Button 
          variant="default" 
          size="sm" 
          className="gap-2 bg-violet-600 hover:bg-violet-700"
          onClick={onSendBulkReminder}
          disabled={selectedCount === 0}
        >
          <Mail className="h-4 w-4" />
          Send Bulk Reminder ({selectedCount})
        </Button>

        {/* Export Button */}
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export list
        </Button>

        {/* Filter Button */}
        <Popover open={filterOpen} onOpenChange={onFilterOpenChange}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                    <SelectItem value="Exempt">Exempt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};