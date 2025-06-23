
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Filter,
  Download,
  Calendar as CalendarIcon,
  Loader2,
} from "lucide-react";

interface PeriodSelectorProps {
  selectedPeriod: string;
  onPeriodChange: (value: string) => Promise<void>;
  currentPeriodText: string;
  isLoading: boolean;
  filterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  onExport: () => void;
}

const periodOptions = [
  { label: "This Month", value: "this-month" },
  { label: "This Quarter", value: "this-quarter" },
  { label: "Last 12 Months", value: "last-12-months" },
  { label: "Custom", value: "custom" },
];

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
  currentPeriodText,
  isLoading,
  filterOpen,
  onFilterOpenChange,
  onExport,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-6">
      {/* Period selector with loading state */}
      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border-b-2 border-violet-700">
        <CalendarIcon size={16} className="text-violet-700" />
        {isLoading ? (
          <div className="flex items-center gap-2 w-40">
            <Loader2 className="h-4 w-4 animate-spin text-violet-700" />
            <span className="text-sm">Loading...</span>
          </div>
        ) : (
          <>
            <Select
              value={selectedPeriod}
              onValueChange={onPeriodChange}
            >
              <SelectTrigger className="w-40 border-0 p-0 h-auto shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Current period indicator badge */}
            <span className="ml-2 text-xs bg-violet-100 text-violet-800 px-2 py-1 rounded-small">
              {currentPeriodText}
            </span>
          </>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 ml-auto">
        <Popover open={filterOpen} onOpenChange={onFilterOpenChange}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter size={18} /> Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            {/* Filter content */}
          </PopoverContent>
        </Popover>
        <Button variant="default" className="gap-2" onClick={onExport}>
          <Download size={18} /> Export
        </Button>
      </div>
    </div>
  );
};
