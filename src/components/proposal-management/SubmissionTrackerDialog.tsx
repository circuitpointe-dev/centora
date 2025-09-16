import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, CheckCircle2, Clock, Plus, X } from "lucide-react";
import { useSubmissionTracker, useCreateSubmissionMilestone, useUpdateSubmissionMilestone } from "@/hooks/useSubmissionTracker";
import { format } from "date-fns";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposalId: string | null;
};

const SubmissionTrackerDialog: React.FC<Props> = ({ open, onOpenChange, proposalId }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    milestone_name: "",
    due_date: "",
    notes: "",
  });

  const { data: milestones = [], isLoading } = useSubmissionTracker(proposalId || "");
  const createMilestone = useCreateSubmissionMilestone();
  const updateMilestone = useUpdateSubmissionMilestone();

  const handleAddMilestone = () => {
    if (newMilestone.milestone_name.trim() && proposalId) {
      createMilestone.mutate({
        proposal_id: proposalId,
        milestone_name: newMilestone.milestone_name,
        due_date: newMilestone.due_date || undefined,
        notes: newMilestone.notes || undefined,
      }, {
        onSuccess: () => {
          setNewMilestone({ milestone_name: "", due_date: "", notes: "" });
          setShowAddForm(false);
        }
      });
    }
  };

  const handleMarkComplete = (milestone: any) => {
    const isCompleted = milestone.status === 'completed';
    updateMilestone.mutate({
      id: milestone.id,
      proposal_id: milestone.proposal_id,
      status: isCompleted ? 'pending' : 'completed',
      completed_date: isCompleted ? null : new Date().toISOString().split('T')[0],
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Submission Tracker
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add Milestone Button */}
          {!showAddForm && (
            <Button 
              onClick={() => setShowAddForm(true)}
              className="w-full"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Milestone
            </Button>
          )}

          {/* Add Milestone Form */}
          {showAddForm && (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Add New Milestone</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setShowAddForm(false);
                    setNewMilestone({ milestone_name: "", due_date: "", notes: "" });
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="milestone_name">Milestone Name</Label>
                  <Input
                    id="milestone_name"
                    value={newMilestone.milestone_name}
                    onChange={(e) => setNewMilestone({ ...newMilestone, milestone_name: e.target.value })}
                    placeholder="e.g., Draft submission"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="due_date">Due Date (Optional)</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={newMilestone.due_date}
                    onChange={(e) => setNewMilestone({ ...newMilestone, due_date: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={newMilestone.notes}
                  onChange={(e) => setNewMilestone({ ...newMilestone, notes: e.target.value })}
                  placeholder="Additional details about this milestone"
                  rows={2}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleAddMilestone}
                  disabled={!newMilestone.milestone_name.trim() || createMilestone.isPending}
                >
                  {createMilestone.isPending ? "Adding..." : "Add Milestone"}
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Milestones List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center text-gray-500 py-8">Loading milestones...</div>
            ) : milestones.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No milestones yet. Add your first milestone to start tracking progress.
              </div>
            ) : (
              milestones.map((milestone) => (
                <div key={milestone.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{milestone.milestone_name}</h4>
                        <Badge className={getStatusColor(milestone.status)}>
                          {getStatusIcon(milestone.status)}
                          <span className="ml-1 capitalize">{milestone.status}</span>
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {milestone.due_date && (
                          <span>Due: {format(new Date(milestone.due_date), 'MMM dd, yyyy')}</span>
                        )}
                        {milestone.completed_date && (
                          <span>Completed: {format(new Date(milestone.completed_date), 'MMM dd, yyyy')}</span>
                        )}
                        <span>Created by: {milestone.user?.full_name || 'Unknown'}</span>
                      </div>
                      
                      {milestone.notes && (
                        <p className="text-sm text-gray-600">{milestone.notes}</p>
                      )}
                    </div>
                    
                    <Button
                      variant={milestone.status === 'completed' ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => handleMarkComplete(milestone)}
                      disabled={updateMilestone.isPending}
                    >
                      {milestone.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionTrackerDialog;