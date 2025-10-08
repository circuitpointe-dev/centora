import React from "react";
import { RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateProposal } from "@/hooks/useProposals";
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
  proposal: any; // Full proposal object from backend
  onBack: () => void;
  creationContext?: CreationContext;
}

const PastProposalDetailView: React.FC<PastProposalDetailViewProps> = ({
  proposal,
  onBack,
  creationContext,
}) => {
  const navigate = useNavigate();
  const createProposal = useCreateProposal({ silent: true });
  const [isReusing, setIsReusing] = React.useState(false);

  const handleReuseProposal = async () => {
    if (isReusing) return; // prevent duplicate submissions
    setIsReusing(true);
    // Professional flow: create a copy draft and navigate by id
    try {
      const created = await createProposal.mutateAsync({
        name: `${proposal.title || proposal.name} (Copy)`,
        title: `${proposal.title || proposal.name} (Copy)`,
        opportunity_id: (creationContext as any)?.opportunityId || proposal.opportunity_id,
        overview_fields: proposal.overview_fields || [],
        narrative_fields: proposal.narrative_fields || [],
        logframe_fields: proposal.logframe_fields || [],
        budget_currency: proposal.budget_currency || 'USD',
        budget_amount: proposal.budget_amount,
        submission_status: 'draft',
      } as any);
      navigate(`/dashboard/fundraising/manual-proposal-creation?proposalId=${created.id}`);
    } catch (e) {
      // Fallback to old navigation if creation fails
      const proposalData = {
        source: "proposal",
        proposal: proposal,
        creationContext: creationContext
      };
      navigate("/dashboard/fundraising/manual-proposal-creation", { state: { prefilledData: proposalData } });
    } finally {
      // If navigation succeeded, component will unmount; otherwise re-enable
      setIsReusing(false);
    }
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
          <ProposalOverviewCard proposal={proposal} />
          <ProposalLogframeCard proposal={proposal} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <ProposalNarrativeCard narrativeTitle="Proposal Narrative" proposal={proposal} />
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
