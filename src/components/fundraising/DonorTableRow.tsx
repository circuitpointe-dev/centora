
import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { type Donor } from "@/hooks/useDonors";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface DonorTableRowProps {
  donor: Donor;
  onRowClick: (donor: Donor) => void;
  onDelete: (id: string) => void;
}

const DonorTableRow: React.FC<DonorTableRowProps> = ({ donor, onRowClick, onDelete }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDeleteClick = () => {
    setDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(donor.id);
    setDeleteConfirm(false);
  };

  return (
    <>
      <TableRow 
        className="cursor-pointer hover:bg-gray-50"
        onClick={() => onRowClick(donor)}
      >
        <TableCell className="font-medium">
          <div>
            <p className="font-semibold text-gray-900">{donor.name}</p>
            <p className="text-sm text-gray-500">
              Total: {formatCurrency(donor.total_donations)}
            </p>
          </div>
        </TableCell>
        <TableCell>
          <div className="space-y-1">
            <p className="text-sm">{donor.contacts?.[0]?.email || 'No email'}</p>
            <p className="text-sm text-gray-500">{donor.contacts?.[0]?.phone || 'No phone'}</p>
          </div>
        </TableCell>
        <TableCell>
          {donor.last_donation_date ? formatDate(donor.last_donation_date) : 'No donations'}
        </TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1">
            {donor.focus_areas?.slice(0, 2).map((fa, index) => (
              <Badge key={index} className={`text-xs rounded-sm ${fa.focus_areas?.color || 'bg-gray-100'}`}>
                {fa.focus_areas?.name || 'Unknown'}
              </Badge>
            ))}
            {(donor.focus_areas?.length || 0) > 2 && (
              <Badge variant="outline" className="text-xs rounded-sm">
                +{(donor.focus_areas?.length || 0) - 2}
              </Badge>
            )}
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteClick}
              className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <ConfirmationDialog
        open={deleteConfirm}
        onOpenChange={setDeleteConfirm}
        title="⚠️ Permanently Delete Donor"
        description={`You are about to permanently delete "${donor.name}" and ALL associated data. This action cannot be undone and will remove:

• Complete donor profile and contact information
• All uploaded files from the donor-documents storage
• Complete engagement and communication history
• All donation and giving records
• All notes and comments

Are you absolutely certain you want to proceed? This data cannot be recovered.`}
        onConfirm={handleConfirmDelete}
        confirmText="Yes, Delete Everything"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
};

export default DonorTableRow;
