
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import HeaderSection from "@/components/proposal-creation/HeaderSection";
import FooterSection from "@/components/proposal-creation/FooterSection";
import NavigationSection from "@/components/proposal-creation/NavigationSection";
import ContentSection from "@/components/proposal-creation/ContentSection";
import SidebarSection from "@/components/proposal-creation/SidebarSection";

const ManualProposalCreationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="bg-[#f4f6f9] flex flex-row justify-center w-full min-h-screen">
      <div className="bg-[#f4f6f9] w-full max-w-[1160px] relative">
        {/* Header area */}
        <HeaderSection />

        {/* Footer area */}
        <FooterSection />

        <div className="flex flex-row">
          {/* Navigation and Content area */}
          <div className="w-[750px]">
            <NavigationSection activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Content area */}
            <ContentSection activeTab={activeTab} />

            {/* Add New Field button */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 mt-4 ml-[43px] text-xs text-[#383839a8] border-[#383839a6]"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              Add New Field
            </Button>
          </div>

          {/* Sidebar area */}
          <div className="w-[370px]">
            <SidebarSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualProposalCreationPage;
