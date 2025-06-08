
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface OpportunityFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  donors: string[];
  sectors: string[];
}

export interface FilterOptions {
  donor?: string;
  sector?: string;
  deadlineBefore?: Date;
  deadlineAfter?: Date;
  type?: string;
}

const OpportunityFilter: React.FC<OpportunityFilterProps> = ({
  onFilterChange,
  donors,
  sectors,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [deadlineBefore, setDeadlineBefore] = useState<Date | undefined>(undefined);
  const [deadlineAfter, setDeadlineAfter] = useState<Date | undefined>(undefined);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleDeadlineBeforeChange = (date: Date | undefined) => {
    setDeadlineBefore(date);
    handleFilterChange('deadlineBefore', date);
  };

  const handleDeadlineAfterChange = (date: Date | undefined) => {
    setDeadlineAfter(date);
    handleFilterChange('deadlineAfter', date);
  };

  const applyFilters = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setFilters({});
    setDeadlineBefore(undefined);
    setDeadlineAfter(undefined);
    onFilterChange({});
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-white">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Filter Opportunities</h4>
          
          <div className="space-y-2">
            <Label htmlFor="donor">Donor</Label>
            <Select
              value={filters.donor}
              onValueChange={(value) => handleFilterChange("donor", value)}
            >
              <SelectTrigger id="donor">
                <SelectValue placeholder="Select donor" />
              </SelectTrigger>
              <SelectContent>
                {donors.map((donor) => (
                  <SelectItem key={donor} value={donor}>
                    {donor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sector">Sector</Label>
            <Select
              value={filters.sector}
              onValueChange={(value) => handleFilterChange("sector", value)}
            >
              <SelectTrigger id="sector">
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline Range</Label>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !deadlineAfter && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadlineAfter ? (
                      format(deadlineAfter, "MMM dd, yyyy")
                    ) : (
                      <span>From</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={deadlineAfter}
                    onSelect={handleDeadlineAfterChange}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !deadlineBefore && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadlineBefore ? (
                      format(deadlineBefore, "MMM dd, yyyy")
                    ) : (
                      <span>To</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={deadlineBefore}
                    onSelect={handleDeadlineBeforeChange}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Opportunity Type</Label>
            <Select
              value={filters.type}
              onValueChange={(value) => handleFilterChange("type", value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RFP">RFP</SelectItem>
                <SelectItem value="LOI">LOI</SelectItem>
                <SelectItem value="CFP">CFP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={clearFilters}>Clear</Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default OpportunityFilter;
