import React from "react";
import { useState, useEffect, useMemo } from "react";
// import { Opportunity } from "@/types/opportunity";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

// Pasted from OpportunityTracking
import PipelineKanban from "@/components/opportunity-tracking/PipelineKanban";
import OpportunityFilter, {
  FilterOptions,
} from "@/components/opportunity-tracking/OpportunityFilter";
import { mockOpportunities, Opportunity } from "@/types/opportunity";
import { useToast } from "@/components/ui/use-toast";

interface OpportunityPipelineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  opportunities: Opportunity[];
}

const OpportunityPipelineDialog: React.FC<OpportunityPipelineDialogProps> = ({
  isOpen,
  onClose,
}) => {
  // Pasted from the Opportunity Tracking to mimick the display
  const [opportunities, setOpportunities] =
    useState<Opportunity[]>(mockOpportunities);
  const [filteredOpportunities, setFilteredOpportunities] =
    useState<Opportunity[]>(mockOpportunities);
  const [filters, setFilters] = useState<FilterOptions>({});

  // Extract unique donors and sectors for filters
  const donors = useMemo(() => {
    return Array.from(new Set(opportunities.map((opp) => opp.donorName)));
  }, [opportunities]);

  const sectors = useMemo(() => {
    return Array.from(
      new Set(
        opportunities
          .filter((opp) => opp.sector)
          .map((opp) => opp.sector as string)
      )
    );
  }, [opportunities]);

  // Filter opportunities when filters change
  useEffect(() => {
    let result = opportunities;

    if (filters.donor) {
      result = result.filter((opp) => opp.donorName === filters.donor);
    }

    if (filters.sector) {
      result = result.filter((opp) => opp.sector === filters.sector);
    }

    if (filters.type) {
      result = result.filter((opp) => opp.type === filters.type);
    }

    if (filters.deadlineAfter) {
      result = result.filter(
        (opp) => new Date(opp.deadline) >= filters.deadlineAfter!
      );
    }

    if (filters.deadlineBefore) {
      result = result.filter(
        (opp) => new Date(opp.deadline) <= filters.deadlineBefore!
      );
    }

    setFilteredOpportunities(result);
  }, [filters, opportunities]);

  const handleCardClick = (opportunity: Opportunity) => {
    null;
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="relative">
          {/* Close button positioned absolutely above everything */}
          <DialogClose className="absolute -right-2 -top-2 p-2 rounded-full hover:bg-gray-100 transition-colors z-10">
            <span className="sr-only">Close</span>
          </DialogClose>

          {/* Content layout */}
          <div className="flex justify-between items-center pt-8">
            {" "}
            {/* Added pt-8 to prevent title from being hidden */}
            <DialogTitle className="text-xl">Opportunity Pipeline</DialogTitle>
            <div className="flex gap-3">
              <OpportunityFilter
                onFilterChange={handleFilterChange}
                donors={donors}
                sectors={sectors}
              />
            </div>
          </div>
        </DialogHeader>

        <div className="mt-2">
          {/* Add the color indicators here */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-5">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#fa2d2d] mr-2"></div>
                <span className="text-sm text-gray-600">Urgent</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#e59346] mr-2"></div>
                <span className="text-sm text-gray-600">Due Soon</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#09c127] mr-2"></div>
                <span className="text-sm text-gray-600">Completed</span>
              </div>
            </div>
          </div>

          {/* Pipeline Columns */}
          <div className="mt-4">
            <PipelineKanban
              opportunities={filteredOpportunities}
              onCardClick={handleCardClick}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OpportunityPipelineDialog;
