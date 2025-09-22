import React, { useState } from "react";
import { useProposals, useUpdateProposal, useDeleteProposal } from "@/hooks/useProposals";
import { Search } from "lucide-react";
import ProposalRowActions from "./ProposalRowActions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // For delete confirmation dialog
  const proposalToDelete = deleteId ? proposals.find(p => p.id === deleteId) : undefined;

  // Filtering
  const filtered = !search
    ? proposals
    : proposals.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );

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
      navigate("/modules/fundraising/proposal-creation", {
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

  // Defensive cleanup
  React.useEffect(() => {
    // If proposal got deleted while dialog open, close dialog
    if (deleteId && !proposals.find(p => p.id === deleteId)) setDeleteId(null);
  }, [proposals, deleteId]);

  return (
    <div className="bg-white mt-12 pt-8 pb-4 px-6 rounded-[5px] shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-lg font-medium text-[#383839] mb-3 md:mb-0">
          Proposals Under Development
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
          <button className="flex items-center gap-2 border border-gray-200 rounded px-4 py-2 bg-white hover:bg-gray-50 text-[15px] text-[#383839a6] font-medium">
            <span className="sr-only">Filter</span>
            <svg className="w-5 h-5" fill="none" stroke="#7c3aed" strokeWidth={2} viewBox="0 0 20 20"><path d="M3 3h14M5 7h10M7 11h6M9 15h2" /></svg>
            Filter
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
                      <span className="text-gray-300 ml-1 font-bold text-lg leading-none">+</span>
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
                        <SelectItem value="Winifred John">Winifred John</SelectItem>
                        <SelectItem value="Somachi Okafor">Somachi Okafor</SelectItem>
                        <SelectItem value="Chioma Ike">Chioma Ike</SelectItem>
                        <SelectItem value="Richard Nwamadi">Richard Nwamadi</SelectItem>
                        <SelectItem value="Amina Yusuf">Amina Yusuf</SelectItem>
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
    </div>
  );
};

export default ProposalTable;
