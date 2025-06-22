
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FundingCycle } from "@/types/donor";
import { allFundingData, availableYears, statusLegend, months } from "@/data/fundingCyclesData";

const FundingCycles: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  // Filter funding data by selected year
  const fundingData = allFundingData.filter(fund => fund.year === selectedYear);

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

  return (
    <section className="bg-white rounded-lg p-6 shadow-sm h-[450px] flex flex-col">
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <h2 className="text-base font-medium text-gray-900">Funding Cycles</h2>
        
        {/* Year selector dropdown */}
        <Select
          value={selectedYear.toString()}
          onValueChange={(value) => setSelectedYear(parseInt(value))}
        >
          <SelectTrigger className="w-28 h-9">
            <SelectValue placeholder="Select Year">
              {selectedYear}
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
      </div>
      
      {/* Main content with unified scrolling */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex">
            {/* Left side for donor names */}
            <div className="w-[140px] min-w-[140px] pr-4 border-r border-gray-200">
              <div className="h-8" /> {/* Spacer for alignment with months */}
              {fundingData.map((fund, index) => (
                <div key={index} className="h-14 flex items-center">
                  <span className="text-sm text-gray-600 font-medium">{fund.name}</span>
                </div>
              ))}
            </div>

            {/* Right side for funding cycle bars */}
<div className="flex-1 overflow-hidden pl-4 relative">
  {/* Make this header sticky */}
  <div 
    className="flex justify-between mb-2 px-2 
               sticky top-0 bg-white z-10" 
    style={{ marginLeft: '-0.25rem', marginRight: '-0.25rem' }}
  >
    {months.map((month) => (
      <div 
        key={month} 
        className="text-sm text-gray-500 font-medium w-[8.333%] flex-shrink-0 text-center"
      >
        {month}
      </div>
    ))}
  </div>
  
  <div className="relative">
    {fundingData.map((fund, index) => (
      <div key={index} className="h-14 flex items-center relative">
        {/* … your Tooltip bar … */}
      </div>
    ))}
  </div>
</div>

          </div>
        </ScrollArea>
      </div>
      
      <Separator className="my-6 flex-shrink-0" />
      
      <div className="flex gap-8 flex-shrink-0">
        {statusLegend.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-3 h-3 ${item.color} rounded-sm`} />
            <span className="text-sm text-gray-700">{item.status}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FundingCycles;
