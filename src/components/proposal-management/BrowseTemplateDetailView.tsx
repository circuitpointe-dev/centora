import React from "react";
import { Download } from "lucide-react";
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

interface BrowseTemplateDetailViewProps {
  template: {
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

const BrowseTemplateDetailView: React.FC<BrowseTemplateDetailViewProps> = ({
  template,
  onBack,
  creationContext,
}) => {
  const navigate = useNavigate();

  const handleUseTemplate = () => {
    // Navigate to manual proposal creation with template data
    const templateData = {
      source: "template",
      template: template,
      creationContext: creationContext
    };
    
    navigate("/dashboard/fundraising/manual-proposal-creation", {
      state: { prefilledData: templateData }
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <ProposalDetailHeader
        onBack={onBack}
        onReuse={handleUseTemplate}
        title={template.title}
        description={creationContext ? `Using template for "${creationContext.title}"` : template.description}
        buttonText="Use Template"
        buttonIcon={<Download className="h-4 w-4 mr-2" />}
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
          <ProposalNarrativeCard narrativeTitle="Template Narrative" />
          <ProposalBudgetCard budgetDescription="Template budget" />
          <ProposalTeamCard />
        </div>
      </div>

      {/* Attachments Card */}
      <ProposalAttachmentsCard />
    </div>
  );
};

export default BrowseTemplateDetailView;
