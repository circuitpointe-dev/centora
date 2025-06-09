
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit } from "lucide-react";
import { Donor } from "@/types/donor";

interface DonorTableRowProps {
  donor: Donor;
  onRowClick: (donor: Donor) => void;
  onDelete: (id: string) => void;
}

const DonorTableRow: React.FC<DonorTableRowProps> = ({
  donor,
  onRowClick,
  onDelete,
}) => {
  const handleRowClick = (e: React.MouseEvent) => {
    // Prevent row click when clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onRowClick(donor);
  };

  return (
    <TableRow 
      className="cursor-pointer hover:bg-gray-50" 
      onClick={handleRowClick}
    >
      <TableCell>
        <div>
          <div className="font-medium">{donor.name}</div>
          <div className="text-sm text-gray-500">{donor.organization}</div>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <div className="text-sm">{donor.contactInfo.email}</div>
          <div className="text-sm text-gray-500">{donor.contactInfo.phone}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          {donor.lastDonation ? (
            <>
              <div>${donor.lastDonation.amount?.toLocaleString()}</div>
              <div className="text-gray-500">{donor.lastDonation.date}</div>
            </>
          ) : (
            <span className="text-gray-500">No donations</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {donor.interestTags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs bg-gray-100 text-gray-700 border border-gray-300"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-600 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(donor.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default DonorTableRow;
