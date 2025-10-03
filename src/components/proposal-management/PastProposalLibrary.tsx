import React, { useState } from "react";
import { Search, Filter, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ProposalLibraryCard from "./ProposalLibraryCard";
import PastProposalDetailView from "./PastProposalDetailView";
import { useProposals, useDeleteAllProposals } from "@/hooks/useProposals";

interface Proposal {
  title: string;
  description: string;
  fileType: string;
  uses: number;
  imageSrc: string;
  rating?: number;
}

interface CreationContext {
  method: string;
  title: string;
  opportunityId: string;
  isTemplate: boolean;
}

interface PastProposalLibraryProps {
  creationContext?: CreationContext;
}

const PastProposalLibrary: React.FC<PastProposalLibraryProps> = ({ creationContext }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  
  // Fetch real proposals from backend
  const { data: backendProposals = [], isLoading } = useProposals();
  const deleteAllMutation = useDeleteAllProposals();

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete ALL proposals? This action cannot be undone.')) {
      deleteAllMutation.mutate();
    }
  };
  
  // Convert backend proposals to the expected format, keeping full proposal data
  const proposals = backendProposals.map((p: any) => ({
    ...p, // Keep all original proposal data
    title: p.name || p.title || 'Untitled Proposal',
    description: p.narrative_fields?.[0]?.value || 'No description available',
    fileType: 'Word',
    uses: 0,
    imageSrc: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    rating: 5,
  }));

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch = 
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFileType = 
      fileTypeFilter === "all" || proposal.fileType === fileTypeFilter;
    
    return matchesSearch && matchesFileType;
  });

  const uniqueFileTypes = Array.from(new Set(proposals.map(p => p.fileType)));

  const handleViewProposal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
  };

  const handleBackToLibrary = () => {
    setSelectedProposal(null);
  };

  // Show detail view if a proposal is selected
  if (selectedProposal) {
    return (
      <PastProposalDetailView
        proposal={selectedProposal}
        onBack={handleBackToLibrary}
        creationContext={creationContext}
      />
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading proposals...</p>
      </div>
    );
  }

  // Show library view
  return (
    <div className="w-full">
      {/* Header with Search and Filter */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Past Proposal Library</h2>
          {creationContext && (
            <p className="text-sm text-gray-600 mt-1">
              Select a proposal to reuse for "{creationContext.title}"
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Delete All Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteAll}
            disabled={deleteAllMutation.isPending || proposals.length === 0}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
          {/* Filter Dropdown */}
          <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
            <SelectTrigger className="w-[140px] bg-white border-gray-200">
              <Filter className="h-4 w-4 mr-2 text-gray-400" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueFileTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search Bar */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredProposals.length} of {proposals.length} proposals
        </p>
      </div>

      {/* Proposal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProposals.map((proposal, index) => (
          <ProposalLibraryCard
            key={index}
            proposal={proposal}
            onView={handleViewProposal}
          />
        ))}
      </div>

      {/* No Results Message */}
      {filteredProposals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No proposals found matching your criteria.</p>
          <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filter options.</p>
        </div>
      )}
    </div>
  );
};

export default PastProposalLibrary;
