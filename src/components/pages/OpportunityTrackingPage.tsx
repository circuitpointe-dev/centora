
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import KanbanBoard from "@/components/opportunity-tracking/KanbanBoard";
import OpportunityFilter, { FilterOptions } from "@/components/opportunity-tracking/OpportunityFilter";
import AddOpportunityDialog from "@/components/opportunity-tracking/AddOpportunityDialog";
import OpportunityDetailDialog from "@/components/opportunity-tracking/OpportunityDetailDialog";
import { mockOpportunities, Opportunity } from "@/types/opportunity";
import { Plus, PanelTop } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
// New import for pipeline dashboard dialog
import OpportunityPipelineDialog from "@/components/opportunity-tracking/pipeline/OpportunityPipelineDialog";

const OpportunityTracking: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPipelineDialog, setShowPipelineDialog] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const { toast } = useToast();

  // Extract unique donors and sectors for filters
  const donors = useMemo(() => Array.from(new Set(opportunities.map((opp) => opp.donorName))), [opportunities]);
  const sectors = useMemo(
    () => Array.from(new Set(opportunities.filter((opp) => opp.sector).map((opp) => opp.sector as string))),
    [opportunities]
  );

  // Filter opportunities when filters change
  useEffect(() => {
    let result = opportunities;
    if (filters.donor) result = result.filter((opp) => opp.donorName === filters.donor);
    if (filters.sector) result = result.filter((opp) => opp.sector === filters.sector);
    if (filters.type) result = result.filter((opp) => opp.type === filters.type);
    if (filters.deadlineAfter) result = result.filter((opp) => new Date(opp.deadline) >= filters.deadlineAfter!);
    if (filters.deadlineBefore) result = result.filter((opp) => new Date(opp.deadline) <= filters.deadlineBefore!);
    setFilteredOpportunities(result);
  }, [filters, opportunities]);

  const handleAddOpportunity = (newOpportunity: Opportunity) => {
    setOpportunities((prev) => [newOpportunity, ...prev]);
    toast({ title: "Opportunity Added", description: `${newOpportunity.title} has been added successfully.` });
  };

  const handleCardClick = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowDetailDialog(true);
  };

  const handleFilterChange = (newFilters: FilterOptions) => setFilters(newFilters);

  const donorsForDropdown = useMemo(
    () =>
      opportunities
        .map((opp) => ({ id: opp.donorId, name: opp.donorName }))
        .filter((donor, idx, self) => idx === self.findIndex((d) => d.id === donor.id)),
    [opportunities]
  );

  // Month/year state for pipeline dialog
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Opportunity Tracking</h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowPipelineDialog(true)}
          >
            <PanelTop className="h-4 w-4" />
            View Pipeline
          </Button>
          <OpportunityFilter
            onFilterChange={handleFilterChange}
            donors={donors}
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
        <KanbanBoard opportunities={filteredOpportunities} onCardClick={handleCardClick} />
      </div>
      <AddOpportunityDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAddOpportunity={handleAddOpportunity}
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
        allOpportunities={mockOpportunities}
        month={selectedMonth}
        year={selectedYear}
        setMonth={setSelectedMonth}
        setYear={setSelectedYear}
      />
    </div>
  );
};

export default OpportunityTracking;
