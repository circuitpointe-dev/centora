import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import ProposalTabs from "@/components/proposal-management/ProposalTabs";
import StatCards from "@/components/proposal-management/StatCards";
import ProposalTable from "@/components/proposal-management/ProposalTable";
import CreateProposalDialog from "@/components/proposal-management/CreateProposalDialog";
import ProposalCalendarTab from "@/components/proposal-management/ProposalCalendarTab";
import PastProposalLibrary from "@/components/proposal-management/PastProposalLibrary";
import BrowseTemplatesTab from "@/components/proposal-management/BrowseTemplatesTab";

const ProposalManagementPage: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Get tab from URL parameters
  const urlTab = searchParams.get('tab');
  const mode = searchParams.get('mode');
  
  // Map URL tab names to tab indices
  const getTabIndex = (tabName: string | null) => {
    switch (tabName) {
      case 'past-proposals': return 1;
      case 'browse-templates': return 2;
      case 'calendar': return 3;
      default: return 0;
    }
  };

  // Tabs: 0=Overview, 1=Past Proposal Library, 2=Browse Templates, 3=Calendar
  const [activeTab, setActiveTab] = useState(getTabIndex(urlTab));
  const [showCreate, setShowCreate] = useState(false);

  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(getTabIndex(urlTab));
  }, [urlTab]);

  // Get creation context from navigation state
  const creationContext = location.state?.creationContext;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-medium text-gray-900 mb-2">
          Proposal Management
        </h1>
        <p className="text-gray-600">
          Create, manage, and track your funding proposals
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto">
        <ProposalTabs activeTab={activeTab} setActiveTab={setActiveTab} onOpenCreate={() => setShowCreate(true)} />
        <div className="mt-6" />
        {activeTab === 0 && (
          <>
            <StatCards />
            <ProposalTable onOpenCreate={() => setShowCreate(true)} />
          </>
        )}
        {activeTab === 1 && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <PastProposalLibrary creationContext={mode === 'create' ? creationContext : undefined} />
          </div>
        )}
        {activeTab === 2 && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <BrowseTemplatesTab creationContext={mode === 'create' ? creationContext : undefined} />
          </div>
        )}
        {activeTab === 3 && (
          <ProposalCalendarTab />
        )}
      </div>
      <CreateProposalDialog open={showCreate} onOpenChange={setShowCreate} />
    </div>
  );
};

export default ProposalManagementPage;
