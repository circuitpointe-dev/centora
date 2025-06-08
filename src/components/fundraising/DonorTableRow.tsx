
import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { Donor } from "@/types/donor";
import { getFocusAreaColor } from "@/data/focusAreaData";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import EditDonorDialog from "./EditDonorDialog";

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
              Total: {formatCurrency(donor.totalDonations)}
            </p>
          </div>
        </TableCell>
        <TableCell>
          <div className="space-y-1">
            <p className="text-sm">{donor.contactInfo.email}</p>
            <p className="text-sm text-gray-500">{donor.contactInfo.phone}</p>
          </div>
        </TableCell>
        <TableCell>
          {formatDate(donor.lastDonation)}
        </TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1">
            {donor.interestTags.slice(0, 2).map((tag, index) => (
              <Badge key={index} className={`text-xs rounded-sm ${getFocusAreaColor(tag)}`}>
                {tag}
              </Badge>
            ))}
            {donor.interestTags.length > 2 && (
              <Badge variant="outline" className="text-xs rounded-sm">
                +{donor.interestTags.length - 2}
              </Badge>
            )}
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
            <EditDonorDialog donor={donor} />
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-600 hover:text-red-700"
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <ConfirmationDialog
        open={deleteConfirm}
        onOpenChange={setDeleteConfirm}
        title="Delete Donor"
        description={`Are you sure you want to delete "${donor.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default DonorTableRow;
