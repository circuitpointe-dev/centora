import React, { useState } from 'react';
import { Search, Grid2X2, List, Filter, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ComplianceDocumentCard } from './ComplianceDocumentCard';
import { DocumentDetailDialog } from './DocumentDetailDialog';
import { useComplianceDocuments } from '@/hooks/usePolicyDocuments';
import { Loader2 } from 'lucide-react';

export const ComplianceDocuments = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // Fetch compliance documents from backend
  const { data: documents, isLoading, error } = useComplianceDocuments({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    department: departmentFilter !== 'all' ? departmentFilter : undefined,
    search: searchQuery,
  });

  const handleViewDocument = (document: any) => {
    setSelectedDocument(document);
    setIsDialogOpen(true);
  };

  // Get unique departments from the documents
  const departments = React.useMemo(() => {
    if (!documents) return [];
    return Array.from(new Set(documents.map(doc => doc.department)));
  }, [documents]);

  const [filterOpen, setFilterOpen] = useState(false);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load compliance documents</p>
          <p className="text-gray-500 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        {/* Search Input */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search compliance documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 w-7 p-0",
                viewMode === 'grid' && "bg-muted"
              )}
              onClick={() => setViewMode('grid')}
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 w-7 p-0",
                viewMode === 'list' && "bg-muted"
              )}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Filter Button */}
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Department</label>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Document Display */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : documents && documents.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((document) => (
              <ComplianceDocumentCard
                key={document.id}
                document={{
                  id: document.id,
                  title: document.title,
                  description: document.description || '',
                  department: document.department || 'General',
                  effective_date: document.effective_date,
                  expires_date: document.expires_date || '',
                  status: document.status === 'active' ? 'Active' : 
                         document.status === 'expired' ? 'Retired' : 'Pending'
                }}
                onViewDocument={handleViewDocument}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Document Name</TableHead>
                  <TableHead className="font-semibold">Department</TableHead>
                  <TableHead className="font-semibold">Effective Date</TableHead>
                  <TableHead className="font-semibold">Expiry Date</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div className="font-medium text-gray-900">{document.title}</div>
                    </TableCell>
                    <TableCell className="text-gray-600">{document.department}</TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(document.effective_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {document.expires_date ? new Date(document.expires_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        document.status === 'active' && 'bg-green-100 text-green-800 border-green-200',
                        document.status === 'expired' && 'bg-yellow-100 text-yellow-800 border-yellow-200',
                        document.status === 'draft' && 'bg-gray-100 text-gray-800 border-gray-200'
                      )}>
                        {document.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <button 
                        className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 hover:underline font-medium"
                        onClick={() => handleViewDocument(document)}
                      >
                        <Eye className="h-4 w-4" />
                        View Document
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery ? 'No documents found matching your search.' : 'No compliance documents available.'}
          </p>
        </div>
      )}

      {/* Document Detail Dialog */}
      <DocumentDetailDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        document={selectedDocument}
      />
    </div>
  );
};