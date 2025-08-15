
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Mock data for upcoming funding cycles
const upcomingFunding = [
  { name: "UNICEF Youth Innovation", date: "Opens June 1, 2025" },
  { name: "Gates Foundation Education", date: "Opens June 15, 2025" },
  { name: "Ford Foundation Social Justice", date: "Opens July 1, 2025" },
  { name: "World Bank Climate Action", date: "Opens July 10, 2025" },
  { name: "EU Horizon Europe", date: "Opens August 1, 2025" },
  { name: "USAID Democracy Fund", date: "Opens August 15, 2025" },
  { name: "Rockefeller Foundation", date: "Opens September 1, 2025" },
  { name: "MacArthur Foundation", date: "Opens September 20, 2025" },
  { name: "Open Society Foundations", date: "Opens October 1, 2025" },
  { name: "Robert Wood Johnson Foundation", date: "Opens October 15, 2025" },
  { name: "Knight Foundation", date: "Opens November 1, 2025" },
  { name: "Kellogg Foundation", date: "Opens November 20, 2025" },
];

const UpcomingFundingCyclesCard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(upcomingFunding.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = upcomingFunding.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <span className="font-semibold">Upcoming Funding Cycles</span>
      </div>
      <div className="space-y-3">
        {currentItems.map((funding, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
            <span className="text-left font-medium">{funding.name}</span>
            <span className="text-right text-gray-600">{funding.date}</span>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </Card>
  );
};

export default UpcomingFundingCyclesCard;
