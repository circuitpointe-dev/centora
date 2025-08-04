import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Grid3X3, List, Eye, Search, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Grant {
  id: number;
  grantName: string;
  organization: string;
  status: string;
  timeline: string;
  fundsReceived: string;
  nextReportDue: string;
}

const grantsData: Grant[] = [
  {
    id: 1,
    grantName: 'Rural health initiative',
    organization: 'UNICEF',
    status: 'Active',
    timeline: 'Jan 2025 - Dec 2025',
    fundsReceived: '$20,000',
    nextReportDue: 'Sep 30, 2025'
  },
  {
    id: 2,
    grantName: 'Clean water project',
    organization: 'WHO',
    status: 'Active',
    timeline: 'Jan 2025 - Dec 2025',
    fundsReceived: '$20,000',
    nextReportDue: 'Sep 30, 2025'
  },
  {
    id: 3,
    grantName: 'Education for all',
    organization: 'UNESCO',
    status: 'Closed',
    timeline: 'Jan 2025 - Dec 2025',
    fundsReceived: '$20,000',
    nextReportDue: 'Sep 30, 2025'
  },
  {
    id: 4,
    grantName: 'Rural health initiative',
    organization: 'GAC',
    status: 'Active',
    timeline: 'Jan 2025 - Dec 2025',
    fundsReceived: '$20,000',
    nextReportDue: 'Sep 30, 2025'
  },
  {
    id: 5,
    grantName: 'Rural health initiative',
    organization: 'UNICEF',
    status: 'Closed',
    timeline: 'Jan 2025 - Dec 2025',
    fundsReceived: '$20,000',
    nextReportDue: 'Sep 30, 2025'
  }
];

const getStatusBadgeStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'closed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const NGOGrantsTable = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredData, setFilteredData] = useState(grantsData);

  const itemsPerPage = viewMode === 'grid' ? 12 : 5;

  // Filter data based on search and status
  useEffect(() => {
    let filtered = grantsData;

    if (searchQuery) {
      filtered = filtered.filter(grant =>
        grant.grantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grant.organization.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(grant =>
        grant.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const GridCard = ({ grant }: { grant: Grant }) => (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-sm">{grant.grantName}</h3>
          <Badge className={getStatusBadgeStyle(grant.status)}>{grant.status}</Badge>
        </div>
        <div className="space-y-1 text-xs text-gray-600">
          <p><span className="font-medium">Organization:</span> {grant.organization}</p>
          <p><span className="font-medium">Timeline:</span> {grant.timeline}</p>
          <p><span className="font-medium">Funds Received:</span> {grant.fundsReceived}</p>
          <p><span className="font-medium">Next Report:</span> {grant.nextReportDue}</p>
        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => navigate(`/dashboard/grants/ngo-view/${grant.id}`)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
      </div>
    </Card>
  );

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h2 className="text-xl font-medium">Grant List</h2>
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
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search grant, organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {filteredData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No grants found matching your criteria.
        </div>
      ) : (
        <>
          {viewMode === 'list' ? (
            /* Table View */
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grant</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timeline</TableHead>
                    <TableHead>Funds Received</TableHead>
                    <TableHead>Next Report Due</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.map((grant) => (
                    <TableRow key={grant.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{grant.grantName}</div>
                          <div className="text-sm text-gray-500">{grant.organization}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeStyle(grant.status)}>{grant.status}</Badge>
                      </TableCell>
                      <TableCell>{grant.timeline}</TableCell>
                      <TableCell>{grant.fundsReceived}</TableCell>
                      <TableCell>{grant.nextReportDue}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/dashboard/grants/ngo-view/${grant.id}`)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentData.map((grant) => (
                <GridCard key={grant.id} grant={grant} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
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
          )}
        </>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} grant{filteredData.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};