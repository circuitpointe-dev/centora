import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, Save } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import ProposalOverviewTab from "@/components/proposal-creation/ProposalOverviewTab";
import ProposalNarrativeTab from "@/components/proposal-creation/ProposalNarrativeTab";
import ProposalBudgetTab from "@/components/proposal-creation/ProposalBudgetTab";
import ProposalLogframeTab from "@/components/proposal-creation/ProposalLogframeTab";
import ProposalAttachmentTab from "@/components/proposal-creation/ProposalAttachmentTab";
import ProposalTeamTab from "@/components/proposal-creation/ProposalTeamTab";
import SubmissionTrackerDialog from "@/components/proposal-creation/SubmissionTrackerDialog";
import ProposalCommentsSection from "@/components/proposal-creation/ProposalCommentsSection";
import ProposalVersionHistory from "@/components/proposal-creation/ProposalVersionHistory";

const ManualProposalCreation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [showSubmissionTracker, setShowSubmissionTracker] = useState(false);
  const [pageTitle, setPageTitle] = useState("Proposal Title - Opportunity Name");

  // Get pre-filled data from navigation state
  const prefilledData = location.state?.prefilledData;

  useEffect(() => {
    if (prefilledData) {
      // Update page title based on the source and creation context
      const { source, creationContext } = prefilledData;
      if (creationContext?.title) {
        if (source === "template") {
          setPageTitle(`${creationContext.title} - From Template`);
        } else if (source === "proposal") {
          if (creationContext.type === "editing") {
            setPageTitle(`Edit: ${creationContext.title}`);
          } else {
            setPageTitle(`${creationContext.title} - From Previous Proposal`);
          }
        }
      }
    }
  }, [prefilledData]);

  const handleBack = () => {
    // Navigate back to proposal management
    navigate("/dashboard/fundraising/proposal-management");
  };

  const getSubtitleText = () => {
    if (!prefilledData) return null;
    
    const { source, template, proposal, creationContext } = prefilledData;
    
    if (source === "template" && template) {
      return `Using template: ${template.title}`;
    } else if (source === "proposal" && proposal) {
      if (creationContext?.type === "editing") {
        return `Continue editing proposal`;
      } else {
        return `Based on proposal: ${proposal.name}`;
      }
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Proposal
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {pageTitle}
              </h1>
              {getSubtitleText() && (
                <p className="text-sm text-gray-600">
                  {getSubtitleText()}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={showSubmissionTracker} onOpenChange={setShowSubmissionTracker}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Submission Tracker
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Submission Tracker</DialogTitle>
                </DialogHeader>
                <SubmissionTrackerDialog />
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save
            </Button>
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
              Submit
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        <div className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-6 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="narrative">Narrative</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
              <TabsTrigger value="logframe">Logframe</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>

            <div className="h-[calc(100%-60px)] overflow-auto">
              <TabsContent value="overview" className="mt-0 h-full">
                <ProposalOverviewTab prefilledData={prefilledData} />
              </TabsContent>
              <TabsContent value="narrative" className="mt-0 h-full">
                <ProposalNarrativeTab prefilledData={prefilledData} />
              </TabsContent>
              <TabsContent value="budget" className="mt-0 h-full">
                <ProposalBudgetTab prefilledData={prefilledData} />
              </TabsContent>
              <TabsContent value="logframe" className="mt-0 h-full">
                <ProposalLogframeTab prefilledData={prefilledData} />
              </TabsContent>
              <TabsContent value="attachments" className="mt-0 h-full">
                <ProposalAttachmentTab prefilledData={prefilledData} />
              </TabsContent>
              <TabsContent value="team" className="mt-0 h-full">
                <ProposalTeamTab prefilledData={prefilledData} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="w-80 bg-white border-l border-gray-200 p-6 space-y-6">
          <ProposalCommentsSection />
          <ProposalVersionHistory />
        </div>
      </div>
    </div>
  );
};

export default ManualProposalCreation;
