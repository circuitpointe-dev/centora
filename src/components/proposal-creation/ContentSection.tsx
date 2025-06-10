
import React from "react";
import OverviewTab from "@/components/proposal-creation/tabs/OverviewTab";
import NarrativeTab from "@/components/proposal-creation/tabs/NarrativeTab";
import BudgetTab from "@/components/proposal-creation/tabs/BudgetTab";
import LogframeTab from "@/components/proposal-creation/tabs/LogframeTab";
import AttachmentsTab from "@/components/proposal-creation/tabs/AttachmentsTab";
import TeamTab from "@/components/proposal-creation/tabs/TeamTab";

interface ContentSectionProps {
  activeTab: string;
}

const ContentSection: React.FC<ContentSectionProps> = ({ activeTab }) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "narrative":
        return <NarrativeTab />;
      case "budget":
        return <BudgetTab />;
      case "logframe":
        return <LogframeTab />;
      case "attachments":
        return <AttachmentsTab />;
      case "team":
        return <TeamTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="px-10 py-6">
      {renderTabContent()}
    </div>
  );
};

export default ContentSection;
