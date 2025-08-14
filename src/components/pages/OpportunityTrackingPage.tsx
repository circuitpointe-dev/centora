
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import KanbanBoard from "@/components/opportunity-tracking/KanbanBoard";
import OpportunityFilter, { FilterOptions } from "@/components/opportunity-tracking/OpportunityFilter";
import AddOpportunityDialog from "@/components/opportunity-tracking/AddOpportunityDialog";
import OpportunityDetailDialog from "@/components/opportunity-tracking/OpportunityDetailDialog";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOpportunities, DatabaseOpportunity } from "@/hooks/useOpportunities";
import { useDonors } from "@/hooks/useDonors";
// New import for pipeline dashboard dialog
import OpportunityPipelineDialog from "@/components/opportunity-tracking/pipeline/OpportunityPipelineDialog";

const OpportunityTracking: React.FC = () => {
  const { data: opportunities = [], isLoading, error } = useOpportunities();
  const { data: donors = [] } = useDonors();
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPipelineDialog, setShowPipelineDialog] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<DatabaseOpportunity | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const { toast } = useToast();

  // Extract unique donors and sectors for filters
  const donorNames = useMemo(() => Array.from(new Set(opportunities.map((opp) => opp.donor?.name).filter(Boolean))), [opportunities]);
  const sectors = useMemo(
    () => Array.from(new Set(opportunities.filter((opp) => opp.sector).map((opp) => opp.sector as string))),
    [opportunities]
  );

  // Filter opportunities
  const filteredOpportunities = useMemo(() => {
    let result = opportunities;
    if (filters.donor) result = result.filter((opp) => opp.donor?.name === filters.donor);
    if (filters.sector) result = result.filter((opp) => opp.sector === filters.sector);
    if (filters.type) result = result.filter((opp) => opp.type === filters.type);
    if (filters.deadlineAfter) result = result.filter((opp) => new Date(opp.deadline) >= filters.deadlineAfter!);
    if (filters.deadlineBefore) result = result.filter((opp) => new Date(opp.deadline) <= filters.deadlineBefore!);
    return result;
  }, [filters, opportunities]);

  const handleCardClick = (opportunity: DatabaseOpportunity) => {
    setSelectedOpportunity(opportunity);
    setShowDetailDialog(true);
  };

  const handleFilterChange = (newFilters: FilterOptions) => setFilters(newFilters);

  const donorsForDropdown = useMemo(
    () => donors.map((donor) => ({ id: donor.id, name: donor.name })),
    [donors]
  );

  // Month/year state for pipeline dialog
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-medium text-foreground mb-2">Error Loading Opportunities</h3>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-medium text-gray-900">Opportunity Tracking</h1>
        <div className="flex gap-3">
          <OpportunityFilter
            onFilterChange={handleFilterChange}
            donors={donorNames}
            sectors={sectors}
          />
          <Button
            className="bg-violet-600 hover:bg-violet-700 text-white"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Opportunity
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <KanbanBoard 
          opportunities={filteredOpportunities} 
          onCardClick={handleCardClick}
          isLoading={isLoading}
          onCreateOpportunity={() => setShowAddDialog(true)}
        />
      </div>
      <AddOpportunityDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        donors={donorsForDropdown}
      />
      <OpportunityDetailDialog
        opportunity={selectedOpportunity}
        isOpen={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
      />
      {/* Show Opportunity Pipeline Dashboard in Dialog */}
      <OpportunityPipelineDialog
        isOpen={showPipelineDialog}
        onClose={() => setShowPipelineDialog(false)}
        allOpportunities={opportunities}
        month={selectedMonth}
        year={selectedYear}
        setMonth={setSelectedMonth}
        setYear={setSelectedYear}
      />
    </div>
  );
};

export default OpportunityTracking;
