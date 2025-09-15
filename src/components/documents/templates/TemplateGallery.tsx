import React, { useState } from 'react';
import { Search, Grid2X2, List, Filter, Plus, Eye, Download, Edit2, MoreHorizontal, Play } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { TemplateCard } from './TemplateCard';
import { TemplateDetailDialog } from './TemplateDetailDialog';
import { TemplateEditor } from './TemplateEditor';
import { CreateTemplateDialog } from './CreateTemplateDialog';
import { useTemplates, useCreateDocumentFromTemplate, useCreateTemplate, useUpdateTemplate } from '@/hooks/useTemplates';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const TemplateGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  const { data: templates, isLoading, error } = useTemplates({
    category: selectedFilter !== 'all' ? selectedFilter : undefined,
    search: searchQuery,
  });

  const createFromTemplateMutation = useCreateDocumentFromTemplate();

  const filteredTemplates = templates || [];

  const handleUseTemplate = async (id: string) => {
    const template = templates?.find(t => t.id === id);
    if (template) {
      try {
        await createFromTemplateMutation.mutateAsync({
          template_id: id,
          title: `${template.title} Copy`,
          description: `Document created from ${template.title} template`,
        });
      } catch (error) {
        console.error('Failed to create document from template:', error);
      }
    }
  };

  const handleView = (id: string) => {
    const template = templates?.find(t => t.id === id);
    if (template) {
      setSelectedTemplate(template);
      setIsDialogOpen(true);
    }
  };

  const handleEdit = (id: string) => {
    const template = templates?.find(t => t.id === id);
    if (template) {
      setEditingTemplate(template);
      setIsEditing(true);
    }
  };

  const handleBackToGallery = () => {
    setIsEditing(false);
    setEditingTemplate(null);
  };

  const createTemplateMutation = useCreateTemplate();
  const updateTemplateMutation = useUpdateTemplate();

  const handleSaveTemplate = async (content: string) => {
    if (editingTemplate?.id === 'new') {
      // Create new template
      try {
        await createTemplateMutation.mutateAsync({
          title: editingTemplate.title,
          description: content.substring(0, 200) + '...', // First 200 chars as description
          category: editingTemplate.category,
          file_name: `${editingTemplate.title.replace(/\s+/g, '-').toLowerCase()}.html`,
          file_path: `templates/${Date.now()}-${editingTemplate.title.replace(/\s+/g, '-').toLowerCase()}.html`,
          mime_type: 'text/html',
          file_size: content.length,
        });
        setIsEditing(false);
        setEditingTemplate(null);
      } catch (error) {
        console.error('Failed to create template:', error);
      }
    } else {
      // Update existing template
      try {
        await updateTemplateMutation.mutateAsync({
          id: editingTemplate.id,
          title: editingTemplate.title,
          description: content.substring(0, 200) + '...',
          category: editingTemplate.category,
        });
        setIsEditing(false);
        setEditingTemplate(null);
      } catch (error) {
        console.error('Failed to update template:', error);
      }
    }
  };

  const handlePublishTemplate = async (content: string) => {
    await handleSaveTemplate(content);
  };

  const handleCreateTemplate = () => {
    // Create a new template object for editing
    const newTemplate = {
      id: 'new',
      title: 'New Template',
      category: 'Document',
      department: 'General',
      lastUpdated: 'Just now',
      content: ''
    };
    setEditingTemplate(newTemplate);
    setIsEditing(true);
  };

  // If editing, show the editor
  if (isEditing && editingTemplate) {
    return (
      <TemplateEditor
        template={editingTemplate}
        onBack={handleBackToGallery}
        onSave={handleSaveTemplate}
        onPublish={handlePublishTemplate}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
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
            placeholder="Search templates..."
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
              <DropdownMenuItem onClick={() => setSelectedFilter('Agreement')}>
                Agreement
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('Financial')}>
                Financial
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('Document')}>
                Document
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Create Template Button */}
          <CreateTemplateDialog />
        </div>
      </div>

      {/* Templates Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              id={template.id}
              title={template.title}
              category={template.category || template.template_category || 'Document'}
              department={template.creator?.full_name || 'System'}
              lastUpdated={formatDistanceToNow(new Date(template.updated_at), { addSuffix: true })}
              image="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=240&fit=crop" // Default template image
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
                          src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=240&fit=crop"
                        />
                      </div>
                      <div className="font-medium text-gray-900">{template.title}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{template.category || template.template_category || 'Document'}</TableCell>
                  <TableCell className="text-gray-600">{template.creator?.full_name || 'System'}</TableCell>
                  <TableCell className="text-gray-600">{formatDistanceToNow(new Date(template.updated_at), { addSuffix: true })}</TableCell>
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
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery ? 'No templates found matching your search.' : 'No templates available.'}
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