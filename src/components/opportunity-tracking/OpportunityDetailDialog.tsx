import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import AddNoteDialog from "./AddNoteDialog";
import AddFileDialog from "./AddFileDialog";
import AddTaskDialog from "./AddTaskDialog";
import { DatabaseOpportunity } from "@/hooks/useOpportunities";
import { useToast } from "@/hooks/use-toast";
import { useOpportunityNotes } from "@/hooks/useOpportunityNotes";
import { useOpportunityTasks } from "@/hooks/useOpportunityTasks";
import { useOpportunityAttachments } from "@/hooks/useOpportunityAttachments";

// Section subcomponents
import DonorProfileCard from "./DonorProfileCard";
import NotesCard from "./NotesCard";
import AttachmentsCard from "./AttachmentsCard";
import TasksCard from "./TasksCard";
import TimelineCard from "./TimelineCard";
import QuickActionsCard from "./QuickActionsCard";

// Fixed section height for uniformity
const SECTION_HEIGHT = "h-72";

interface OpportunityDetailDialogProps {
  opportunity: DatabaseOpportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

const OpportunityDetailDialog: React.FC<OpportunityDetailDialogProps> = ({
  opportunity,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [showAddFileDialog, setShowAddFileDialog] = useState(false);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const { toast } = useToast();
  
  // Fetch data from backend
  const { data: notes = [] } = useOpportunityNotes(opportunity?.id || "");
  const { data: tasks = [] } = useOpportunityTasks(opportunity?.id || "");
  const { data: attachments = [] } = useOpportunityAttachments(opportunity?.id || "");

  if (!opportunity) return null;

  const getStatusTextColor = (status: string) => {
    const colors = {
      "To Review": "text-yellow-600",
      "In Progress": "text-orange-600",
      Submitted: "text-blue-600",
      Awarded: "text-green-600",
      Declined: "text-red-600",
    };
    return colors[status] || "text-gray-600";
  };

  const statusTimeline = [
    {
      status: "Opportunity Identified",
      date: opportunity.created_at,
      completed: true,
    },
    {
      status: "Proposal Submitted",
      date: opportunity.updated_at,
      completed:
        opportunity.status === "Submitted" ||
        opportunity.status === "Awarded" ||
        opportunity.status === "Declined",
    },
    {
      status: "Under Review",
      date: "",
      completed:
        opportunity.status === "Awarded" || opportunity.status === "Declined",
    },
    {
      status: opportunity.status === "Awarded" ? "Approved" : "Declined",
      date: "",
      completed:
        opportunity.status === "Awarded" || opportunity.status === "Declined",
    },
  ];

  const handleAddNote = (note: any) => {
    // Backend integration will handle the update via React Query
  };

  const handleAddFile = (file: any) => {
    // Backend integration will handle the update via React Query
  };

  const handleAddTask = (task: any) => {
    // Backend integration will handle the update via React Query
  };

  const handleViewDonorProfile = () => {
    navigate(`/dashboard/fundraising/donor-management?donor=${opportunity.donor?.id}`);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className={
            "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 grid w-full max-w-3xl bg-white rounded-lg shadow-lg border p-6 max-h-[90vh] overflow-y-auto"
          }
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-2 text-black">
              {opportunity.title}
            </DialogTitle>
            <div className={`text-sm font-medium ${getStatusTextColor(opportunity.status)}`}>
              {opportunity.status}
            </div>
          </DialogHeader>
          <div className="mt-6">
            <div className="grid grid-cols-4 gap-6">
              {/* Left Column */}
              <div className="col-span-2 space-y-6">
                <DonorProfileCard
                  donorName={opportunity.donor?.name || 'Unknown Donor'}
                  createdAt={opportunity.created_at}
                  deadline={opportunity.deadline}
                  sector={opportunity.sector}
                  sectionHeight={SECTION_HEIGHT}
                  onViewProfile={handleViewDonorProfile}
                />
                <NotesCard
                  notes={notes}
                  onAddNote={() => setShowAddNoteDialog(true)}
                  sectionHeight={SECTION_HEIGHT}
                />
                <TasksCard
                  tasks={tasks}
                  onAddTask={() => setShowAddTaskDialog(true)}
                  sectionHeight={SECTION_HEIGHT}
                />
              </div>

              {/* Right Column */}
              <div className="col-span-2 space-y-6">
                <TimelineCard
                  statusTimeline={statusTimeline}
                  sectionHeight={SECTION_HEIGHT}
                />
                <AttachmentsCard
                  files={attachments}
                  onAddFile={() => setShowAddFileDialog(true)}
                  sectionHeight={SECTION_HEIGHT}
                />
                <QuickActionsCard />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Dialog for adding notes */}
      <AddNoteDialog
        isOpen={showAddNoteDialog}
        onClose={() => setShowAddNoteDialog(false)}
        onAddNote={handleAddNote}
        opportunityId={opportunity.id}
      />

      {/* Dialog for adding files */}
      <AddFileDialog
        isOpen={showAddFileDialog}
        onClose={() => setShowAddFileDialog(false)}
        onAddFile={handleAddFile}
        opportunityId={opportunity.id}
      />

      {/* Dialog for adding tasks */}
      <AddTaskDialog
        isOpen={showAddTaskDialog}
        onClose={() => setShowAddTaskDialog(false)}
        onAddTask={handleAddTask}
        opportunityId={opportunity.id}
      />
    </>
  );
};

export default OpportunityDetailDialog;
