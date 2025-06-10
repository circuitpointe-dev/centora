
import React from "react";
import ProposalOverviewTab from "./ProposalOverviewTab";
import ProposalNarrativeTab from "./ProposalNarrativeTab";
import ProposalBudgetTab from "./ProposalBudgetTab";
import ProposalLogframeTab from "./ProposalLogframeTab";
import ProposalAttachmentTab from "./ProposalAttachmentTab";
import ProposalTeamTab from "./ProposalTeamTab";

interface ContentSectionProps {
  activeTab: string;
}

const ContentSection = ({ activeTab }: ContentSectionProps): JSX.Element => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProposalOverviewTab />;
      case "narrative":
        return <ProposalNarrativeTab />;
      case "budget":
        return <ProposalBudgetTab />;
      case "logframe":
        return <ProposalLogframeTab />;
      case "attachments":
        return <ProposalAttachmentTab />;
      case "team":
        return <ProposalTeamTab />;
      default:
        return <ProposalOverviewTab />;
    }
  };

  return (
    <div className="px-10 py-6">
      <div className="flex flex-col w-full max-w-3xl gap-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ContentSection;
