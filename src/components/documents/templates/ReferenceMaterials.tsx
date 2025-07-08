import React, { useState } from 'react';
import { Search, Grid2X2, List, Filter, Eye, Download, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ReferenceCard } from './ReferenceCard';
import { ReferenceDetailDialog } from './ReferenceDetailDialog';

const referenceMaterialsData = [
  {
    id: '1',
    name: 'Code of Conduct',
    category: 'Company Documents',
    lastUpdated: '2025-01-15',
    size: '2.4 MB',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=240&fit=crop'
  },
  {
    id: '2',
    name: 'IT Usage Policy',
    category: 'Company Documents',
    lastUpdated: '2025-02-25',
    size: '2.7 MB',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=240&fit=crop'
  },
  {
    id: '3',
    name: 'Brand Guidelines 2024',
    category: 'Guidelines',
    lastUpdated: '2025-01-18',
    size: '1.5 MB',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=240&fit=crop'
  },
  {
    id: '4',
    name: 'Project Report Template',
    category: 'Templates',
    lastUpdated: '2025-03-01',
    size: '3.9 MB',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=240&fit=crop'
  },
  {
    id: '5',
    name: 'Budget Planning Template',
    category: 'Templates',
    lastUpdated: '2025-01-16',
    size: '2.2 MB',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=240&fit=crop'
  },
  {
    id: '6',
    name: 'System User Manual',
    category: 'Help Documents',
    lastUpdated: '2025-04-18',
    size: '1.9 MB',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=240&fit=crop'
  },
  {
    id: '7',
    name: 'Customer Service SOP',
    category: 'SOPs',
    lastUpdated: '2025-05-16',
    size: '4.8 MB',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=240&fit=crop'
  },
  {
    id: '8',
    name: 'Presentation Template',
    category: 'Templates',
    lastUpdated: '2025-04-13',
    size: '2.9 MB',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=240&fit=crop'
  },
  {
    id: '9',
    name: 'New Employee Guide',
    category: 'Help Documents',
    lastUpdated: '2025-03-12',
    size: '1.5 MB',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=240&fit=crop'
  }
];

export const ReferenceMaterials = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredDocuments = referenceMaterialsData.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || doc.category === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handlePreview = (id: string) => {
    const document = referenceMaterialsData.find(d => d.id === id);
    if (document) {
      setSelectedDocument(document);
      setIsDialogOpen(true);
    }
  };

  const handleDownload = (id: string) => {
    console.log('Download document:', id);
    // TODO: Implement download logic
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search reference materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
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

          {/* Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedFilter('all')}>
                All Categories
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('Company Documents')}>
                Company Documents
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('Guidelines')}>
                Guidelines
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('Templates')}>
                Templates
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('Help Documents')}>
                Help Documents
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('SOPs')}>
                SOPs
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Documents Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDocuments.map((document) => (
            <ReferenceCard
              key={document.id}
              id={document.id}
              name={document.name}
              category={document.category}
              lastUpdated={document.lastUpdated}
              size={document.size}
              image={document.image}
              onPreview={handlePreview}
              onDownload={handleDownload}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Last Updated</TableHead>
                <TableHead className="font-semibold">Size</TableHead>
                <TableHead className="font-semibold w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-8 rounded overflow-hidden flex-shrink-0">
                        <img
                          className="w-full h-full object-cover"
                          alt={`${document.name} Preview`}
                          src={document.image}
                        />
                      </div>
                      <div className="font-medium text-gray-900">{document.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{document.category}</TableCell>
                  <TableCell className="text-gray-600">{document.lastUpdated}</TableCell>
                  <TableCell className="text-gray-600">{document.size}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePreview(document.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(document.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
            {searchQuery ? 'No reference materials found matching your search.' : 'No reference materials available.'}
          </p>
        </div>
      )}

      {/* Document Detail Dialog */}
      <ReferenceDetailDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        document={selectedDocument}
        onDownload={handleDownload}
      />
    </div>
  );
};