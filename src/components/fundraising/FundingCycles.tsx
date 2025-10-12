
import React, { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FundingCycle } from "@/types/fundingCycle";
import { getMonthName, MONTH_NAMES } from "@/utils/monthConversion";
import { EmptyFundingCycles } from "./EmptyFundingCycles";
import { useDonorFundingCycles } from "@/hooks/useDonorFundingCycles";
import { useAuth } from "@/contexts/AuthContext";
import { AddFundingCycleDialog } from "./AddFundingCycleDialog";

const FundingCycles: React.FC = () => {
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Fetch funding cycles data - don't filter by year initially
  const { data: rawFundingCycles = [], isLoading } = useDonorFundingCycles(undefined, selectedYear || undefined);

  // Helper function: Status color mapping (must be defined before useMemo)
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-green-500';
      case 'upcoming': return 'bg-yellow-500';
      case 'closed': return 'bg-gray-400';
      default: return 'bg-blue-500';
    }
  };

  // Helper function: Calculate position style (must be defined before useMemo)
  const getPositionStyle = (cycle: FundingCycle) => {
    // Calculate position based on actual start month (0-indexed)
    const startMonthIndex = cycle.startMonth - 1;
    const endMonthIndex = cycle.endMonth - 1;
    const width = (endMonthIndex - startMonthIndex + 1) * (100/12);
    
    return {
      left: `${(startMonthIndex / 12) * 100}%`,
      width: `${width}%`
    };
  };

  // Process data and compute derived values
  const { fundingData, availableYears, filteredData } = useMemo(() => {
    if (!rawFundingCycles.length) {
      return { fundingData: [], availableYears: [], filteredData: [] };
    }

    // Transform database data to component format
    const transformed = rawFundingCycles.map((cycle): FundingCycle => ({
      id: cycle.id,
      name: cycle.name,
      startMonth: cycle.start_month,
      endMonth: cycle.end_month,
      year: cycle.year,
      status: cycle.status,
      description: cycle.description || '',
      color: getStatusColor(cycle.status),
      width: '',
      position: 0,
      donorId: cycle.donor_id,
      orgId: cycle.org_id
    }));

    // Get unique years for filter
    const years = [...new Set(transformed.map(cycle => cycle.year))].sort((a, b) => b - a);
    
    // Filter by selected year if one is selected
    const filtered = selectedYear 
      ? transformed.filter(cycle => cycle.year === selectedYear)
      : transformed;

    return {
      fundingData: transformed,
      availableYears: years,
      filteredData: filtered
    };
  }, [rawFundingCycles, selectedYear]);

  // Status legend
  const statusLegend = [
    { status: 'Ongoing', color: 'bg-green-500' },
    { status: 'Upcoming', color: 'bg-yellow-500' },
    { status: 'Closed', color: 'bg-gray-400' }
  ];

  return (
    <section className="bg-white rounded-lg p-6 shadow-sm h-[450px] flex flex-col">
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <h2 className="text-base font-medium text-gray-900">Funding Cycles</h2>
        
        <div className="flex items-center gap-3">
          {/* Year selector dropdown - only show if years available */}
          {availableYears.length > 0 && (
            <Select
              value={selectedYear?.toString() || ""}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger className="w-28 h-9">
                <SelectValue placeholder="Select Year">
                  {selectedYear || "Select Year"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {/* Add Funding Cycle Button */}
          <AddFundingCycleDialog />
        </div>
      </div>
      
      {/* Main content with fixed months header */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-sm text-gray-500">Loading funding cycles...</div>
          </div>
        ) : filteredData.length === 0 ? (
          <EmptyFundingCycles />
        ) : (
          <>
            {/* Fixed months header */}
            <div className="flex border-b border-gray-200 pb-2 mb-4 flex-shrink-0">
              {/* Spacer for donor names column */}
              <div className="w-[140px] min-w-[140px] pr-4"></div>
              {/* Months labels - fixed position */}
              <div className="flex-1 pl-4">
                 <div className="flex justify-between px-2">
                   {MONTH_NAMES.map((month) => (
                     <div key={month} className="text-sm text-gray-500 font-medium">
                       {month}
                     </div>
                   ))}
                 </div>
              </div>
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="flex">
                  {/* Left side for donor names */}
                  <div className="w-[140px] min-w-[140px] pr-4 border-r border-gray-200">
                    {filteredData.map((fund, index) => (
                      <div key={fund.id || index} className="h-14 flex items-center">
                        <span className="text-sm text-gray-600 font-medium">{fund.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Right side for funding cycle bars */}
                  <div className="flex-1 overflow-hidden pl-4">
                    <div className="relative">
                      {filteredData.map((fund, index) => (
                        <div key={fund.id || index} className="h-14 flex items-center relative">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div 
                                  className={`h-8 ${fund.color} rounded transition-opacity duration-200 absolute hover:opacity-90 cursor-pointer`}
                                  style={getPositionStyle(fund)}
                                />
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-xs p-3">
                                <p className="font-medium text-sm">{fund.name}</p>
                                <p className="text-xs mt-1 text-gray-500">{fund.description}</p>
                                <p className="text-xs mt-1 font-medium">Status: {fund.status}</p>
                                 {fund.startMonth && fund.endMonth && (
                                   <p className="text-xs mt-1">
                                     Period: {MONTH_NAMES[fund.startMonth-1]} - {MONTH_NAMES[fund.endMonth-1]} {fund.year}
                                   </p>
                                 )}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </>
        )}
      </div>
      
      {statusLegend.length > 0 && (
        <>
          <Separator className="my-6 flex-shrink-0" />
          
          <div className="flex gap-8 flex-shrink-0">
            {statusLegend.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-3 h-3 ${item.color} rounded-sm`} />
                <span className="text-sm text-gray-700">{item.status}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default FundingCycles;
