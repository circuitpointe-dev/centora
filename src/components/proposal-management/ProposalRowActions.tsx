
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface ProposalRowActionsProps {
  proposalId: string;
  proposalName: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProposalRowActions: React.FC<ProposalRowActionsProps> = ({
  proposalId,
  proposalName,
  onEdit,
  onDelete
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(proposalId);
    setDeleteConfirm(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500 hover:text-gray-700 p-1 h-auto"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white">
          <DropdownMenuItem
            onClick={() => onEdit(proposalId)}
            className="flex items-center gap-2.5 p-2.5 cursor-pointer hover:bg-gray-100"
          >
            <Edit className="w-4 h-4" />
            <span className="text-[#38383899] text-sm font-normal">
              Edit
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDeleteClick}
            className="flex items-center gap-2.5 p-2.5 cursor-pointer hover:bg-gray-100"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-[#38383899] text-sm font-normal">
              Delete
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={deleteConfirm}
        onOpenChange={setDeleteConfirm}
        title="Delete Proposal"
        description={`Are you sure you want to delete "${proposalName}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default ProposalRowActions;
