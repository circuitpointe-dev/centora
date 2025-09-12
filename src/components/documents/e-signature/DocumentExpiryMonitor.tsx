import React, { useState } from 'react';
import { Loader2, Search, FileText, MoreHorizontal, Upload, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useExpiringDocuments, useDocumentOwners, useSendExpiryReminder, ExpiringDocument } from '@/hooks/useDocumentExpiry';
import { SendExpiryReminderDialog } from './SendExpiryReminderDialog';
import { ExpiryConfirmationDialog } from './ExpiryConfirmationDialog';

export const DocumentExpiryMonitor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocument, setSelectedDocument] = useState<ExpiringDocument | null>(null);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const documentsPerPage = 10;

  const { data: documents, isLoading, error } = useExpiringDocuments({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    owner: ownerFilter !== 'all' ? ownerFilter : undefined,
    search: searchTerm,
  });

  const { data: owners } = useDocumentOwners();
  const sendReminderMutation = useSendExpiryReminder();

  // Paginate documents
  const filteredDocuments = documents || [];
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

  const handleSendReminder = (document: ExpiringDocument) => {
    setSelectedDocument(document);
    setShowReminderDialog(true);
  };

  const handleUploadDocument = (documentId: string) => {
    console.log('Upload document for:', documentId);
  };

  const handleReminderSent = async (params: { recipient_email: string; message: string }) => {
    if (selectedDocument) {
      try {
        await sendReminderMutation.mutateAsync({
          document_id: selectedDocument.document_id,
          recipient_email: params.recipient_email,
          message: params.message,
        });
        setShowReminderDialog(false);
        setShowConfirmationDialog(true);
      } catch (error) {
        console.error('Failed to send reminder:', error);
      }
    }
  };

  const handleBackToMonitor = () => {
    setShowConfirmationDialog(false);
    setSelectedDocument(null);
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
          <p className="text-red-600 mb-2">Failed to load expiring documents</p>
          <p className="text-gray-500 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

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
                {owners?.map(owner => (
                  <SelectItem key={owner.id} value={owner.name}>
                    {owner.name}
                  </SelectItem>
                ))}
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-gray-700 p-1 h-auto"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-white">
                          <DropdownMenuItem
                            onClick={() => handleSendReminder(document)}
                            className="flex items-center gap-2.5 p-2.5 cursor-pointer hover:bg-gray-100"
                          >
                            <Mail className="w-4 h-4" />
                            <span className="text-[#38383899] text-sm font-normal">
                              Send Email
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUploadDocument(document.id)}
                            className="flex items-center gap-2.5 p-2.5 cursor-pointer hover:bg-gray-100"
                          >
                            <Upload className="w-4 h-4" />
                            <span className="text-[#38383899] text-sm font-normal">
                              Upload
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
