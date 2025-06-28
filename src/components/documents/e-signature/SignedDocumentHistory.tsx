
import React, { useState } from 'react';
import { Search, FileText, Users, MoreVertical, Eye, Download, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface SignedDocument {
  id: string;
  name: string;
  status: 'completed';
  dateSigned: string;
  signers: number;
}

const mockSignedDocuments: SignedDocument[] = [
  {
    id: '1',
    name: 'Company Policy.pdf',
    status: 'completed',
    dateSigned: '2025-04-15',
    signers: 3
  },
  {
    id: '2',
    name: 'Annual Contract Agreement 2024',
    status: 'completed',
    dateSigned: '2025-04-15',
    signers: 3
  },
  {
    id: '3',
    name: 'Employee NDA Document',
    status: 'completed',
    dateSigned: '2025-04-15',
    signers: 3
  },
  {
    id: '4',
    name: 'Service Agreement',
    status: 'completed',
    dateSigned: '2025-04-15',
    signers: 3
  },
  {
    id: '5',
    name: 'Partnership Agreement',
    status: 'completed',
    dateSigned: '2025-04-15',
    signers: 3
  },
  {
    id: '6',
    name: 'Employee Contract',
    status: 'completed',
    dateSigned: '2025-04-15',
    signers: 3
  },
  {
    id: '7',
    name: 'Quarterly Report.pdf',
    status: 'completed',
    dateSigned: '2025-04-15',
    signers: 3
  },
  {
    id: '8',
    name: 'Budget 2025.pdf',
    status: 'completed',
    dateSigned: '2025-04-15',
    signers: 3
  },
  {
    id: '9',
    name: 'Audit plan',
    status: 'completed',
    dateSigned: '2025-04-15',
    signers: 3
  },
  {
    id: '10',
    name: 'Company Policy.pdf',
    status: 'completed',
    dateSigned: '2025-04-15',
    signers: 3
  }
];

export const SignedDocumentHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const documentsPerPage = 10;

  // Filter documents
  const filteredDocuments = mockSignedDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    // Add date filtering logic if needed
    return matchesSearch;
  });

  // Paginate documents
  const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);
  const startIndex = (currentPage - 1) * documentsPerPage;
  const paginatedDocuments = filteredDocuments.slice(startIndex, startIndex + documentsPerPage);

  const handleViewCertificate = (documentId: string) => {
    // Navigate to certificate tab - in a real app this would use router
    console.log('View certificate for document:', documentId);
  };

  const handleDownloadPDF = (documentId: string) => {
    // Download signed PDF
    console.log('Download PDF for document:', documentId);
  };

  const handleReInitiateWorkflow = (documentId: string) => {
    // Re-initiate workflow
    console.log('Re-initiate workflow for document:', documentId);
  };

  return (
    <div className="bg-gray-50 min-h-full p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-[5px] bg-white"
            />
          </div>

          <div className="flex gap-2">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-40 rounded-[5px] bg-white">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="rounded-[5px] bg-white border-gray-300"
            >
              Filter
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card className="rounded-[5px] bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Document Name</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Date Signed</TableHead>
                  <TableHead className="font-semibold">Signers</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDocuments.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{document.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 rounded-[5px] text-xs">
                        Completed
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(document.dateSigned).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{document.signers}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-gray-700 p-1 h-auto"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-white">
                          <DropdownMenuItem
                            onClick={() => handleViewCertificate(document.id)}
                            className="flex items-center gap-2.5 p-2.5 cursor-pointer hover:bg-gray-100"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="text-[#38383899] text-sm font-normal">
                              View Certificate
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownloadPDF(document.id)}
                            className="flex items-center gap-2.5 p-2.5 cursor-pointer hover:bg-gray-100"
                          >
                            <Download className="w-4 h-4" />
                            <span className="text-[#38383899] text-sm font-normal">
                              Download Signed PDF
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleReInitiateWorkflow(document.id)}
                            className="flex items-center gap-2.5 p-2.5 cursor-pointer hover:bg-gray-100"
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span className="text-[#38383899] text-sm font-medium">
                              Re-initiate Workflow
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
