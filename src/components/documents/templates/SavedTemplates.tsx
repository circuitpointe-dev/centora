import React, { useState } from 'react';
import { Search, Grid2X2, List, Filter, Eye, Download, MoreHorizontal, Edit2, Play } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { TemplateCard } from './TemplateCard';
import { TemplateDetailDialog } from './TemplateDetailDialog';
import { useDocuments } from '@/hooks/useDocuments';
import { Loader2 } from 'lucide-react';

export const SavedTemplates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch templates from backend (documents marked as templates)
  const { data: templates, isLoading, error } = useDocuments({
    search: searchQuery,
    is_template: true,
  });

  const filteredTemplates = React.useMemo(() => {
    if (!templates) return [];
    
    return templates.filter(template => {
      const matchesFilter = selectedFilter === 'all' || template.template_category === selectedFilter;
      return matchesFilter;
    });
  }, [templates, selectedFilter]);

  const handleUseTemplate = (id: string) => {
    console.log('Use template:', id);
    // TODO: Implement template usage logic
  };

  const handleView = (id: string) => {
    const template = templates?.find(t => t.id === id);
    if (template) {
      setSelectedTemplate(template);
      setIsDialogOpen(true);
    }
  };

  const handleEdit = (id: string) => {
    console.log('Edit template:', id);
    // TODO: Implement template editing logic
  };

  const handleDownload = (id: string) => {
    console.log('Download template:', id);
    // TODO: Implement download logic
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load templates</p>
          <p className="text-gray-500 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search saved templates..."
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
              <DropdownMenuItem onClick={() => setSelectedFilter('Report')}>
                Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('Document')}>
                Document
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('Proposal')}>
                Proposal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('Brief')}>
                Brief
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('Form')}>
                Form
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Templates Display */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filteredTemplates.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                id={template.id}
                title={template.title}
                category={template.template_category || 'Document'}
                department="General"
                lastUpdated={template.addedTime}
                image="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=240&fit=crop"
                viewMode={viewMode}
                onUseTemplate={handleUseTemplate}
                onView={handleView}
                onEdit={handleEdit}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Template Name</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Department</TableHead>
                  <TableHead className="font-semibold">Last Updated</TableHead>
                  <TableHead className="font-semibold w-16">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-8 rounded overflow-hidden flex-shrink-0">
                          <img
                            className="w-full h-full object-cover"
                            alt={`${template.title} Preview`}
                            src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=240&fit=crop"
                          />
                        </div>
                        <div className="font-medium text-gray-900">{template.title}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{template.template_category || 'Document'}</TableCell>
                    <TableCell className="text-gray-600">General</TableCell>
                    <TableCell className="text-gray-600">{template.addedTime}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleUseTemplate(template.id)}>
                            <Play className="h-4 w-4 mr-2" />
                            Use as Template
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleView(template.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(template.id)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(template.id)}>
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
        )
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery ? 'No saved templates found matching your search.' : 'No saved templates available.'}
          </p>
        </div>
      )}

      {/* Template Detail Dialog */}
      <TemplateDetailDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        template={selectedTemplate}
        onUseTemplate={handleUseTemplate}
        onEdit={handleEdit}
      />
    </div>
  );
};