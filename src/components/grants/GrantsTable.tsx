import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Plus, Grid3X3, List } from 'lucide-react';
import { GrantsTableFilters } from './components/GrantsTableFilters';
import { GrantsTableRow } from './components/GrantsTableRow';
import { GrantsGridCard } from './components/GrantsGridCard';
import { ExportDropdown } from './components/ExportDropdown';
import { EmptyGrantsState } from './components/EmptyGrantsState';
import { useGrantsFilters } from './hooks/useGrantsFilters';

export const GrantsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const { filters, setFilters, filteredData } = useGrantsFilters();

  const itemsPerPage = viewMode === 'grid' ? 12 : 5;
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
    <div className="w-full"> {/* Replaced Card with a simple div */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 mt-6"> {/* Replaced CardHeader with a div and added margin */}
        <h2 className="text-xl font-medium">Grants Portfolio</h2> {/* Replaced CardTitle with h2, maintaining style */}
        <div className="flex gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-muted rounded-md p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`h-8 px-3 ${viewMode === 'grid' ? 'bg-background shadow-sm' : ''}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('list')}
              className={`h-8 px-3 ${viewMode === 'list' ? 'bg-background shadow-sm' : ''}`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <ExportDropdown data={filteredData} />
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
            <Link to="/dashboard/grants/new">
              <Plus className="h-4 w-4 mr-1" />
              New Grant
            </Link>
          </Button>
        </div>
      </div>

      <div className="p-0"> {/* Replaced CardContent with a div; 'p-0' if no padding is desired */}
        <GrantsTableFilters 
          filters={filters} 
          onFiltersChange={setFilters}
          disabled={!hasData}
        />

        {!hasData ? (
          <EmptyGrantsState />
        ) : (
          <>
            {viewMode === 'list' ? (
              /* Table View */
              <div className="rounded-md border mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Grant Name</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Compliance</TableHead>
                      <TableHead>Disbursement</TableHead>
                      <TableHead>Reporting Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map((grant) => (
                      <GrantsTableRow key={grant.id} grant={grant} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {currentData.map((grant) => (
                  <GrantsGridCard key={grant.id} grant={grant} />
                ))}
              </div>
            )}

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