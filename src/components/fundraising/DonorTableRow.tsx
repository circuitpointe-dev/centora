
import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
          <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
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
                <EditDonorDialog donor={donor} trigger={
                  <DropdownMenuItem className="flex items-center gap-2.5 p-2.5 cursor-pointer hover:bg-gray-100">
                    <Edit className="w-4 h-4" />
                    <span className="text-[#38383899] text-sm font-normal">
                      Edit
                    </span>
                  </DropdownMenuItem>
                } />
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
