
import React from "react";
import { Button } from "@/components/ui/button";

interface DonorTablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalDonors: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const DonorTablePagination: React.FC<DonorTablePaginationProps> = ({
  currentPage,
  totalPages,
  totalDonors,
  itemsPerPage,
  onPageChange
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-gray-700">
        Showing {startIndex + 1} to {Math.min(endIndex, totalDonors)} of {totalDonors} Donors
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default DonorTablePagination;
