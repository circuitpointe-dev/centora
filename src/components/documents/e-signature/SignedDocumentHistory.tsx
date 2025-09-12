import React, { useState } from 'react';
import { Search, FileText, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useSignatureRequests } from '@/hooks/useESignature';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const SignedDocumentHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const documentsPerPage = 10;

  const { data: signatureRequests, isLoading, error } = useSignatureRequests({
    status: 'signed',
    search: searchTerm,
  });

  const filteredDocuments = signatureRequests || [];
  const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);
  const startIndex = (currentPage - 1) * documentsPerPage;
  const paginatedDocuments = filteredDocuments.slice(startIndex, startIndex + documentsPerPage);

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-full p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search signed documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-[5px] bg-white"
          />
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
                        <span className="font-medium">{document.document?.title || document.signer_email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Signed
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {document.signed_at ? formatDistanceToNow(new Date(document.signed_at), { addSuffix: true }) : 'Unknown'}
                    </TableCell>
                    <TableCell className="text-gray-600">1</TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className="text-violet-600 hover:text-violet-700 p-0 h-auto"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
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

        {/* Empty State */}
        {filteredDocuments.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm ? 'No signed documents found matching your search.' : 'No signed documents found.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};