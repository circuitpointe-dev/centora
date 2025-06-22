
import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LayoutGrid, List, Upload, Search } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import DocumentCard from './DocumentCard';
import { documentsData } from './data';
import { Card } from '@/components/ui/card';
import DocumentPreviewCard from './DocumentPreviewCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DocumentList from './DocumentList';
import UploadDocumentDialog from './UploadDocumentDialog';

const filterOptions = [
  { id: 'all', name: 'All Documents' },
  { id: 'policies', name: 'Policies' },
  { id: 'finance', name: 'Finance' },
  { id: 'contracts', name: 'Contracts' },
  { id: 'm-e', name: 'M & E' },
  { id: 'uncategorized', name: 'Uncategorized' },
];

const DocumentsFeaturePage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const filteredDocuments = useMemo(() => {
    let filtered = activeFilter && activeFilter !== 'all'
      ? documentsData.filter((doc) => doc.category === activeFilter)
      : documentsData;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((doc) =>
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [activeFilter, searchQuery]);

  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  const handleSelectDocument = (id: string) => {
    setSelectedDocumentId(id);
  };

  const handleClosePreview = () => {
    setSelectedDocumentId(null);
  };

  const selectedDocument = useMemo(
    () => documentsData.find((doc) => doc.id === selectedDocumentId),
    [selectedDocumentId]
  );

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
  };

  return (
    <div className="space-y-6 p-6">
    <div className="flex flex-col h-full gap-6 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-medium text-gray-900">
          Document Manager
        </h1>
      </div>
      {/* Filters and Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={activeFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[250px] h-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-[30px]">
          <TooltipProvider>
            <div className="flex w-[75px] items-center gap-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className={`h-9 w-9 ${viewMode === 'grid' ? 'bg-muted' : ''}`} onClick={() => setViewMode('grid')}>
                    <LayoutGrid className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Grid View</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className={`h-9 w-9 ${viewMode === 'list' ? 'bg-muted' : ''}`} onClick={() => setViewMode('list')}>
                    <List className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>List View</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <Button 
            className="h-[43px] w-48 gap-1.5 rounded-[5px] bg-violet-600 px-4 py-3 text-sm font-medium text-white hover:bg-violet-700"
            onClick={() => setUploadDialogOpen(true)}
          >
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </Button>
        </div>
      </div>

      {/* Page Content */}
      <div className={`grid gap-8 flex-1 min-h-0 ${selectedDocumentId ? 'grid-cols-12' : 'grid-cols-1'}`}>
        <div className={selectedDocumentId ? 'col-span-12 lg:col-span-9' : 'col-span-12'}>
          <ScrollArea className="h-full">
            {filteredDocuments.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pr-6">
                  {filteredDocuments.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      {...doc}
                      selected={selectedDocumentId === doc.id}
                      onSelect={() => handleSelectDocument(doc.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="pr-6">
                  <DocumentList
                    documents={filteredDocuments}
                    selectedDocumentId={selectedDocumentId}
                    onSelectDocument={handleSelectDocument}
                  />
                </div>
              )
            ) : (
              <div className="text-center text-gray-500 py-10 pr-6">
                <p>{searchQuery.trim() ? 'No documents found matching your search.' : 'No documents found in this category.'}</p>
              </div>
            )}
          </ScrollArea>
        </div>
        {selectedDocumentId && selectedDocument && (
          <div className="hidden lg:block lg:col-span-3">
            <DocumentPreviewCard
              document={selectedDocument}
              onClose={handleClosePreview}
            />
          </div>
        )}
      </div>

      <UploadDocumentDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
    </div>
    </div>
  );
};

export default DocumentsFeaturePage;
