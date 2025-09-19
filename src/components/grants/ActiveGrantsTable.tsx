import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Plus, Download } from 'lucide-react';
import { ActiveGrantsTableFilters } from './components/ActiveGrantsTableFilters';
import { ActiveGrantsTableRow } from './components/ActiveGrantsTableRow';
import { ExportDropdown } from './components/ExportDropdown';
import { EmptyGrantsState } from './components/EmptyGrantsState';
import { useActiveGrantsFilters } from '@/hooks/grants/useActiveGrantsFilters';
import { GrantsFilter } from '@/hooks/grants/useActiveGrantsFilters';

export const ActiveGrantsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { filters, setFilters, filteredData } = useActiveGrantsFilters();

  const itemsPerPage = 7;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const hasData = filteredData.length > 0;

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h2 className="text-xl font-medium">Active Grants Portfolio</h2>
        <div className="flex gap-2">
          <ExportDropdown data={filteredData} />
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
            <Link to="/dashboard/grants/new">
              <Plus className="h-4 w-4 mr-1" />
              New Grant
            </Link>
          </Button>
        </div>
      </div>

      <div className="p-0">
        <ActiveGrantsTableFilters 
          filters={filters} 
          onFiltersChange={(newFilters) => setFilters(newFilters)}
        />

        {!hasData ? (
          <EmptyGrantsState />
        ) : (
          <>
            {/* Table */}
            <div className="rounded-md border mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grant Name</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead>Disbursement</TableHead>
                    <TableHead>Reporting Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.map((grant) => (
                    <ActiveGrantsTableRow key={grant.id} grant={grant} />
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={currentPage === i + 1}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>
    </div>
  );
};