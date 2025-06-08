
import React from "react";
import { RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProposalDetailHeader from "./ProposalDetailHeader";
import ProposalOverviewCard from "./ProposalOverviewCard";
import ProposalLogframeCard from "./ProposalLogframeCard";
import ProposalNarrativeCard from "./ProposalNarrativeCard";
import ProposalBudgetCard from "./ProposalBudgetCard";
import ProposalTeamCard from "./ProposalTeamCard";
import ProposalAttachmentsCard from "./ProposalAttachmentsCard";

interface CreationContext {
  method: string;
  title: string;
  opportunityId: string;
  isTemplate: boolean;
}

interface PastProposalDetailViewProps {
  proposal: {
    title: string;
    description: string;
    fileType: string;
    uses: number;
    imageSrc: string;
    rating?: number;
  };
  onBack: () => void;
  creationContext?: CreationContext;
}

const PastProposalDetailView: React.FC<PastProposalDetailViewProps> = ({
  proposal,
  onBack,
  creationContext,
}) => {
  const navigate = useNavigate();

  const handleReuseProposal = () => {
    // Navigate to manual proposal creation with proposal data
    const proposalData = {
      source: "proposal",
      proposal: proposal,
      creationContext: creationContext
    };
    
    navigate("/modules/fundraising/manual-proposal-creation", {
      state: { prefilledData: proposalData }
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <ProposalDetailHeader
        onBack={onBack}
        onReuse={handleReuseProposal}
        title={proposal.title}
        description={creationContext ? `Reusing proposal for "${creationContext.title}"` : proposal.description}
        buttonText="Reuse Proposal"
        buttonIcon={<RotateCcw className="h-4 w-4 mr-2" />}
      />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <ProposalOverviewCard />
          <ProposalLogframeCard />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <ProposalNarrativeCard narrativeTitle="Proposal Narrative" />
          <ProposalBudgetCard budgetDescription="Total project budget" />
          <ProposalTeamCard />
        </div>
      </div>

      {/* Attachments Card */}
      <ProposalAttachmentsCard />
    </div>
  );
};

export default PastProposalDetailView;
