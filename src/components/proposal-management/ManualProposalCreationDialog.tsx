
import React, { useState, useEffect } from "react";
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
import SubmissionTrackerDialog from "./SubmissionTrackerDialog";
import { useCreateProposal, useUpdateProposal } from "@/hooks/useProposals";
import { useProposalTeamMembers, useAddProposalTeamMember, useRemoveProposalTeamMember } from "@/hooks/useProposalTeamMembers";
import { useProposalComments, useAddProposalComment } from "@/hooks/useProposalComments";
import { useOpportunities } from "@/hooks/useOpportunities";
import { useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

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
  const location = useLocation();
  const prefilledData = location.state?.prefilledData;
  const isEditing = prefilledData?.source === 'proposal' && prefilledData?.creationContext?.type === 'editing';
  const [proposalId, setProposalId] = useState<string | null>(isEditing ? prefilledData.proposal.id : null);
  const [activeTab, setActiveTab] = useState("overview");

  // Overview tab states
  const [overviewFields, setOverviewFields] = useState<CustomField[]>([]);
  const [showOverviewFieldDialog, setShowOverviewFieldDialog] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [objectives, setObjectives] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [hydrated, setHydrated] = useState<boolean>(false);

  // Template application (kept for compatibility)
  const [appliedTemplate, setAppliedTemplate] = useState<any>(prefilledData?.template || null);

  // Narrative tab states
  const [narrativeFields, setNarrativeFields] = useState<CustomField[]>([]);
  const [showNarrativeFieldDialog, setShowNarrativeFieldDialog] = useState(false);

  // Budget tab states
  const [budgetCurrency, setBudgetCurrency] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");

  // Logframe tab states
  const [logframeFields, setLogframeFields] = useState<CustomField[]>([]);
  const [showLogframeFieldDialog, setShowLogframeFieldDialog] = useState(false);

  // Apply prefilled data when available (editing or template)
  useEffect(() => {
    if (!hydrated && prefilledData) {
      console.log('[ManualProposalCreationDialog] Loading proposal data:', prefilledData);
      
      // Handle editing existing proposal
      if (isEditing && prefilledData.proposal) {
        const proposal = prefilledData.proposal;
        console.log('[ManualProposalCreationDialog] Editing proposal:', proposal);
        
        const reusedOverview: CustomField[] = proposal.overview_fields || [];
        
        // Extract Summary and Objectives from overview_fields
        const summaryField = reusedOverview.find(f => 
          f.id === 'summary' || f.name?.toLowerCase() === 'summary'
        );
        const objectivesField = reusedOverview.find(f => 
          f.id === 'objectives' || f.name?.toLowerCase() === 'objectives'
        );
        
        // Filter out summary and objectives from overview fields to avoid duplication
        const filteredOverviewFields = reusedOverview.filter(f => 
          f.id !== 'summary' && f.id !== 'objectives' && 
          f.name?.toLowerCase() !== 'summary' && f.name?.toLowerCase() !== 'objectives'
        );
        
        setOverviewFields(filteredOverviewFields);
        setNarrativeFields(proposal.narrative_fields || []);
        setLogframeFields(proposal.logframe_fields || []);
        setSummary(summaryField?.value || '');
        setObjectives(objectivesField?.value || '');
        
        // Parse and format the due date for input[type="date"]
        let formattedDueDate = '';
        const rawDueDate = proposal.due_date || proposal.dueDate;
        if (rawDueDate && rawDueDate !== 'No due date') {
          try {
            const date = new Date(rawDueDate);
            if (!isNaN(date.getTime())) {
              formattedDueDate = date.toISOString().split('T')[0];
            }
          } catch (e) {
            console.warn('[ManualProposalCreationDialog] Invalid due date:', rawDueDate);
          }
        }
        setDueDate(formattedDueDate);
        console.log('[ManualProposalCreationDialog] Due date set to:', formattedDueDate);
        
        setBudgetCurrency(proposal.budget_currency || 'USD');
        setBudgetAmount(proposal.budget_amount?.toString() || '');
        
        console.log('[ManualProposalCreationDialog] Loaded fields:', {
          overviewFields: filteredOverviewFields.length,
          narrativeFields: proposal.narrative_fields?.length || 0,
          logframeFields: proposal.logframe_fields?.length || 0,
          summary: summaryField?.value ? 'Yes' : 'No',
          objectives: objectivesField?.value ? 'Yes' : 'No',
          dueDate: formattedDueDate,
        });
        
        setHydrated(true);
      }
      // Handle template
      else if (prefilledData.template) {
        setOverviewFields([
          { id: '1', name: 'Project Title', value: prefilledData.template.title || '' },
          { id: '2', name: 'Project Description', value: prefilledData.template.description || '' },
          { id: '3', name: 'Project Duration', value: '' },
          { id: '4', name: 'Project Location', value: '' }
        ]);
        setNarrativeFields([
          { id: '1', name: 'Problem Statement', value: '' },
          { id: '2', name: 'Project Objectives', value: '' },
          { id: '3', name: 'Methodology', value: '' },
          { id: '4', name: 'Expected Outcomes', value: '' }
        ]);
        setLogframeFields([
          { id: '1', name: 'Goal', value: '' },
          { id: '2', name: 'Purpose', value: '' },
          { id: '3', name: 'Outputs', value: '' },
          { id: '4', name: 'Activities', value: '' }
        ]);
        setSummary('Brief overview of the project scope, beneficiaries, and expected results.');
        setObjectives('List 3-5 measurable objectives aligned with donor priorities.');
        setHydrated(true);
      } else {
        setHydrated(true);
      }
    }
  }, [prefilledData, hydrated, isEditing]);


  // Team tab states
  const [showTeamMemberDialog, setShowTeamMemberDialog] = useState(false);

  // Submission tracker dialog state
  const [showSubmissionTrackerDialog, setShowSubmissionTrackerDialog] = useState(false);

  // Hooks
  const createProposal = useCreateProposal({ silent: true }); // Silent auto-creation
  const updateProposal = useUpdateProposal({ silent: true }); // Silent auto-save
  const explicitUpdateProposal = useUpdateProposal(); // For explicit saves with toast
  const { data: opportunities = [] } = useOpportunities();
  const { data: teamMembers = [], refetch: refetchTeamMembers } = useProposalTeamMembers(proposalId || "");
  const addTeamMember = useAddProposalTeamMember();
  const removeTeamMember = useRemoveProposalTeamMember();
  const { data: comments = [] } = useProposalComments(proposalId || "");
  const addComment = useAddProposalComment();

  // Auto-save when fields change (only when editing)
  useEffect(() => {
    if (proposalId && hydrated && isEditing) {
      const mergedOverview = [
        { id: 'summary', name: 'Summary', value: summary },
        { id: 'objectives', name: 'Objectives', value: objectives },
        ...overviewFields,
      ];

      const saveData = {
        id: proposalId,
        overview_fields: mergedOverview,
        narrative_fields: narrativeFields,
        budget_currency: budgetCurrency,
        budget_amount: budgetAmount ? parseFloat(budgetAmount) : undefined,
        logframe_fields: logframeFields,
        dueDate: dueDate || undefined,
      };

      // Debounce the save
      const timeoutId = setTimeout(() => {
        updateProposal.mutate(saveData);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [summary, objectives, overviewFields, narrativeFields, budgetCurrency, budgetAmount, logframeFields, dueDate, proposalId, hydrated, isEditing]);

  // Create initial proposal if it doesn't exist (not when editing)
  useEffect(() => {
    if (open && !proposalId && !isEditing && hydrated) {
      const selectedOpportunity = opportunities.find(opp => opp.title === opportunityName);

      // Get opportunity from creation context if available
      const contextOpportunityId = prefilledData?.creationContext?.opportunityId;
      const finalOpportunityId = contextOpportunityId || selectedOpportunity?.id;

      // Pre-populate fields based on source
      const mergedOverview = [
        { id: 'summary', name: 'Summary', value: summary },
        { id: 'objectives', name: 'Objectives', value: objectives },
        ...overviewFields,
      ];

      let initialFields = {
        overview_fields: mergedOverview,
        narrative_fields: narrativeFields,
        logframe_fields: logframeFields,
      };

      // If coming from a template, ensure we don't create until fields are populated
      if (prefilledData?.template && initialFields.overview_fields.length === 0) {
        return;
      }

      createProposal.mutate({
        name: (prefilledData?.creationContext?.title || prefilledData?.proposal?.title || proposalTitle) + (prefilledData?.proposal ? ' (Copy)' : ''),
        title: (prefilledData?.creationContext?.title || prefilledData?.proposal?.title || proposalTitle) + (prefilledData?.proposal ? ' (Copy)' : ''),
        opportunity_id: finalOpportunityId,
        ...initialFields,
        budget_currency: budgetCurrency || 'USD',
        budget_amount: budgetAmount ? parseFloat(budgetAmount) : undefined,
        dueDate: dueDate || undefined,
        attachments: [],
        submission_status: 'draft'
      }, {
        onSuccess: (proposal) => {
          setProposalId(proposal.id);
        }
      });
    }
  }, [open, proposalId, proposalTitle, opportunityName, opportunities, prefilledData, summary, objectives, overviewFields, narrativeFields, logframeFields, budgetCurrency, budgetAmount, dueDate, hydrated, isEditing]);

  // Handle save functionality
  const handleSave = () => {
    if (proposalId) {
      const mergedOverview = [
        { id: 'summary', name: 'Summary', value: summary },
        { id: 'objectives', name: 'Objectives', value: objectives },
        ...overviewFields,
      ];
      
      explicitUpdateProposal.mutate({
        id: proposalId,
        overview_fields: mergedOverview,
        narrative_fields: narrativeFields,
        budget_currency: budgetCurrency,
        budget_amount: budgetAmount ? parseFloat(budgetAmount) : undefined,
        logframe_fields: logframeFields,
        submission_status: 'draft',
        dueDate: dueDate || undefined,
      });
    }
  };

  // Handle submit functionality
  const handleSubmit = () => {
    if (proposalId) {
      const mergedOverview = [
        { id: 'summary', name: 'Summary', value: summary },
        { id: 'objectives', name: 'Objectives', value: objectives },
        ...overviewFields,
      ];
      
      explicitUpdateProposal.mutate({
        id: proposalId,
        overview_fields: mergedOverview,
        narrative_fields: narrativeFields,
        budget_currency: budgetCurrency,
        budget_amount: budgetAmount ? parseFloat(budgetAmount) : undefined,
        logframe_fields: logframeFields,
        submission_status: 'submitted',
        status: 'Under Review',
        dueDate: dueDate || undefined,
      }, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Proposal submitted for review successfully",
          });
        }
      });
    }
  };

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
    if (proposalId) {
      addTeamMember.mutate({
        proposal_id: proposalId,
        user_id: member.id,
        name: member.name,
        role: member.role,
      }, {
        onSuccess: () => {
          refetchTeamMembers();
        }
      });
    }
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
    if (proposalId) {
      removeTeamMember.mutate({
        id: memberId,
        proposal_id: proposalId,
      }, {
        onSuccess: () => {
          refetchTeamMembers();
        }
      });
    }
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
      <LargeSideDialogContent className="bg-card">
        <ProposalDialogHeader
          proposalTitle={proposalTitle}
          opportunityName={opportunityName}
          onSave={handleSave}
          onSubmit={handleSubmit}
          onSubmissionTracker={() => setShowSubmissionTrackerDialog(true)}
          isSaving={explicitUpdateProposal.isPending}
          isSubmitting={explicitUpdateProposal.isPending}
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Column */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-6 bg-muted rounded-none border-b">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="data-[state=active]:bg-card data-[state=active]:border-b-2 data-[state=active]:border-violet-600 rounded-none"
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
                    summaryValue={summary}
                    objectivesValue={objectives}
                    onSummaryChange={setSummary}
                    onObjectivesChange={setObjectives}
                    dueDateValue={dueDate}
                    onDueDateChange={setDueDate}
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
                  <AttachmentsTabContent proposalId={proposalId} />
                </TabsContent>

                <TabsContent value="team" className="space-y-6 mt-0">
                  <TeamTabContent
                    teamMembers={teamMembers.map(tm => ({
                      id: tm.id,
                      name: tm.name,
                      role: tm.role
                    }))}
                    onAddMember={() => setShowTeamMemberDialog(true)}
                    onRemoveMember={handleRemoveTeamMember}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <ProposalDialogSidebar
            proposalId={proposalId}
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

        <SubmissionTrackerDialog
          open={showSubmissionTrackerDialog}
          onOpenChange={setShowSubmissionTrackerDialog}
          proposalId={proposalId}
        />
      </LargeSideDialogContent>
    </LargeSideDialog>
  );
};

export default ManualProposalCreationDialog;
