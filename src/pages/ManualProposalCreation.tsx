
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ContentSection from "@/components/proposal-creation/ContentSection";
import FooterSection from "@/components/proposal-creation/FooterSection";
import HeaderSection from "@/components/proposal-creation/HeaderSection";
import NavigationSection from "@/components/proposal-creation/NavigationSection";
import SidebarSection from "@/components/proposal-creation/SidebarSection";

const ManualProposalCreation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Get pre-filled data from navigation state
  const prefilledData = location.state?.prefilledData;

  const handleBack = () => {
    // Navigate back to proposal management
    navigate("/dashboard/fundraising/proposal-management");
  };

  return (
    <div className="bg-[#f4f6f9] flex flex-row justify-center w-full min-h-screen">
      <div className="bg-[#f4f6f9] w-full max-w-[1160px] relative">
        {/* FrameSubsect - Header area */}
        <HeaderSection />

        {/* FrameWrapperSubsect - Footer area */}
        <FooterSection />

        <div className="flex flex-row">
          {/* NavbarSubsect - Navigation area */}
          <div className="w-[750px]">
            <NavigationSection 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />

            {/* DivSubsect - Content area */}
            <div className="px-10 py-6">
              <ContentSection activeTab={activeTab} />
            </div>

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

          {/* DivWrapperSubsect - Sidebar area */}
          <div className="w-[370px]">
            <SidebarSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualProposalCreation;
