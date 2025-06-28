
import React, { useState } from 'react';
import { Search, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { SideDialog, SideDialogContent, SideDialogTrigger } from '@/components/ui/side-dialog';
import { DocumentDetailsDialog } from './signature-tracking/DocumentDetailsDialog';

interface Document {
  id: string;
  name: string;
  status: 'pending' | 'completed' | 'declined';
  dateSent: string;
  dueDate: string;
  creator: string;
  signatureHistory: {
    status: string;
    person: string;
    date: string;
    completed: boolean;
  }[];
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Company Policy.pdf',
    status: 'pending',
    dateSent: '2025-02-16',
    dueDate: '2025-02-18',
    creator: 'Richard Nwamadi',
    signatureHistory: [
      { status: 'Request Sent', person: 'Millicent ERP', date: 'Apr 10, 2025 09:30 AM', completed: true },
      { status: 'Signed', person: 'Somachi ERP', date: 'Apr 10, 2025 09:30 AM', completed: true },
      { status: 'Pending Signature', person: 'Winifred Taigbenu', date: 'Apr 10, 2025 09:30 AM', completed: false },
    ]
  },
  {
    id: '2',
    name: 'Employee Contract - John Doe.pdf',
    status: 'completed',
    dateSent: '2025-04-12',
    dueDate: '2025-04-21',
    creator: 'HR Department',
    signatureHistory: [
      { status: 'Request Sent', person: 'John Doe', date: 'Apr 12, 2025 10:00 AM', completed: true },
      { status: 'Signed', person: 'John Doe', date: 'Apr 13, 2025 02:30 PM', completed: true },
    ]
  },
  {
    id: '3',
    name: 'Marketing Strategy 2025.pdf',
    status: 'declined',
    dateSent: '2025-04-17',
    dueDate: '2025-04-20',
    creator: 'Marketing Team',
    signatureHistory: [
      { status: 'Request Sent', person: 'CEO', date: 'Apr 17, 2025 11:00 AM', completed: true },
      { status: 'Declined', person: 'CEO', date: 'Apr 18, 2025 09:15 AM', completed: true },
    ]
  },
  {
    id: '4',
    name: 'Product Launch Plan.pdf',
    status: 'completed',
    dateSent: '2025-05-08',
    dueDate: '2025-05-15',
    creator: 'Product Team',
    signatureHistory: [
      { status: 'Request Sent', person: 'Product Manager', date: 'May 08, 2025 09:00 AM', completed: true },
      { status: 'Signed', person: 'Product Manager', date: 'May 09, 2025 03:45 PM', completed: true },
    ]
  },
  {
    id: '5',
    name: 'Budget Approval 2025.pdf',
    status: 'pending',
    dateSent: '2025-05-10',
    dueDate: '2025-05-19',
    creator: 'Finance Team',
    signatureHistory: [
      { status: 'Request Sent', person: 'CFO', date: 'May 10, 2025 08:30 AM', completed: true },
      { status: 'Pending Signature', person: 'CFO', date: 'May 10, 2025 08:30 AM', completed: false },
    ]
  },
];

export const SignatureTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const documentsPerPage = 5;

  // Calculate stats
  const stats = {
    pending: mockDocuments.filter(doc => doc.status === 'pending').length,
    overdue: mockDocuments.filter(doc => {
      const dueDate = new Date(doc.dueDate);
      const today = new Date();
      return doc.status === 'pending' && dueDate < today;
    }).length,
    signed: mockDocuments.filter(doc => doc.status === 'completed').length,
    declined: mockDocuments.filter(doc => doc.status === 'declined').length,
  };

  // Filter documents
  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Paginate documents
  const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);
  const startIndex = (currentPage - 1) * documentsPerPage;
  const paginatedDocuments = filteredDocuments.slice(startIndex, startIndex + documentsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'declined':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Declined</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleViewDetails = (document: Document) => {
    setSelectedDocument(document);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-[5px]">
          <CardContent className="p-6 text-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
            <div className="text-sm text-gray-500">Pending Signatures</div>
          </CardContent>
        </Card>

        <Card className="rounded-[5px]">
          <CardContent className="p-6 text-center">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2">
              <XCircle className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.overdue}</div>
            <div className="text-sm text-gray-500">Overdue Requests</div>
          </CardContent>
        </Card>

        <Card className="rounded-[5px]">
          <CardContent className="p-6 text-center">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.signed}</div>
            <div className="text-sm text-gray-500">Signed Documents</div>
          </CardContent>
        </Card>

        <Card className="rounded-[5px]">
          <CardContent className="p-6 text-center">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.declined}</div>
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
            className="pl-10 rounded-[5px]"
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 rounded-[5px]">
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
            <SelectTrigger className="w-40 rounded-[5px]">
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
      <Card className="rounded-[5px]">
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
                      <span className="font-medium">{document.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(document.status)}</TableCell>
                  <TableCell className="text-gray-600">{document.dateSent}</TableCell>
                  <TableCell className="text-gray-600">{document.dueDate}</TableCell>
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
      <SideDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <SideDialogContent className="w-[400px]">
          {selectedDocument && (
            <DocumentDetailsDialog
              document={selectedDocument}
              onClose={() => setDialogOpen(false)}
            />
          )}
        </SideDialogContent>
      </SideDialog>
    </div>
  );
};
