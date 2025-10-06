import React, { useState } from "react";
import { useProposals, useUpdateProposal, useDeleteProposal } from "@/hooks/useProposals";
import { useUsers } from "@/hooks/useUsers";
import { useAddProposalTeamMember } from "@/hooks/useProposalTeamMembers";
import { Search, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProposalRowActions from "./ProposalRowActions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ProposalTable: React.FC<{
  onOpenCreate: () => void;
}> = ({ onOpenCreate }) => {
  const navigate = useNavigate();
  const { data: proposals = [], isLoading } = useProposals();
  const updateProposalMutation = useUpdateProposal();
  const deleteProposalMutation = useDeleteProposal();
  const addTeamMemberMutation = useAddProposalTeamMember();
  const { data: users = [] } = useUsers({ pageSize: 50 });

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
  const [teamMemberName, setTeamMemberName] = useState("");
  const [teamMemberRole, setTeamMemberRole] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilterDialog, setShowFilterDialog] = useState(false);

  // For delete confirmation dialog
  const proposalToDelete = deleteId ? proposals.find(p => p.id === deleteId) : undefined;

  // Filtering and sorting (newest first)
  const filtered = proposals
    .filter((p) => {
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by created_at descending (newest first)
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    });

  // Reviewer update
  const handleReviewerChange = async (proposalId: string, newReviewer: string) => {
    try {
      await updateProposalMutation.mutateAsync({
        id: proposalId,
        reviewer: newReviewer
      });
    } catch (error) {
      console.error('Failed to update reviewer:', error);
    }
  };

  // Action menu handlers
  const handleDelete = (id: string) => setDeleteId(id);

  const handleEdit = (id: string) => {
    const proposalToEdit = proposals.find(p => p.id === id);
    if (proposalToEdit) {
      // Navigate to manual proposal creation with pre-filled data
      navigate("/dashboard/fundraising/manual-proposal-creation", {
        state: {
          prefilledData: {
            source: "proposal",
            proposal: proposalToEdit,
            creationContext: {
              title: proposalToEdit.name,
              description: `Continue working on ${proposalToEdit.name}`,
              type: "editing"
            }
          }
        }
      });
    }
  };

  // Team member handlers
  const handleAddTeamMember = (proposalId: string) => {
    setSelectedProposalId(proposalId);
    setShowTeamDialog(true);
  };

  const handleAddTeamMemberSubmit = async () => {
    if (!selectedProposalId || !teamMemberName.trim() || !teamMemberRole.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await addTeamMemberMutation.mutateAsync({
        proposal_id: selectedProposalId,
        name: teamMemberName.trim(),
        role: teamMemberRole.trim(),
      });

      setShowTeamDialog(false);
      setTeamMemberName("");
      setTeamMemberRole("");
      setSelectedProposalId(null);
    } catch (error) {
      console.error('Failed to add team member:', error);
    }
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (proposalToDelete) {
      try {
        await deleteProposalMutation.mutateAsync(proposalToDelete.id);
        setDeleteId(null);
      } catch (error) {
        console.error('Failed to delete proposal:', error);
      }
    }
  };

  // Confirm delete all using edge function for better reliability
  const confirmDeleteAll = async () => {
    setIsDeletingAll(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(
        `https://kspzfifdwfpirgqstzhz.supabase.co/functions/v1/delete-all-proposals`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete proposals');
      }

      toast({
        title: "Success",
        description: `Deleted ${result.deletedProposals} proposals and ${result.deletedTeamMembers} team members`,
      });

      // Refresh the proposals list
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete all proposals:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete proposals",
        variant: "destructive",
      });
      setIsDeletingAll(false);
      setShowDeleteAllDialog(false);
    }
  };

  // Defensive cleanup
  React.useEffect(() => {
    // If proposal got deleted while dialog open, close dialog
    if (deleteId && !proposals.find(p => p.id === deleteId)) setDeleteId(null);
  }, [proposals, deleteId]);

  return (
    <div className="bg-white mt-12 pt-8 pb-4 px-6 rounded-[5px] shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-lg font-medium text-[#383839]">
            Proposals Under Development
          </div>
          {proposals.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteAllDialog(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All
            </Button>
          )}
        </div>
        <div className="flex gap-4">
          {/* Search */}
          <div className="flex items-center gap-2 bg-[#f4f6f9] border border-gray-200 rounded px-3 py-2">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              placeholder="Search proposal"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm"
            />
          </div>
          {/* Filter */}
          <button
            onClick={() => setShowFilterDialog(true)}
            className="flex items-center gap-2 border border-gray-200 rounded px-4 py-2 bg-white hover:bg-gray-50 text-[15px] text-[#383839a6] font-medium"
          >
            <span className="sr-only">Filter</span>
            <svg className="w-5 h-5" fill="none" stroke="#7c3aed" strokeWidth={2} viewBox="0 0 20 20"><path d="M3 3h14M5 7h10M7 11h6M9 15h2" /></svg>
            Filter
            {statusFilter !== "all" && (
              <span className="bg-violet-600 text-white text-xs rounded-full px-2 py-0.5">
                1
              </span>
            )}
          </button>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto mt-7">
        {isLoading ? (
          <div className="py-16 text-center text-gray-400">Loading proposals...</div>
        ) : (
          <table className="min-w-full whitespace-nowrap">
            <thead>
              <tr className="text-[#a172f2] text-base">
                <th className="font-medium text-left py-2 pr-2">Proposal Name</th>
                <th className="font-medium text-left py-2 pr-2">Due Date</th>
                <th className="font-medium text-left py-2 pr-2">Team Members</th>
                <th className="font-medium text-left py-2 pr-2">Reviewer</th>
                <th className="font-medium text-left py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b last:border-0 text-[#383839] text-sm relative">
                  <td className="py-3 pr-2">{row.name}</td>
                  <td className="py-3 pr-2">{row.dueDate}</td>
                  <td className="py-3 pr-2">
                    <div className="flex items-center gap-0.5">
                      {row.team.map((m, ix) =>
                        m.img ? (
                          <img
                            key={ix}
                            src={m.img}
                            alt={m.label}
                            className="w-6 h-6 rounded-full border-2 border-white -ml-2 first:ml-0 last:mr-1 object-cover"
                          />
                        ) : (
                          <div
                            key={ix}
                            className={`${m.bg} text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full border-2 border-white -ml-2 first:ml-0 last:mr-1`}
                          >
                            {m.label}
                          </div>
                        )
                      )}
                      <button
                        onClick={() => handleAddTeamMember(row.id)}
                        className="text-gray-400 hover:text-violet-600 ml-1 font-bold text-lg leading-none transition-colors"
                        title="Add team member"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-3 pr-2 max-w-[180px]">
                    <Select
                      value={row.reviewer}
                      onValueChange={(val) => handleReviewerChange(row.id, val)}
                    >
                      <SelectTrigger className="w-[150px] bg-[#f5f5fa] border border-gray-200 text-[#383839b8]">
                        <SelectValue placeholder="Reviewer" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.length > 0 ? (
                          users.map((user) => (
                            <SelectItem key={user.id} value={user.full_name}>
                              {user.full_name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="Unassigned" disabled>
                            No users available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-3 pr-2 w-14">
                    <ProposalRowActions
                      proposalId={row.id}
                      proposalName={row.name}
                      onEdit={() => handleEdit(row.id)}
                      onDelete={() => handleDelete(row.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {filtered.length === 0 && !isLoading && (
          <div className="py-16 text-center text-gray-400">No proposals found.</div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!proposalToDelete} onOpenChange={o => o ? undefined : setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Proposal?</AlertDialogTitle>
            <AlertDialogDescription>
              This action <strong className="text-red-500">cannot be undone</strong>. Are you sure you want to permanently delete the proposal <span className="font-medium text-gray-700">{proposalToDelete?.name}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-rose-600 text-white hover:bg-rose-700" onClick={confirmDelete}>
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Team Member Dialog */}
      <Dialog open={showTeamDialog} onOpenChange={setShowTeamDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new team member to this proposal.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={teamMemberName}
                onChange={(e) => setTeamMemberName(e.target.value)}
                className="col-span-3"
                placeholder="Enter team member name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Input
                id="role"
                value={teamMemberRole}
                onChange={(e) => setTeamMemberRole(e.target.value)}
                className="col-span-3"
                placeholder="Enter team member role"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowTeamDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddTeamMemberSubmit}
              disabled={addTeamMemberMutation.isPending}
            >
              {addTeamMemberMutation.isPending ? 'Adding...' : 'Add Member'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filter Proposals</DialogTitle>
            <DialogDescription>
              Filter proposals by status and other criteria.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setStatusFilter("all");
                setShowFilterDialog(false);
              }}
            >
              Clear
            </Button>
            <Button onClick={() => setShowFilterDialog(false)}>
              Apply Filter
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete All Confirmation Dialog */}
      <AlertDialog open={showDeleteAllDialog} onOpenChange={(open) => !isDeletingAll && setShowDeleteAllDialog(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Proposals?</AlertDialogTitle>
            <AlertDialogDescription>
              This action <strong className="text-red-500">cannot be undone</strong>. Are you sure you want to permanently delete <strong>all {proposals.length} proposals</strong> in your organization?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteAllDialog(false)} disabled={isDeletingAll}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-rose-600 text-white hover:bg-rose-700" 
              onClick={confirmDeleteAll}
              disabled={isDeletingAll}
            >
              {isDeletingAll ? "Deleting..." : "Yes, Delete All"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProposalTable;
