import React, { useState } from 'react';
import { Search, Grid2X2, List, Filter, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ComplianceDocumentCard } from './ComplianceDocumentCard';
import { complianceDocumentsData } from './data/complianceDocumentsData';
import { DocumentDetailDialog } from './DocumentDetailDialog';

export const ComplianceDocuments = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredDocuments = complianceDocumentsData.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDocument = (document: any) => {
    setSelectedDocument(document);
    setIsDialogOpen(true);
  };

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
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Document Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <ComplianceDocumentCard
              key={document.id}
              document={document}
              onViewDocument={handleViewDocument}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Effective Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{document.title}</div>
                      <div className="text-sm text-gray-500">{document.description}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{document.department}</TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(document.effectiveDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(document.expiresDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      document.status === 'Active' && 'bg-green-100 text-green-800 border-green-200',
                      document.status === 'Pending' && 'bg-yellow-100 text-yellow-800 border-yellow-200',
                      document.status === 'Retired' && 'bg-gray-100 text-gray-800 border-gray-200'
                    )}>
                      {document.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 border-violet-600 text-violet-600 hover:bg-violet-50"
                      onClick={() => handleViewDocument(document)}
                    >
                      <Eye className="h-4 w-4" />
                      View Document
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
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