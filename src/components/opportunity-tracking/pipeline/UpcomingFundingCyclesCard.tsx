
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Calendar } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useDonorFundingCycles } from "@/hooks/useDonorFundingCycles";
import { getMonthName } from "@/utils/monthConversion";

const UpcomingFundingCyclesCard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch funding cycles data
  const { data: rawFundingCycles = [], isLoading } = useDonorFundingCycles();

  // Filter and format upcoming funding cycles
  const upcomingCycles = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    return rawFundingCycles
      .filter(cycle => 
        cycle.status === 'upcoming' || 
        (cycle.year > currentYear) || 
        (cycle.year === currentYear && cycle.start_month > currentMonth)
      )
      .map(cycle => ({
        name: cycle.name,
        date: `Opens ${getMonthName(cycle.start_month)} ${cycle.year}`,
        description: cycle.description || ''
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [rawFundingCycles]);

  const totalPages = Math.ceil(upcomingCycles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = upcomingCycles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <span className="font-semibold text-foreground">Upcoming Funding Cycles</span>
      </div>
      
      {upcomingCycles.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Upcoming Cycles"
          description="No upcoming funding cycles found. Check back later or add new funding cycles."
        />
      ) : (
        <>
          <div className="space-y-3">
            {currentItems.map((funding, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                <span className="text-left font-medium text-foreground">{funding.name}</span>
                <span className="text-right text-muted-foreground">{funding.date}</span>
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
        </>
      )}
    </Card>
  );
};

export default UpcomingFundingCyclesCard;
