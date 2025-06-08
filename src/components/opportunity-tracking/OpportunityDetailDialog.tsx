import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import AddNoteDialog from "./AddNoteDialog";
import AddFileDialog from "./AddFileDialog";
import AddTaskDialog from "./AddTaskDialog";
import { Opportunity } from "@/types/opportunity";
import { useToast } from "@/hooks/use-toast";

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
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

const OpportunityDetailDialog: React.FC<OpportunityDetailDialogProps> = ({
  opportunity,
  isOpen,
  onClose,
}) => {
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [showAddFileDialog, setShowAddFileDialog] = useState(false);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const { toast } = useToast();

  if (!opportunity) return null;

  // Status color mapping matching Kanban headers
  const getStatusColor = (status: string) => {
    const colors = {
      "To Review": { bg: "bg-[#e0d8e6]", text: "text-[#938b97]" },
      "In Progress": { bg: "bg-[#f9dfc8]", text: "text-[#e59346]" },
      Submitted: { bg: "bg-[#dcd6f7]", text: "text-[#4f46e5]" },
      Awarded: { bg: "bg-[#dbfae7]", text: "text-[#09c127]" },
      Declined: { bg: "bg-[#fddddd]", text: "text-[#fa2d2d]" },
    };
    return colors[status] || { bg: "bg-gray-200", text: "text-gray-800" };
  };

  const statusColor = getStatusColor(opportunity.status);

  const statusTimeline = [
    {
      status: "Opportunity Identified",
      date: opportunity.createdAt,
      completed: true,
    },
    {
      status: "Proposal Submitted",
      date: opportunity.updatedAt,
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
    setNotes([...notes, note]);
    toast({
      title: "Note Added",
      description: "Your note has been added successfully.",
    });
  };

  const handleAddFile = (file: any) => {
    setFiles([...files, file]);
    toast({
      title: "File Uploaded",
      description: "Your file has been uploaded successfully.",
    });
  };

  const handleAddTask = (task: any) => {
    setTasks([...tasks, task]);
    toast({
      title: "Task Created",
      description: "New task has been created successfully.",
    });
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
            <DialogTitle className="text-xl font-bold mb-4 text-black">
              {opportunity.title}
            </DialogTitle>
            <div className="flex items-center gap-3">
              <Badge
                className={`${statusColor.bg} ${statusColor.text} rounded-md flex items-center justify-center p-2 px-5`}
              >
                {opportunity.status}
              </Badge>
            </div>
          </DialogHeader>
          <div className="mt-6">
            <div className="grid grid-cols-4 gap-6">
              {/* Left Column */}
              <div className="col-span-2 space-y-6">
                <DonorProfileCard
                  donorName={opportunity.donorName}
                  contactEmail={opportunity.contactEmail}
                  contactPhone={opportunity.contactPhone}
                  createdAt={opportunity.createdAt}
                  deadline={opportunity.deadline}
                  sector={opportunity.sector}
                  sectionHeight={SECTION_HEIGHT}
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
                  files={files}
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
