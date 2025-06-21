
import React, { useState } from "react";
import { Plus, MoreVertical, Edit, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { disbursementsData, Disbursement } from "../data/disbursementsData";
import { DisbursementDialog } from "./DisbursementDialog";

interface DisbursementsTableProps {
  grantId: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Released': return 'bg-green-100 text-green-800';
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const DisbursementsTable = ({ grantId }: DisbursementsTableProps) => {
  const [disbursements, setDisbursements] = useState(
    disbursementsData.filter(d => d.grantId === grantId)
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDisbursement, setEditingDisbursement] = useState<Disbursement | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [disbursementToDelete, setDisbursementToDelete] = useState<Disbursement | null>(null);

  const handleAddMilestone = () => {
    setEditingDisbursement(null);
    setDialogOpen(true);
  };

  const handleEdit = (disbursement: Disbursement) => {
    setEditingDisbursement(disbursement);
    setDialogOpen(true);
  };

  const handleMarkAsReleased = (disbursement: Disbursement) => {
    setDisbursements(prev =>
      prev.map(d =>
        d.id === disbursement.id
          ? { ...d, status: 'Released' as const }
          : d
      )
    );
  };

  const handleDelete = (disbursement: Disbursement) => {
    setDisbursementToDelete(disbursement);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (disbursementToDelete) {
      setDisbursements(prev =>
        prev.filter(d => d.id !== disbursementToDelete.id)
      );
      setDisbursementToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleSave = (disbursementData: Omit<Disbursement, 'id' | 'grantId'>) => {
    if (editingDisbursement) {
      // Edit existing
      setDisbursements(prev =>
        prev.map(d =>
          d.id === editingDisbursement.id
            ? { ...d, ...disbursementData }
            : d
        )
      );
    } else {
      // Add new
      const newDisbursement: Disbursement = {
        id: Math.max(...disbursements.map(d => d.id), 0) + 1,
        grantId,
        ...disbursementData,
      };
      setDisbursements(prev => [...prev, newDisbursement]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Disbursement Schedule</h2>
        <Button
          onClick={handleAddMilestone}
          className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Milestone
        </Button>
      </div>

      <div className="border border-gray-200 rounded-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-black">Milestone</TableHead>
              <TableHead className="font-semibold text-black">Amount</TableHead>
              <TableHead className="font-semibold text-black">Disbursed On</TableHead>
              <TableHead className="font-semibold text-black">Status</TableHead>
              <TableHead className="font-semibold text-black text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {disbursements.map((disbursement) => (
              <TableRow key={disbursement.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-black">
                  {disbursement.milestone}
                </TableCell>
                <TableCell className="text-gray-600">
                  {formatCurrency(disbursement.amount)}
                </TableCell>
                <TableCell className="text-gray-600">
                  {new Date(disbursement.disbursedOn).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded-sm ${getStatusColor(disbursement.status)}`}>
                    {disbursement.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          <MoreVertical className="h-4 w-4 text-gray-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border-gray-200">
                        <DropdownMenuItem
                          onClick={() => handleEdit(disbursement)}
                          className="flex items-center gap-2 text-gray-700 hover:bg-gray-50"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {disbursement.status === 'Pending' && (
                          <DropdownMenuItem
                            onClick={() => handleMarkAsReleased(disbursement)}
                            className="flex items-center gap-2 text-gray-700 hover:bg-gray-50"
                          >
                            <Check className="h-4 w-4" />
                            Mark as Released
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDelete(disbursement)}
                          className="flex items-center gap-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {disbursements.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No disbursement milestones found for this grant.</p>
        </div>
      )}

      <DisbursementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        disbursement={editingDisbursement}
        onSave={handleSave}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Disbursement Milestone"
        description="Are you sure you want to delete this disbursement milestone? This action cannot be undone."
        onConfirm={confirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};
