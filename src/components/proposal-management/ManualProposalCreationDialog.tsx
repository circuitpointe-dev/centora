
import React, { useState } from "react";
import {
  LargeSideDialog,
  LargeSideDialogContent,
} from "@/components/ui/large-side-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProposalDialogHeader from "./ProposalDialogHeader";
import ProposalDialogSidebar from "./ProposalDialogSidebar";
import OverviewTabContent from "./OverviewTabContent";
import NarrativeTabContent from "./NarrativeTabContent";
import BudgetTabContent from "./BudgetTabContent";
import LogframeTabContent from "./LogframeTabContent";
import AttachmentsTabContent from "./AttachmentsTabContent";
import TeamTabContent from "./TeamTabContent";
import AddFieldDialog from "./AddFieldDialog";
import AddTeamMemberDialog from "./AddTeamMemberDialog";

type CustomField = {
  id: string;
  name: string;
  value: string;
};

type TeamMember = {
  id: string;
  name: string;
  role: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposalTitle?: string;
  opportunityName?: string;
};

const ManualProposalCreationDialog: React.FC<Props> = ({ 
  open, 
  onOpenChange, 
  proposalTitle = "New Proposal",
  opportunityName = "Selected Opportunity"
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [comment, setComment] = useState("");
  
  // Overview tab states
  const [overviewFields, setOverviewFields] = useState<CustomField[]>([]);
  const [showOverviewFieldDialog, setShowOverviewFieldDialog] = useState(false);
  
  // Narrative tab states
  const [narrativeFields, setNarrativeFields] = useState<CustomField[]>([]);
  const [showNarrativeFieldDialog, setShowNarrativeFieldDialog] = useState(false);
  
  // Budget tab states
  const [budgetCurrency, setBudgetCurrency] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  
  // Logframe tab states
  const [logframeFields, setLogframeFields] = useState<CustomField[]>([]);
  const [showLogframeFieldDialog, setShowLogframeFieldDialog] = useState(false);
  
  // Team tab states
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showTeamMemberDialog, setShowTeamMemberDialog] = useState(false);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "narrative", label: "Narrative" },
    { id: "budget", label: "Budget" },
    { id: "logframe", label: "Logframe" },
    { id: "attachments", label: "Attachments" },
    { id: "team", label: "Team" },
  ];

  const handleAddOverviewField = (fieldName: string) => {
    const newField = {
      id: Date.now().toString(),
      name: fieldName,
      value: ""
    };
    setOverviewFields([...overviewFields, newField]);
  };

  const handleAddNarrativeField = (fieldName: string) => {
    const newField = {
      id: Date.now().toString(),
      name: fieldName,
      value: ""
    };
    setNarrativeFields([...narrativeFields, newField]);
  };

  const handleAddLogframeField = (fieldName: string) => {
    const newField = {
      id: Date.now().toString(),
      name: fieldName,
      value: ""
    };
    setLogframeFields([...logframeFields, newField]);
  };

  const handleAddTeamMember = (member: TeamMember) => {
    setTeamMembers([...teamMembers, member]);
  };

  const handleRemoveField = (fieldId: string, fieldType: 'overview' | 'narrative' | 'logframe') => {
    if (fieldType === 'overview') {
      setOverviewFields(overviewFields.filter(field => field.id !== fieldId));
    } else if (fieldType === 'narrative') {
      setNarrativeFields(narrativeFields.filter(field => field.id !== fieldId));
    } else if (fieldType === 'logframe') {
      setLogframeFields(logframeFields.filter(field => field.id !== fieldId));
    }
  };

  const handleRemoveTeamMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
  };

  const handleFieldValueChange = (fieldId: string, value: string, fieldType: 'overview' | 'narrative' | 'logframe') => {
    if (fieldType === 'overview') {
      setOverviewFields(overviewFields.map(field => 
        field.id === fieldId ? { ...field, value } : field
      ));
    } else if (fieldType === 'narrative') {
      setNarrativeFields(narrativeFields.map(field => 
        field.id === fieldId ? { ...field, value } : field
      ));
    } else if (fieldType === 'logframe') {
      setLogframeFields(logframeFields.map(field => 
        field.id === fieldId ? { ...field, value } : field
      ));
    }
  };

  return (
    <LargeSideDialog open={open} onOpenChange={onOpenChange}>
      <LargeSideDialogContent className="bg-white">
        <ProposalDialogHeader 
          proposalTitle={proposalTitle}
          opportunityName={opportunityName}
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Column */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-6 bg-gray-50 rounded-none border-b">
                {tabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-violet-600 rounded-none"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex-1 overflow-auto p-6">
                <TabsContent value="overview" className="space-y-6 mt-0">
                  <OverviewTabContent
                    overviewFields={overviewFields}
                    onAddField={() => setShowOverviewFieldDialog(true)}
                    onRemoveField={(fieldId) => handleRemoveField(fieldId, 'overview')}
                    onFieldValueChange={(fieldId, value) => handleFieldValueChange(fieldId, value, 'overview')}
                  />
                </TabsContent>

                <TabsContent value="narrative" className="space-y-6 mt-0">
                  <NarrativeTabContent
                    narrativeFields={narrativeFields}
                    onAddField={() => setShowNarrativeFieldDialog(true)}
                    onRemoveField={(fieldId) => handleRemoveField(fieldId, 'narrative')}
                    onFieldValueChange={(fieldId, value) => handleFieldValueChange(fieldId, value, 'narrative')}
                  />
                </TabsContent>

                <TabsContent value="budget" className="space-y-6 mt-0">
                  <BudgetTabContent
                    budgetCurrency={budgetCurrency}
                    budgetAmount={budgetAmount}
                    onCurrencyChange={setBudgetCurrency}
                    onAmountChange={setBudgetAmount}
                  />
                </TabsContent>

                <TabsContent value="logframe" className="space-y-6 mt-0">
                  <LogframeTabContent
                    logframeFields={logframeFields}
                    onAddField={() => setShowLogframeFieldDialog(true)}
                    onRemoveField={(fieldId) => handleRemoveField(fieldId, 'logframe')}
                    onFieldValueChange={(fieldId, value) => handleFieldValueChange(fieldId, value, 'logframe')}
                  />
                </TabsContent>

                <TabsContent value="attachments" className="space-y-6 mt-0">
                  <AttachmentsTabContent />
                </TabsContent>

                <TabsContent value="team" className="space-y-6 mt-0">
                  <TeamTabContent
                    teamMembers={teamMembers}
                    onAddMember={() => setShowTeamMemberDialog(true)}
                    onRemoveMember={handleRemoveTeamMember}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <ProposalDialogSidebar 
            comment={comment}
            onCommentChange={setComment}
          />
        </div>

        {/* Dialogs */}
        <AddFieldDialog
          open={showOverviewFieldDialog}
          onOpenChange={setShowOverviewFieldDialog}
          onAddField={handleAddOverviewField}
        />
        
        <AddFieldDialog
          open={showNarrativeFieldDialog}
          onOpenChange={setShowNarrativeFieldDialog}
          onAddField={handleAddNarrativeField}
        />
        
        <AddFieldDialog
          open={showLogframeFieldDialog}
          onOpenChange={setShowLogframeFieldDialog}
          onAddField={handleAddLogframeField}
        />
        
        <AddTeamMemberDialog
          open={showTeamMemberDialog}
          onOpenChange={setShowTeamMemberDialog}
          onAddMember={handleAddTeamMember}
        />
      </LargeSideDialogContent>
    </LargeSideDialog>
  );
};

export default ManualProposalCreationDialog;
