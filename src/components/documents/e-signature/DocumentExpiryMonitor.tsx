
import React, { useState } from 'react';
import { Search, FileText, Upload, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SendExpiryReminderDialog } from './expiry-monitor/SendExpiryReminderDialog';
import { ExpiryConfirmationDialog } from './expiry-monitor/ExpiryConfirmationDialog';

interface Document {
  id: string;
  name: string;
  owner: string;
  tags: string[];
  expiryDate: string;
  status: 'expired' | 'expiring' | 'active';
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Company Policy.pdf',
    owner: 'John Smith',
    tags: ['Finance', 'M&E'],
    expiryDate: '2025-02-16',
    status: 'expired'
  },
  {
    id: '2',
    name: 'Employee Contract - John Doe.pdf',
    owner: 'John Smith',
    tags: ['HR', 'Contract'],
    expiryDate: '2025-02-16',
    status: 'expired'
  },
  {
    id: '3',
    name: 'Marketing Strategy 2025.pdf',
    owner: 'John Smith',
    tags: ['Finance', 'M&E'],
    expiryDate: '2025-02-16',
    status: 'expiring'
  },
  {
    id: '4',
    name: 'Budget Approval 2025.pdf',
    owner: 'John Smith',
    tags: ['HR', 'Contract'],
    expiryDate: '2025-02-16',
    status: 'expiring'
  },
  {
    id: '5',
    name: 'Company Policy.pdf',
    owner: 'John Smith',
    tags: ['Reports'],
    expiryDate: '2025-02-16',
    status: 'expired'
  },
  {
    id: '6',
    name: 'Product Launch Plan.pdf',
    owner: 'John Smith',
    tags: ['Reports'],
    expiryDate: '2025-02-16',
    status: 'active'
  },
  {
    id: '7',
    name: 'Company Policy.pdf',
    owner: 'John Smith',
    tags: ['Finance', 'M&E'],
    expiryDate: '2025-02-16',
    status: 'expired'
  },
  {
    id: '8',
    name: 'Company Policy.pdf',
    owner: 'John Smith',
    tags: ['Finance', 'M&E'],
    expiryDate: '2025-02-16',
    status: 'expired'
  },
  {
    id: '9',
    name: 'Company Policy.pdf',
    owner: 'John Smith',
    tags: ['Finance', 'M&E'],
    expiryDate: '2025-02-16',
    status: 'active'
  },
  {
    id: '10',
    name: 'Company Policy.pdf',
    owner: 'John Smith',
    tags: ['Finance', 'M&E'],
    expiryDate: '2025-02-16',
    status: 'active'
  }
];

export const DocumentExpiryMonitor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const documentsPerPage = 10;

  // Filter documents
  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesOwner = ownerFilter === 'all' || doc.owner === ownerFilter;
    return matchesSearch && matchesStatus && matchesOwner;
  });

  // Paginate documents
  const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);
  const startIndex = (currentPage - 1) * documentsPerPage;
  const paginatedDocuments = filteredDocuments.slice(startIndex, startIndex + documentsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 rounded-[5px] text-xs">Expired</Badge>;
      case 'expiring':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 rounded-[5px] text-xs">Expiring</Badge>;
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 rounded-[5px] text-xs">Active</Badge>;
      default:
        return <Badge className="rounded-[5px] text-xs">{status}</Badge>;
    }
  };

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      'Finance': 'bg-blue-100 text-blue-800 border-blue-200',
      'M&E': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'HR': 'bg-purple-100 text-purple-800 border-purple-200',
      'Contract': 'bg-green-100 text-green-800 border-green-200',
      'Reports': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[tag] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleSendReminder = (document: Document) => {
    setSelectedDocument(document);
    setShowReminderDialog(true);
  };

  const handleReminderSent = () => {
    setShowReminderDialog(false);
    setShowConfirmationDialog(true);
  };

  const handleBackToMonitor = () => {
    setShowConfirmationDialog(false);
    setSelectedDocument(null);
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 rounded-[5px] bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="expiring">Expiring</SelectItem>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ownerFilter} onValueChange={setOwnerFilter}>
              <SelectTrigger className="w-32 rounded-[5px] bg-white">
                <SelectValue placeholder="Owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Owners</SelectItem>
                <SelectItem value="John Smith">John Smith</SelectItem>
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
                  <TableHead className="font-semibold">Owner</TableHead>
                  <TableHead className="font-semibold">Tags</TableHead>
                  <TableHead className="font-semibold">Expiry Date</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
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
                    <TableCell className="text-gray-600">{document.owner}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {document.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            className={`${getTagColor(tag)} rounded-[5px] text-xs border`}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{document.expiryDate}</TableCell>
                    <TableCell>{getStatusBadge(document.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-gray-700 p-1 h-auto"
                          onClick={() => handleSendReminder(document)}
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-gray-700 p-1 h-auto"
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
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

        {/* Send Reminder Dialog */}
        {selectedDocument && (
          <SendExpiryReminderDialog
            open={showReminderDialog}
            onOpenChange={setShowReminderDialog}
            document={selectedDocument}
            onReminderSent={handleReminderSent}
          />
        )}

        {/* Confirmation Dialog */}
        <ExpiryConfirmationDialog
          open={showConfirmationDialog}
          onOpenChange={setShowConfirmationDialog}
          onBackToMonitor={handleBackToMonitor}
        />
      </div>
    </div>
  );
};
