import React, { useState } from 'react';
import { Search, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useSignatureRequests, useSignatureStats } from '@/hooks/useESignature';
import { DocumentDetailsDialog } from './DocumentDetailsDialog';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const SignatureTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const documentsPerPage = 5;

  const { data: signatureRequests, isLoading, error } = useSignatureRequests({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchTerm,
  });

  const { data: stats } = useSignatureStats();

  // Filter and paginate documents
  const filteredDocuments = signatureRequests || [];
  const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);
  const startIndex = (currentPage - 1) * documentsPerPage;
  const paginatedDocuments = filteredDocuments.slice(startIndex, startIndex + documentsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'signed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Signed</Badge>;
      case 'declined':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Declined</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleViewDetails = (document: any) => {
    setSelectedDocument(document);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-full p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-full p-8">
        <div className="text-center py-12">
          <p className="text-red-600 mb-2">Failed to load signature requests</p>
          <p className="text-gray-500 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="rounded-[5px] bg-white">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
              <div className="text-sm text-gray-500">Pending Signatures</div>
            </CardContent>
          </Card>

          <Card className="rounded-[5px] bg-white">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2">
                <XCircle className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats?.overdue || 0}</div>
              <div className="text-sm text-gray-500">Overdue Requests</div>
            </CardContent>
          </Card>

          <Card className="rounded-[5px] bg-white">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats?.signed || 0}</div>
              <div className="text-sm text-gray-500">Signed Documents</div>
            </CardContent>
          </Card>

          <Card className="rounded-[5px] bg-white">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats?.declined || 0}</div>
              <div className="text-sm text-gray-500">Declined</div>
            </CardContent>
          </Card>
        </div>

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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 rounded-[5px] bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-40 rounded-[5px] bg-white">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="product">Product</SelectItem>
              </SelectContent>
            </Select>
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
                  <TableHead className="font-semibold">Date Sent</TableHead>
                  <TableHead className="font-semibold">Due Date</TableHead>
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
                    <TableCell>{getStatusBadge(document.status)}</TableCell>
                    <TableCell className="text-gray-600">
                      {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {document.expires_at ? formatDistanceToNow(new Date(document.expires_at), { addSuffix: true }) : 'No due date'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className="text-violet-600 hover:text-violet-700 p-0 h-auto"
                        onClick={() => handleViewDetails(document)}
                      >
                        View Details
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

        {/* Document Details Dialog */}
        {selectedDocument && (
          <DocumentDetailsDialog
            document={selectedDocument}
            onClose={() => setDialogOpen(false)}
          />
        )}
      </div>
    </div>
  );
};
